<script lang="ts">
	import { useSidebar } from "$lib/shadcn/components/ui/sidebar/index.js";
	// This should be `Component` after @lucide/svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { teams }: { teams: { name: string; logo: any; plan: string }[] } = $props();
	const sidebar = useSidebar();
	let activeTeam = teams[0];
</script>

<div class="flex items-center gap-2 p-2">
	<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
		<activeTeam.logo class="size-4" />
	</div>
	{#if sidebar.state !== 'collapsed'}
		<div class="flex-1 text-left">
			<span class="font-extrabold text-lg bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent tracking-tight drop-shadow">
				{activeTeam.name}
			</span>
		</div>
	{/if}
</div>
