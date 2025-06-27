<script lang="ts">
  export let title: string = 'Connect. Chat. Create.';
  export let subtitle: string = 'Experience seamless, intelligent messaging with our next-gen chat platform—where AI meets real connection.';
  let card: HTMLDivElement | null = null;
  let rotateX = 0;
  let rotateY = 0;

  function handleMouseMove(e: MouseEvent) {
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateMax = 15; // degrees
    rotateY = ((x - centerX) / centerX) * rotateMax;
    rotateX = -((y - centerY) / centerY) * rotateMax;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleMouseLeave() {
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }
</script>

<div class="min-h-[60vh] bg-white flex items-center justify-center px-2">
  <div
    bind:this={card}
    class="w-full max-w-2xl rounded-3xl shadow-2xl bg-white p-8 sm:p-12 flex flex-col items-center transition-transform duration-200"
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    style="will-change: transform;"
  >
    <h1 class="text-3xl sm:text-5xl font-extrabold mb-4 text-gray-900 text-center">
      {title}<br />
      <span class="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">AI-Powered Conversations</span>
    </h1>
    <p class="text-base sm:text-xl mb-6 text-gray-600 text-center">
      {subtitle}
    </p>
    <div class="flex gap-4 justify-center mb-6 w-full flex-wrap">
      <slot />
    </div>
    <div class="mt-4 w-full flex justify-center">
      <!-- Simple modern chat/AI SVG icon -->
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="60" height="32" rx="16" fill="#f3f4f6" />
        <rect x="24" y="34" width="32" height="8" rx="4" fill="#a78bfa" />
        <circle cx="24" cy="40" r="4" fill="#818cf8" />
        <circle cx="40" cy="40" r="4" fill="#818cf8" />
        <circle cx="56" cy="40" r="4" fill="#818cf8" />
      </svg>
    </div>
  </div>
</div> 