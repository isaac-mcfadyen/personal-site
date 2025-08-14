const TEMPLATE = `**Name:** {{name}}
**Email:** {{email}}
**Message:** {{message}}`;

type Env = {
	CONTACT_WEBHOOK_URL: string;
	TURNSTILE_SECRET_KEY: string;
};
export const onRequestPost: PagesFunction<Env> = async (context) => {
	let formData: FormData;
	try {
		formData = await context.request.formData();
	} catch (e) {
		return new Response("Redirecting to /contact", {
			status: 303,
			headers: {
				Location: "/contact?success=false",
			},
		});
	}

	const name = formData.get("name");
	const email = formData.get("email");
	const message = formData.get("message");
	const turnstileResponse = formData.get("cf-turnstile-response");
	if (
		name == null ||
		email == null ||
		message == null ||
		turnstileResponse == null
	) {
		return new Response("Redirecting to /contact", {
			status: 303,
			headers: {
				Location: "/contact?success=false",
			},
		});
	}
	const nameValue = name.toString();
	const emailValue = email.toString();
	const messageValue = message.toString();
	const turnstileResponseValue = turnstileResponse.toString();

	// Validate with Turnstile.
	let turnstileFormData = new FormData();
	turnstileFormData.append("secret", context.env.TURNSTILE_SECRET_KEY);
	turnstileFormData.append("response", turnstileResponseValue);
	const turnstileValidationReply = await fetch(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				secret: context.env.TURNSTILE_SECRET_KEY,
				response: turnstileResponseValue,
			}),
		}
	);
	const turnstileOutcome: any = await turnstileValidationReply.json();
	if (!turnstileOutcome.success) {
		return new Response("Redirecting to /contact", {
			status: 303,
			headers: {
				Location: "/contact?success=false",
			},
		});
	}

	try {
		const dateSent = new Date();
		const reply = await fetch(`${context.env.CONTACT_WEBHOOK_URL}?wait=true`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: "<@575799975116800030>",
				embeds: [
					{
						title: "New Contact Form Submission",
						description: TEMPLATE.replace("{{name}}", nameValue)
							.replace("{{email}}", emailValue)
							.replace("{{message}}", messageValue),
						footer: {
							text: `Sent at ${dateSent.toISOString()}`,
						},
					},
				],
			}),
		});
		if (!reply.ok) {
			console.log("Discord response was not OK: " + (await reply.text()));
			return new Response("Redirecting to /contact", {
				status: 303,
				headers: {
					Location: "/contact?success=false",
				},
			});
		}
	} catch (e) {
		console.error(e);
		return new Response("Redirecting to /contact", {
			status: 303,
			headers: {
				Location: "/contact?success=false",
			},
		});
	}

	return new Response("Redirecting to /contact", {
		status: 303,
		headers: {
			Location: "/contact?success=true",
		},
	});
};
