<script lang="ts">
	import { onMount } from "svelte";

	let success: boolean | null = null;
	onMount(() => {
		if (window.location.search.includes("success=true")) {
			success = true;
		} else if (window.location.search.includes("success=false")) {
			success = false;
		}
	});
</script>

<form
	class="w-64 m-2 mx-auto flex flex-col justify-center flex-wrap gap-4"
	method="post"
	action="/contact"
>
	<div class="flex flex-col">
		<label for="name" class="font-bold mb-1 text-sm">Name</label>
		<input
			required
			id="name"
			type="text"
			name="name"
			placeholder="Name"
			class="w-full p-1 px-3 border border-gray-600 bg-gray-700 rounded shadow-inner"
		/>
	</div>

	<div class="flex flex-col">
		<label for="email" class="font-bold mb-1 text-sm">Email</label>
		<input
			required
			id="email"
			type="email"
			name="email"
			placeholder="Email"
			class="w-full p-1 px-3 border border-gray-600 bg-gray-700 rounded shadow-inner"
		/>
	</div>

	<div class="flex flex-col">
		<label for="message" class="font-bold mb-1 text-sm">Message</label>
		<textarea
			required
			id="message"
			name="message"
			placeholder="Message"
			class="w-full p-1 px-3 border border-gray-600 bg-gray-700 rounded shadow-inner"
			rows="3"
		></textarea>
	</div>

	<div class="cf-turnstile" data-sitekey="0x4AAAAAAADUKutzeZvRXR2o"></div>
	<script
		src="https://challenges.cloudflare.com/turnstile/v0/api.js"
		async
		defer
	></script>

	<button
		class="ml-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
	>
		Send
	</button>

	{#if success != null}
		{#if success}
			<p class="text-green-400 font-bold text-center mt-2">
				Thanks for reaching out! Your message was successfully sent.
			</p>
		{:else}
			<p class="text-red-400 font-bold text-center mt-2">
				Your message couldn't be sent. Try again in a bit, or reach out to me at
				isaac@imcf.me if the problem persists.
			</p>
		{/if}
	{/if}
</form>
