<script lang="ts">
	import { fly, fade, slide } from 'svelte/transition';

	type FAQ = {
		question: string;
		answer: string;
		isOpen: boolean;
	};

	let faqs: FAQ[] = [
		{
			question: 'What types of processes can you automate?',
			answer:
				'We specialize in automating repetitive workflows across operations, marketing, sales, and customer support using AI and custom logic.',
			isOpen: true
		},
		{
			question: 'Do I need technical knowledge to use your service?',
			answer:
				'No, our solutions are designed to be user-friendly with minimal technical knowledge required.',
			isOpen: false
		},
		{
			question: 'Can you integrate with our existing tools?',
			answer:
				'Yes, we support integrations with a wide range of tools and platforms to fit your needs.',
			isOpen: false
		},
		{
			question: 'How long does implementation take?',
			answer: 'Implementation typically takes between 1-4 weeks depending on complexity.',
			isOpen: false
		},
		{
			question: 'Is your AI secure and compliant?',
			answer:
				'Absolutely. Our AI solutions adhere to the highest security standards and compliance requirements.',
			isOpen: false
		}
	];

	const toggleFAQ = (index: number) => {
		faqs = faqs.map((faq, i) => ({
			...faq,
			isOpen: i === index ? !faq.isOpen : faq.isOpen
		}));
	};
</script>

<section class="relative w-full bg-[#0f1117] px-6 py-1 text-white md:py-28">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->

		<div class="flex flex-col items-center">
			<div class="mb-4 flex items-center gap-2">
				<div class="flex items-center gap-2 rounded-full bg-[#181b23] px-3 py-1 text-sm">
					<svg
						class="h-4 w-4 text-white"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
						/>
					</svg>
					<span class="text-xs">FAQ'S</span>
				</div>
			</div>
			<h2 class="text-4xl font-bold md:text-5xl">
				Frequently Asked <span class="font-light italic">Questions</span>
			</h2>
			<p class="mt-4 max-w-xl text-center text-gray-400">
				Find quick answers to the most common support questions
			</p>
		</div>

		<!-- Main content -->
		<div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-[350px_1fr]">
			<!-- Left card -->
			<div
				class="flex h-min flex-col justify-between rounded-2xl border border-white/10 bg-[#181b23] bg-linear-30 from-cyan-500/10 to-blue-600/1 p-6"
			>
				<div class="flex flex-col items-center">
					<div class="mb-4 rounded-xl bg-black/50 p-3">
						<svg
							class="h-8 w-8 text-white"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 17h.01M12 7a4 4 0 00-4 4h1a3 3 0 116 0c0 1.657-1.343 3-3 3a1 1 0 100 2 1 1 0 001-1h1a4 4 0 00-4-4z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-xl font-semibold">Still Have Questions?</h3>
					<p class="text-center text-sm text-gray-400">
						Still have questions? Feel free to get in touch with us today!
					</p>
				</div>
				<button
					class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
					Ask A Question
				</button>
			</div>

			<!-- FAQ Accordions -->
			<div class="flex flex-col gap-4">
				{#each faqs as faq, index}
					<div
						class="overflow-hidden rounded-2xl border border-b-2 border-white/10 border-b-cyan-900 bg-[#181b23] bg-linear-0 from-cyan-500/10 to-blue-600/1"
					>
						<button
							class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white/5"
							on:click={() => toggleFAQ(index)}
						>
							<span class="font-medium">
								{faq.question}
							</span>
							<svg
								class="h-5 w-5 text-white transition-transform duration-300 ease-in-out"
								style="transform: rotate({faq.isOpen ? 180 : 0}deg)"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						{#if faq.isOpen}
							<div
								in:slide={{ duration: 300 }}
								out:slide={{ duration: 200 }}
								class="px-6 pb-5 text-sm text-gray-400"
							>
								{faq.answer}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
