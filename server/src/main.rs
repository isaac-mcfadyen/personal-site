use include_dir::{Dir, include_dir};
use lambda_http::{run, service_fn, Body, Request, Response};
use lambda_runtime::{Error};

static FILES: Dir<'_> = include_dir!("$CARGO_MANIFEST_DIR/../dist");

#[tokio::main]
async fn main() -> Result<(), Error> {
	tracing_subscriber::fmt()
		.with_ansi(false)
		.with_target(false)
		.without_time()
		.init();

	let service = service_fn(|req| {
		async move {
			function_handler(req).await
		}
	});
	run(service).await
}

async fn function_handler(request: Request) -> eyre::Result<Response<Body>> {
	let path = request.uri().path();
	let has_extension = path.split('/')
		.last()
		.unwrap_or_default()
		.contains('.');

	// Add index.html to paths without extensions.
	let path = if !has_extension {
		format!(
			"{}/index.html",
			path.trim_end_matches('/')
		)
	} else {
		path.to_string()
	};

	// Trim starting slash.
	let path = path.trim_start_matches('/');

	// Look up the file, returning a 404 if not found.
	let file = FILES.get_file(path);
	let Some(file) = file else {
		return Ok(
			Response::builder()
				.status(404)
				.body(Body::from(
					format!("404 Not Found, resolved path {}", path)
				))
				.expect("failed to render response")
		);
	};

	// Start the response.
	let mut response = Response::builder();

	// Guess the mime type, not adding if the header isn't found.
	let mime = mime_guess::from_path(path).first();
	if let Some(mime) = mime {
		response = response.header("Content-Type", mime.to_string());
	}

	// Set a cache-control of very high.
	response = response.header("Cache-Control", "max-age=31536000");

	Ok(
		response
			.body(Body::from(file.contents()))
			.expect("failed to render response")
	)
}
