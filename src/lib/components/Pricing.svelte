<script lang="ts">
	let billingCycle: 'monthly' | 'yearly' = 'monthly';

	function toggleBilling(cycle: 'monthly' | 'yearly') {
		billingCycle = cycle;
	}

	const plans = [
		{
			name: 'Starter',
			price: 50,
			description: 'For individuals getting started.',
			features: [
				'3 Automated Workflows',
				'Basic AI Assistant Access',
				'Email + Slack Integration',
				'Monthly Performance Reports',
				'Email Support'
			],
			buttonLabel: 'Get Started',
			mostPopular: false
		},
		{
			name: 'Pro',
			price: 90,
			description: 'For growing teams.',
			features: [
				'10+ Automated Workflows',
				'Advanced AI Assistant Features',
				'Bi-Weekly Strategy Reviews',
				'CRM + Marketing Tool Integrations',
				'Priority Support'
			],
			buttonLabel: 'Get Started',
			mostPopular: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			description: 'For enterprises.',
			features: [
				'Unlimited Custom Workflows',
				'Dedicated AI Strategist',
				'API & Private Integrations',
				'Real-Time Performance Dashboards',
				'24/7 Premium Support + SLA'
			],
			buttonLabel: 'Get Started',
			mostPopular: false
		}
	];
</script>

<section class="bg-black py-20 text-white">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mt-6 mb-6 flex justify-center gap-3">
			<div class="relative flex items-center rounded-xl border border-gray-700 bg-[#111] p-1">
				<div
					class="absolute top-1 bottom-1 w-1/2 rounded-lg bg-white transition-transform duration-300"
					style="transform: translateX({billingCycle === 'monthly' ? '0%' : '100%'})"
				></div>

				<button
					class="relative z-10 w-44 flex-1 rounded-full px-5 py-1 text-sm transition-colors duration-300
				{billingCycle === 'monthly' ? 'text-black' : 'text-white'}"
					on:click={() => toggleBilling('monthly')}
				>
					Monthly
				</button>
				<button
					class="relative z-10 flex w-56 flex-1 justify-evenly rounded-full px-5 py-1 text-sm transition-colors duration-300
				{billingCycle === 'yearly' ? 'text-black' : 'text-white'}"
					on:click={() => toggleBilling('yearly')}
				>
					Yearly
					<span
						class="-mr-10 -ml-8 self-center rounded-full border border-gray-700 px-2 py-1 text-xs text-gray-400"
					>
						Save 20%
					</span>
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each plans as plan}
				<div
					class={`relative rounded-xl border border-gray-700 bg-linear-90 from-cyan-500/10 to-blue-600/20 p-6 ${
						plan.mostPopular ? 'bg-gradient-to-b from-white/5 to-black' : ''
					}`}
				>
					{#if plan.mostPopular}
						<div class="absolute top-4 right-4">
							<span
								class="rounded-full border border-gray-600 bg-white/10 px-2 py-1 text-xs text-white"
							>
								Popular
							</span>
						</div>
					{/if}
					<h3 class="mb-4 text-sm font-semibold">{plan.name}</h3>
					<div class="mb-6 flex items-baseline">
						<span class="text-4xl font-semibold">
							{typeof plan.price === 'number'
								? billingCycle === 'monthly'
									? `$${plan.price}`
									: `$${(plan.price * 0.8).toFixed(0)}`
								: plan.price}
						</span>
						{#if typeof plan.price === 'number'}
							<span class="ml-1 text-sm text-gray-400">/month</span>
						{/if}
					</div>
					<div class="relative">
						<button
							class="group relative inline-flex w-full items-center justify-center rounded-xl border border-neutral-400 bg-[#10203ead] px-6 py-3 text-sm font-semibold text-white shadow-md backdrop-blur-lg transition hover:bg-neutral-800"
						>
							Book A Free Call
							<svg
								class="ml-2 h-4 w-4 stroke-white transition-transform group-hover:translate-x-0.5"
								fill="none"
								stroke-width="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</button>

						<!-- Bottom Glow -->
						<div
							class="pointer-events-none absolute bottom-0 left-1/2 h-5 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-white opacity-20 blur-lg"
						></div>
						<div
							class="ml-[15px] h-[1px] w-[calc(100%-28px)] bg-linear-90 from-neutral-900 via-white to-neutral-900"
						></div>
					</div>
					<hr class="my-6 border-gray-700" />
					<ul class="space-y-4">
						{#each plan.features as feature}
							<li class="flex items-center gap-2">
								<span class="text-green-400">✔</span>
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="mt-10 flex justify-center">
			<div class="flex items-center gap-2 rounded-full border border-gray-700 px-4 py-2 text-xs">
				<span>💖</span>
				<span>We donate 2% of your membership to pediatric wellbeing</span>
			</div>
		</div>
	</div>
</section>

<style>
	button:disabled {
		cursor: default;
		opacity: 1;
	}
</style>
