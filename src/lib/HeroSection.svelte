<script lang="ts">
  export let title: string = 'We help brands create digital experiences that connect with their audience';
  export let subtitle: string = '';
</script>

<div class="min-h-[80vh] w-full bg-[#f5f6fa] rounded-2xl p-4 sm:p-8 flex flex-col gap-6 border border-gray-200 shadow-lg">
  <!-- Hero Header Row -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
    <!-- Logo/Brand -->
    <div class="flex-1 flex items-center justify-start w-full">
      <span class="text-3xl font-semibold tracking-tight text-black">LUSION</span>
    </div>
    <!-- Headline -->
    <div class="flex-[2] flex flex-col items-center sm:items-start text-center sm:text-left">
      <h1 class="text-3xl sm:text-5xl font-medium leading-tight text-black mb-2 max-w-2xl">{title}</h1>
      {#if subtitle}
        <p class="text-lg text-gray-600">{subtitle}</p>
      {/if}
    </div>
    <!-- Button Group -->
    <div class="flex-1 flex items-center justify-end gap-3 w-full">
      <button class="w-12 h-12 rounded-full bg-gray-100 text-2xl font-bold flex items-center justify-center">-</button>
      <button class="px-8 py-3 rounded-full bg-gray-900 text-white font-semibold text-lg shadow hover:bg-gray-800 transition">LET'S TALK <span class="ml-2">•</span></button>
      <button class="px-6 py-3 rounded-full bg-gray-100 text-gray-900 font-semibold text-lg flex items-center gap-2">MENU <span class="text-2xl">••</span></button>
    </div>
  </div>

  <!-- Visual/3D Placeholder -->
  <div class="w-full h-[340px] sm:h-[420px] bg-gradient-to-br from-black via-zinc-900 to-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden mt-2 mb-2">
    <!-- Placeholder for 3D/graphic visual -->
    <span class="text-5xl text-gray-400 opacity-30 select-none">[ 3D VISUAL HERE ]</span>
  </div>

  <!-- Bottom Bar -->
  <div class="flex items-center justify-between w-full px-2 py-3">
    <span class="text-3xl font-light text-black">+</span>
    <span class="text-base font-medium text-black tracking-wide">SCROLL TO EXPLORE</span>
    <span class="text-3xl font-light text-black">+</span>
  </div>
</div> 