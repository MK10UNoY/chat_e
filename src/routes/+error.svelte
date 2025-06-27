<script lang="ts">
  export let error;
  export let status;
</script>

<section class="flex flex-col items-center justify-center min-h-screen bg-muted p-8">
  <!-- Back to Home link and faint doctor avatar SVG -->
  <div class="flex flex-col items-center mb-6">
    <a href="/" class="mb-2 text-blue-500 hover:underline font-semibold flex items-center gap-2">
      <svg class="w-5 h-5 inline-block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
      Back to Home
    </a>
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" class="opacity-30" style="filter: blur(0.5px);" xmlns="http://www.w3.org/2000/svg">
      <!-- Head -->
      <circle cx="48" cy="32" r="16" stroke="#64748b" stroke-width="2.5" fill="none" />
      <!-- Body -->
      <ellipse cx="48" cy="64" rx="22" ry="16" stroke="#64748b" stroke-width="2.5" fill="none" />
      <!-- Stethoscope -->
      <path d="M38 60 Q36 72 48 72 Q60 72 58 60" stroke="#64748b" stroke-width="2" fill="none" />
      <circle cx="38" cy="60" r="2.5" stroke="#64748b" stroke-width="1.5" fill="none" />
      <circle cx="58" cy="60" r="2.5" stroke="#64748b" stroke-width="1.5" fill="none" />
      <circle cx="48" cy="72" r="2.5" stroke="#64748b" stroke-width="1.5" fill="none" />
    </svg>
  </div>
  <h1 class="text-6xl font-bold text-primary mb-4">{status === 404 ? '404' : status}</h1>
  <h2 class="text-2xl font-semibold mb-2">{status === 404 ? 'Page Not Found' : 'Something went wrong'}</h2>
  <p class="mb-6 text-lg text-muted-foreground">
    {status === 404
      ? "Sorry, the page you're looking for doesn't exist or has been moved."
      : error?.message || 'An unexpected error occurred.'}
  </p>
  <a href="/landing" class="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium shadow hover:bg-primary/90 transition">Go to Landing Page</a>
</section> 