<script>
  import HeroSection from '$lib/components/HeroSection.svelte';
  import Features from '$lib/components/Features.svelte';
  import HowItWorks from '$lib/components/HowItWorks.svelte';
  import CTA from '$lib/components/CTA.svelte';
  import Footer from '$lib/components/Footer.svelte';
  export let data;
  // data.user will be present if logged in
</script>

<main>
  <HeroSection>
    <div class="flex gap-4 justify-center">
      {#if data?.user}
        <a href="/" class="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">Dashboard</a>
        <form method="POST" action="/logout">
          <button type="submit" class="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">Logout</button>
        </form>
      {:else}
        <a href="/login" class="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">Login</a>
        <a href="/register" class="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">Register</a>
      {/if}
    </div>
  </HeroSection>
  <Features />
  <HowItWorks />
  <CTA>
    {#if data?.user}
      <a href="/" class="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">Go to Dashboard</a>
    {:else}
      <a href="/register" class="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">Get Started</a>
    {/if}
  </CTA>
  <Footer />
</main> 