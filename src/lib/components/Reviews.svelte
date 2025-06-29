<script lang="ts">
	import profiledummy from '$lib/profile-avatar.webp';
	type Testimonial = {
		name: string;
		role: string;
		company: string;
		avatar: string;
		quote: string;
	};

	const testimonials: Testimonial[] = [
		{
			name: 'Daniel Kim',
			role: 'Operations Lead',
			company: 'Flowbyte',
			avatar: profiledummy,
			quote:
				'Truly impressive. The AI assistant is fast, accurate, and blends into our daily ops without friction.'
		},
		{
			name: 'Priya Mehra',
			role: 'CTO',
			company: 'Brightstack Labs',
			avatar: profiledummy,
			quote:
				'Game-changer. Automation flows run flawlessly. Our team now focuses only on what really matters.'
		},
		{
			name: 'Elena Rodriguez',
			role: 'Product Manager',
			company: 'Nexora',
			avatar: profiledummy,
			quote:
				'Smooth setup. Their system replaced three tools. We saw improvements in just the first week.'
		},
		{
			name: 'Marcus Thompson',
			role: 'Marketing Director',
			company: 'OrbitShift',
			avatar: profiledummy,
			quote:
				'Surprisingly simple. The AI adapts quickly. Our campaigns are now running 2x more efficiently.'
		},
		{
			name: 'Sarah Wong',
			role: 'Analytics Manager',
			company: 'Corelink',
			avatar: profiledummy,
			quote:
				'Huge time-saver. Data is better organized. The insights we get now are actionable and fast.'
		},
		{
			name: 'Ravi Shah',
			role: 'COO',
			company: 'PixelNest Solutions',
			avatar: profiledummy,
			quote:
				'Very intuitive. No fluff, just performance. Our internal processes finally feel under control.'
		}
	];

	const brands = ['Dune', 'Oasis', 'Asterisk', 'Cooks', 'Opal', 'Dune'];
</script>

<section class="w-full bg-[#0B0B0F] px-6 py-16">
	<!-- Header -->
	<div class="mx-auto max-w-7xl text-center">
		<div class="mb-4">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white"
			>
				⭐ REVIEWS
			</div>
		</div>
		<h2 class="text-4xl font-semibold text-white">
			Trusted by <span class="text-[#9E9EAC] italic">Visionaries</span>
		</h2>
		<p class="mt-3 text-sm text-[#9E9EAC]">
			Hear from real users who achieved success with our automation
		</p>
	</div>

	<!-- Testimonials -->
	<div class="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each testimonials as t}
			<div
				class="relative rounded-2xl bg-white/5 bg-linear-30 from-cyan-500/10 to-blue-600/1 backdrop-blur-sm transition hover:border-white/20"
			>
				<!-- Outer border -->
				<div class="pointer-events-none absolute inset-0 rounded-2xl border border-white/5"></div>
				<!-- Inner content -->
				<div
					class="relative rounded-2xl border border-b-2 border-white/10 border-b-cyan-900 p-6 shadow-md"
				>
					<div class="flex items-center gap-3">
						<img src={t.avatar} alt={t.name} class="h-10 w-10 rounded-full object-cover" />
						<div>
							<div class="text-sm font-semibold text-white">{t.name}</div>
							<div class="text-xs text-[#9E9EAC]">
								{t.role} at {t.company}
							</div>
						</div>
					</div>
				</div>
				<p class="px-5 py-8 text-sm text-[#C3C3CC]">“{t.quote}”</p>
			</div>
		{/each}
	</div>
</section>
