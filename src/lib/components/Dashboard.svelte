<script lang="ts">
	import AppSidebar from '$lib/shadcn/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/shadcn/components/ui/breadcrumb';
	import { Separator } from '$lib/shadcn/components/ui/separator';
	import * as Sidebar from '$lib/shadcn/components/ui/sidebar';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/shadcn/components/ui/button';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	export let data: { user?: { id: string; email: string; name?: string } };

	// Dynamic breadcrumbs based on route
	const breadcrumbs = derived(page, ($page) => {
		const path = $page.url.pathname;
		// Dashboard root
		if (path === '/' || path === '/dashboard') {
			return [{ label: 'Dashboard', href: '/' }];
		}
		// Chats list
		if (path.startsWith('/chats') && !/\/chats\/[\w-]+/.test(path)) {
			return [
				{ label: 'Dashboard', href: '/' },
				{ label: 'Chats', href: '/chats' }
			];
		}
		// Chat detail
		if (/\/chats\/[\w-]+/.test(path)) {
			// Try to get chat title from page data if available
			const chatTitle = $page.data?.chat?.title || 'Chat';
			return [
				{ label: 'Dashboard', href: '/' },
				{ label: 'Chats', href: '/chats' },
				{ label: chatTitle, href: path }
			];
		}
		// Account
		if (path.startsWith('/account')) {
			return [
				{ label: 'Dashboard', href: '/' },
				{ label: 'Account', href: '/account' }
			];
		}
		// Onboarding
		if (path.startsWith('/onboarding')) {
			return [
				{ label: 'Dashboard', href: '/' },
				{ label: 'Onboarding', href: '/onboarding' }
			];
		}
		// Fallback
		return [{ label: 'Dashboard', href: '/' }];
	});
</script>

<Sidebar.Provider>
	<AppSidebar user={data.user} />
	<Sidebar.Inset>
		<header
			class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex flex-1 items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each $breadcrumbs as crumb, i (crumb.href)}
							<Breadcrumb.Item>
								{#if i < $breadcrumbs.length - 1}
									<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
									<Breadcrumb.Separator />
								{:else}
									<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
								{/if}
							</Breadcrumb.Item>
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
			<Button onclick={toggleMode} variant="outline" size="icon" class="mr-2">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			<slot />
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
