<script lang="ts">
	const benefits = [
		{
			title: 'Real-Time Intelligence',
			description: 'Access accurate, real-time data to drive smarter decisions',
			icon: 'gauge'
		},
		{
			title: 'Measurable Impact',
			description: 'Track performance, uncover insights, and achieve data-backed growth',
			icon: 'bar'
		},
		{
			title: 'Seamless Integration',
			description: 'Connect tools, teams, and workflows with intelligent automation',
			icon: 'network'
		}
	];
</script>

<section class="w-full bg-[#0a0a0a] py-24">
	<div class="mx-auto max-w-7xl px-6 text-center">
		<!-- Badge -->
		<div
			class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs tracking-wider text-white/50 uppercase"
		>
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
					stroke-width="2"
					d="M12 8v4l3 3M9 3l3 3 3-3"
				/>
			</svg>
			Benefits
		</div>

		<!-- Title -->
		<h2 class="mb-4 text-4xl font-semibold text-white md:text-5xl">
			Why Choose <span class="font-normal text-white/60 italic">Us?</span>
		</h2>

		<!-- Subtitle -->
		<p class="mb-16 text-lg text-white/60">Everything you need to automate, optimize, and scale</p>

		<!-- Cards -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each benefits as benefit}
				<div
					class="group relative rounded-2xl border border-b-2 border-white/10 border-b-cyan-900 bg-[#0f0f0f] bg-linear-30 from-cyan-500/10 to-blue-600/1 p-8 transition hover:shadow-xl hover:shadow-indigo-500/10"
				>
					<!-- Icon -->
					<div class="mb-6 flex items-center justify-center">
						{#if benefit.icon === 'gauge'}
							<div class="relative h-24 w-24">
								<div
									class="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-b from-white/5 to-transparent"
								></div>
								<div
									class="absolute top-1/2 left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-linear-30 from-cyan-500 to-blue-600 shadow-sm shadow-indigo-500/50"
								></div>
								<div
									class="absolute top-1/2 left-1/2 h-10 w-1 origin-bottom -translate-x-1/2 -translate-y-full rotate-[300deg] transform rounded-full bg-white/10"
								></div>
							</div>
						{/if}

						{#if benefit.icon === 'bar'}
							<div class="flex gap-1.5">
								<div class="h-10 w-3 rounded-md bg-linear-30 from-cyan-500 to-blue-600"></div>
								<div class="h-14 w-3 rounded-md bg-linear-30 from-cyan-500 to-blue-600"></div>
								<div class="h-18 w-3 rounded-md bg-linear-30 from-cyan-500 to-blue-600"></div>
								<div class="h-24 w-3 rounded-md bg-linear-30 from-cyan-500 to-blue-600"></div>
							</div>
						{/if}

						{#if benefit.icon === 'network'}
							<div class="relative h-24 w-24">
								<!-- Outer Circle -->
								<div
									class="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent"
								></div>

								<!-- Center Node -->
								<div
									class="absolute top-1/2 left-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-white/20 bg-white/5"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 text-white/40"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3"
										/>
									</svg>
								</div>

								<!-- Radial Nodes -->
								{#each [0, 60, 120, 180, 240, 300] as angle}
									<div
										class="absolute z-2 mt-[6px] ml-[6px] h-3 w-3 rounded-full bg-linear-30 from-cyan-500 to-blue-600"
										style="top: calc(50% - 6px); left: calc(50% - 6px); transform: translate(-50%, -50%) rotate({angle}deg) translate(70px) rotate(-{angle}deg);"
									></div>
								{/each}

								<!-- Connecting Lines -->
								{#each [0, 60, 120, 180, 240, 300] as angle}
									<div
										class="absolute h-px w-[60px] bg-linear-30 from-cyan-500 via-blue-700 to-blue-950"
										style="top: 50%; left: 50%; transform: rotate({angle}deg) translateX(15px); transform-origin: center left;"
									></div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Title -->
					<h3 class="mb-3 text-xl font-semibold text-white">{benefit.title}</h3>

					<!-- Description -->
					<p class="text-sm leading-relaxed text-white/60">{benefit.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
