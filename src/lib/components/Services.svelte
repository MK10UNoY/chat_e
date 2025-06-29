<script lang="ts">
	const services = [
		{
			icon: '/a3f9aa03-39e2-495b-a680-8d11b8ea3015.png', // Replace with actual icon
			title: 'Chat Assistant',
			description: 'Efficiently diagnose the dicease with its symptoms.'
		},
		{
			icon: '/a3f9aa03-39e2-495b-a680-8d11b8ea3015.png', // Replace with actual icon
			title: 'Realtime Voice Assistant',
			description: 'Use your voice to converse with Chat.E'
		},
		{
			icon: '/a3f9aa03-39e2-495b-a680-8d11b8ea3015.png', // Replace with actual icon
			title: 'Custom AI Solutions',
			description: 'Build tailored AI systems that align with your business goals and challenges.'
		}
	];
</script>

<section class="relative w-full bg-[#0a0a0a] py-24">
	<div class="mx-auto max-w-6xl px-6 text-center md:px-8">
		<div class="mb-4 flex justify-center">
			<div class="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
				<div class="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M12 4.5l7.5 4.33v8.67L12 21.5l-7.5-4.33V8.83L12 4.5z"
						/>
					</svg>
					SERVICES
				</div>
			</div>
		</div>

		<h2 class="text-4xl font-semibold text-white md:text-5xl">
			Smarter Services,
			<span class="font-normal text-white/80 italic">with Chat.E</span>
		</h2>

		<p class="mt-4 text-lg text-white/70">
			Everything you need to automate operations, boost productivity
		</p>

		<div class="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each services as service}
				<div
					class="group rounded-2xl border border-white/10 bg-linear-0 from-transparent to-blue-600/20 p-8 transition hover:border-white/20 hover:shadow-xl hover:shadow-white/5"
				>
					<h3 class="text-xl font-semibold text-white">
						{service.title}
					</h3>
					<p class="mt-2 text-sm text-white/70">
						{service.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
