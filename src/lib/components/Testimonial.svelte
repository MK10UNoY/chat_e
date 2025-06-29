<script lang="ts">
	import profiledummy from '$lib/profile-avatar.webp';
	const badgeText = 'WE ANALYZE YOUR DATA';
	const quote = `We find what to `;
	const emphasized = {
		remember: 'remember',
		yourselves: 'yourselves',
		realSolutions: 'real solutions'
	};
</script>

<div class="flex flex-col items-center justify-center bg-[#0f1115] px-4 py-10">
	<!-- Badge -->
	<div class="mb-6 flex items-center gap-2 rounded-full bg-[#16191f] px-4 py-1.5">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-4 w-4 text-white"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l.7 2.151a1 1 0 00.95.69h2.262c.969 0 1.371 1.24.588 1.81l-1.833 1.332a1 1 0 00-.364 1.118l.7 2.151c.3.921-.755 1.688-1.538 1.118l-1.833-1.332a1 1 0 00-1.176 0l-1.833 1.332c-.783.57-1.838-.197-1.538-1.118l.7-2.151a1 1 0 00-.364-1.118L4.45 7.578c-.783-.57-.38-1.81.588-1.81h2.262a1 1 0 00.95-.69l.7-2.151z"
			/>
		</svg>
		<span class="text-xs font-medium text-white">{badgeText}</span>
	</div>

	<!-- Main Text -->
	<p class="max-w-4xl text-center text-3xl leading-relaxed font-light text-[#737881] sm:text-4xl">
		" We <span class="text-white italic">{emphasized.remember}</span> so that even when you forget,
		you dont have to repeat <span class="text-white italic">{emphasized.yourselves}</span> over and
		over again. Best part is we also give you
		<span class="text-white italic">{emphasized.realSolutions}</span>.
		<span class="text-white">"</span>
	</p>

	<!-- Avatar and Info -->
	<div class="mt-6 flex items-center gap-3">
		<img src={profiledummy} alt="avatar" class="h-9 w-9 rounded-full border border-white/10" />
		<span class="font-serif text-base text-[#c4c7cc] italic">Team Chat.E</span>
	</div>
</div>
