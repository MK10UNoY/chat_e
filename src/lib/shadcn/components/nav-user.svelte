<script lang="ts">
	import * as Avatar from "$lib/shadcn/components/ui/avatar/index.js";
	import * as DropdownMenu from "$lib/shadcn/components/ui/dropdown-menu/index.js";
	import * as Sidebar from "$lib/shadcn/components/ui/sidebar/index.js";
	import { useSidebar } from "$lib/shadcn/components/ui/sidebar/index.js";
	import BellIcon from "@lucide/svelte/icons/bell";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import LogOutIcon from "@lucide/svelte/icons/log-out";
	import { goto, invalidateAll } from '$app/navigation';

	let { user, fallbackAvatars }: {
		user: { name: string; email: string; avatarInfo: { localAvatar: string; gravatar: string } };
		fallbackAvatars: string[];
	} = $props();
	const sidebar = useSidebar();

	let avatarSrc: string = $state(user.avatarInfo.localAvatar);
	let triedGravatar = $state(false);
	let fallbackIndex = $state(0);
	let showInitial = $state(false);

	function handleImgError() {
		if (!triedGravatar) {
			avatarSrc = user.avatarInfo.gravatar;
			triedGravatar = true;
		} else if (fallbackIndex < fallbackAvatars.length) {
			avatarSrc = fallbackAvatars[fallbackIndex++];
		} else {
			showInitial = true;
		}
	}

	function getInitial(email: string) {
		return email?.[0]?.toUpperCase() || 'U';
	}

	async function handleLogout() {
		try {
			const response = await fetch('/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				await invalidateAll();
				goto('/landing');
			} else {
				console.error('Logout failed');
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="size-8 rounded-lg">
							{#if !showInitial}
								<Avatar.Image src={avatarSrc} alt={user.name} onerror={handleImgError} />
							{:else}
								<Avatar.Fallback class="rounded-lg">{getInitial(user.email)}</Avatar.Fallback>
							{/if}
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? "bottom" : "right"}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							{#if !showInitial}
								<Avatar.Image src={avatarSrc} alt={user.name} onerror={handleImgError} />
							{:else}
								<Avatar.Fallback class="rounded-lg">{getInitial(user.email)}</Avatar.Fallback>
							{/if}
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						Profile
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<BellIcon />
						Notifications
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={handleLogout}>
					<LogOutIcon />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
