<script lang="ts" module>
	import BotIcon from "@lucide/svelte/icons/bot";
	import ChartPieIcon from "@lucide/svelte/icons/chart-pie";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import Settings2Icon from "@lucide/svelte/icons/settings-2";
	// import md5 from 'md5';
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import { toggleMode } from "mode-watcher";
	import { Button } from "$lib/shadcn/components/ui/button";

	// Navigation data
	const navData = {
		teams: [
			{
				name: "Chat.E",
				logo: GalleryVerticalEndIcon,
				plan: "Pro",
			},
		],
		navMain: [
			{
				title: "Dashboard",
				url: "/",
				icon: Settings2Icon,
				isActive : true,
				items: [
					{title: "Dashboard",url:"/"}
				]
			},
			{
				title: "Chats",
				url: "/chats",
				icon: BotIcon,
				isActive: true,
				items: [
					{ title: "All Chats", url: "/chats" },
					{ title: "New Chat", url: "/chats/new" }
				],
			},
			{
				title: "Medical Records",
				url: "/medical-records",
				icon: ChartPieIcon,
				items: [
					{ title: "View Records", url: "/medical-records" },
					{ title: "Add Record", url: "/medical-records/new" }
				],
			},
			{
				title: "Account",
				url: "/account",
				icon: Settings2Icon,
				items: [
					{ title: "Profile", url: "/account/profile" },
					{ title: "Billing", url: "/account/billing" },
					{ title: "Notifications", url: "/account/notifications" }
				],
			},
		],
	};

	// Fallback avatars (add your own images to static/avatars/)
	const fallbackAvatars = [
		"/avatars/avatar.png",
	];
</script>

<script lang="ts">
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import TeamSwitcher from "./team-switcher.svelte";
	import * as Sidebar from "$lib/shadcn/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user?: { id: string; email: string; name?: string } } = $props();

	// Compute avatar URL: try /avatars/[name].jpg, fallback to Gravatar, then fallback avatar, then first char
	function getAvatarUrl(email: string | undefined) {
		if (!email) return { localAvatar: fallbackAvatars[0], gravatar: fallbackAvatars[0] };
		const name = email.split('@')[0];
		const localAvatar = `/avatars/${name}.jpg`;
		// Try Gravatar
		const gravatar = localAvatar;
		//const gravatar = `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=404`;
		return { localAvatar, gravatar };
	}

	const userForNav = $derived({
		name: user?.name || user?.email?.split('@')[0] || 'User',
		email: user?.email || '',
		avatarInfo: getAvatarUrl(user?.email)
	});
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={navData.teams} />
		<Button onclick={toggleMode} variant="outline" size="icon" class="mt-2">
			<SunIcon class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<MoonIcon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span class="sr-only">Toggle theme</span>
		</Button>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={navData.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={userForNav} fallbackAvatars={fallbackAvatars} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
