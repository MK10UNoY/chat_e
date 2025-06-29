<script lang="ts">
	import BenefitsSection from '$lib/components/BenefitsSection.svelte';
	import FaQs from '$lib/components/FAQs.svelte';
	import Pricing from '$lib/components/Pricing.svelte';
	import Testimonial from '$lib/components/Testimonial.svelte';
	import Icon from '@iconify/svelte';
	import bgwave from '$lib/globe.jpeg';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Services from '$lib/components/Services.svelte';
	// --- SESSION LOGIC ---
	// Replace this with your actual session/user logic
	let user = null;
	// Example: import { user } from '$lib/stores/user';
	// $user will be truthy if logged in

	const socialLinks = [
		{ name: 'X', href: '#', icon: 'mdi:twitter' },
		{ name: 'Instagram', href: '#', icon: 'mdi:instagram' },
		{ name: 'Facebook', href: '#', icon: 'mdi:facebook' }
	];

	let isMenuOpen = false;
	let menuRef: HTMLElement;

	function handleClickOutside(event: MouseEvent) {
		if (menuRef && !menuRef.contains(event.target as Node)) {
			isMenuOpen = false;
		}
	}

	onMount(() => {
		gsap.from('.float-up', {
			y: 50,
			opacity: 0,
			duration: 1,
			ease: 'power3.out',
			stagger: 0.2,
			delay: 0.2
		});
	});
</script>

<section
	class="relative flex min-h-screen flex-col overflow-x-hidden bg-[#010d178d] bg-center"
	style="background-image: url({bgwave});"
>
	<!-- <div class="relative top-0 w-screen h-screen -z-1 bg-no-repeat bg-contain bg-bottom overflow-hidden zoom-in-25"></div> -->
	<!-- Navbar -->
	<div class="absolute top-5 left-5 flex items-center space-x-2">
		<img src="favicon.svg" alt="Logo" class="h-6 w-6" />
		<span class="font-serif text-xl text-white">Chat.E</span>
	</div>

	<!-- Desktop Nav Buttons -->
	<div class="absolute top-5 right-5 hidden space-x-4 sm:flex">
		{#if user}
			<a
				href="/dashboard"
				class="rounded-lg border border-green-500 bg-green-500 px-4 py-1 text-sm text-black hover:bg-green-600"
			>
				Dashboard
			</a>
		{/if}
		<a
			href="/login"
			class="rounded-lg border border-neutral-600 px-4 py-1 text-sm text-white hover:bg-neutral-800"
		>
			Login
		</a>
		<a
			href="/register"
			class="rounded-lg border border-sky-500 bg-sky-500 px-4 py-1 text-sm text-black hover:bg-sky-600"
		>
			Register
		</a>
	</div>

	<!-- Hamburger Icon for Mobile -->
	<div class="absolute top-5 right-5 sm:hidden">
		<button on:click|stopPropagation={() => (isMenuOpen = !isMenuOpen)} class="text-white">
			<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
	</div>

	<!-- Mobile Menu Dropdown -->
	{#if isMenuOpen}
		<div
			bind:this={menuRef}
			class="animate-slideDown absolute top-16 right-5 z-50 w-40 rounded-xl border border-neutral-700 bg-neutral-950 p-4 shadow-xl"
		>
			{#if user}
				<a href="/dashboard" class="block rounded-md px-3 py-2 text-sm text-green-400 hover:bg-neutral-800">Dashboard</a>
			{/if}
			<a href="/login" class="block rounded-md px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800">Login</a>
			<a href="/register" class="mt-2 block rounded-md bg-sky-500 px-3 py-2 text-sm text-black hover:bg-sky-600">Register</a>
		</div>
	{/if}

	<!-- Center Icon -->
	<div class="mt-24 flex flex-col items-center gap-5">
		<!-- Icon Box with Dual Glow -->
		<div class="relative">
			<!-- Outer Glow -->
			<div class="absolute inset-0 rounded-2xl bg-sky-500 opacity-10 blur-[90px]"></div>

			<!-- Inner Glow -->
			<div class="absolute inset-0 rounded-2xl bg-sky-500 opacity-25 blur-xl"></div>

			<!-- Box -->
			<div
				class="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-950 shadow-xl"
			>
				<div
					class="relative z-10 flex h-14 w-14 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-950 shadow-lg shadow-neutral-600"
				>
					<img src="favicon.svg" alt="" class="h-7 w-7" />
				</div>
			</div>

			<!-- Bottom Elliptical Glow -->
			<div
				class="absolute -bottom-3 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-sky-500 opacity-20 blur-md"
			></div>
		</div>

		<!-- Tagline with Blinking Dot -->
		<div class="flex items-center gap-2">
			<div class="relative">
				<div class="h-2 w-2 rounded-full bg-sky-400"></div>
				<div
					class="absolute inset-0 -mt-1 -ml-1 h-4 w-4 animate-ping rounded-full bg-sky-400 opacity-75"
				></div>
			</div>
			<p class="ml-2 text-sm font-medium text-neutral-300">NEW GEN AI AUTOMATION PARTNER</p>
		</div>
	</div>

	<!-- Heading -->
	<h1
		class="float-up mt-6 text-center text-5xl leading-tight font-semibold text-neutral-200 sm:text-6xl"
	>
		Stay <span class="text-white">Smarter.</span> Diagnose<br />
		<span class="text-white">Faster.</span>
		<span class="text-neutral-400 italic">With Chat.E</span>
	</h1>

	<div class="float-up flex flex-col items-center justify-center space-y-6">
		<!-- Subheading -->
		<p class="text-sm text-neutral-400">AI Automation for Modern Lifestyle Made Simple</p>

		<!-- CTA Button -->
		<div class="relative">
			<button
				class="group relative inline-flex items-center justify-center rounded-xl border border-neutral-400 bg-[#10203ead] px-6 py-3 text-sm font-semibold text-white shadow-md backdrop-blur-lg transition hover:bg-neutral-800"
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

		<!-- Social Icons -->
		<div class="flex items-center space-x-6">
			{#each socialLinks as link, i}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="text-white transition hover:text-white"
				>
					<Icon icon={link.icon} class="h-5 w-5" />
				</a>
				{#if i < socialLinks.length - 1}
					<div class="h-4 w-px bg-neutral-200"></div>
				{/if}
			{/each}
		</div>

		<!-- Down Arrow -->
		<div class="mt-4">
			<svg
				class="h-5 w-5 animate-bounce text-neutral-500"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
	</div>
</section>
<section>
	<Testimonial />
</section>
<section>
	<BenefitsSection />
</section>
<section>
	<Services />
</section>
<section>
	<Pricing />
</section>
<section>
	<FaQs />
</section>
<Footer />

<style>
	@keyframes slideDown {
		0% {
			opacity: 0;
			transform: translateY(-20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-slideDown {
		animation: slideDown 0.3s ease forwards;
	}
</style>
