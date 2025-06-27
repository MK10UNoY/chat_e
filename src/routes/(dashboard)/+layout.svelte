<script lang="ts">
  import Dashboard from '$lib/components/Dashboard.svelte';
  export let data;
</script>

<Dashboard {data}>
  <slot />
</Dashboard> 