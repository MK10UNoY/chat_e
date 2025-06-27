<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/shadcn/components/ui/card';
	import { Button } from '$lib/shadcn/components/ui/button';
	import type { PageData } from './$types';

	export let data: PageData;

	// Format date to a readable string
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Calculate age from DOB
	function calculateAge(dob: string) {
		const birthDate = new Date(dob);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	// Calculate BMI
	function calculateBMI(height: number, weight: number) {
		if (!height || !weight) return null;
		// Convert height from cm to meters
		const heightInMeters = height / 100;
		const bmi = weight / (heightInMeters * heightInMeters);
		return bmi.toFixed(1);
	}

	// Get BMI category and color
	function getBMIInfo(bmi: number) {
		if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', bgColor: 'bg-blue-100' };
		if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600', bgColor: 'bg-green-100' };
		if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
		return { category: 'Obese', color: 'text-red-600', bgColor: 'bg-red-100' };
	}

	const profile = data.medicalProfile;
	const bmi = calculateBMI(profile.height, profile.weight);
	const bmiInfo = bmi ? getBMIInfo(parseFloat(bmi)) : null;

	function handleEdit(section: string) {
		window.location.href = `/onboarding?edit=${section}`;
	}

	// Navigation items
	const navItems = [
		{ label: 'Chats', href: '/chats', icon: 'message-circle' },
		{ label: 'Products', href: '/products', icon: 'shopping-bag' },
		{ label: 'Account', href: '/account', icon: 'user' }
	];
</script>

<div class="container mx-auto p-6 space-y-6">
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
		<div>
			<h1 class="text-3xl font-bold">Welcome, {profile.first_name}!</h1>
			<p class="text-muted-foreground">Here's your health dashboard</p>
		</div>
		<div class="flex gap-4">
			{#each navItems as item}
				<a
					href={item.href}
					class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
				>
					{#if item.icon === 'message-circle'}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
						</svg>
					{:else if item.icon === 'shopping-bag'}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
							<line x1="3" y1="6" x2="21" y2="6"/>
							<path d="M16 10a4 4 0 0 1-8 0"/>
						</svg>
					{:else if item.icon === 'user'}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
							<circle cx="12" cy="7" r="4"/>
						</svg>
					{/if}
					{item.label}
				</a>
			{/each}
		</div>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- Combined Personal Info & Health Metrics Card -->
		<Card class="md:col-span-2 lg:col-span-1">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle>Health Overview</CardTitle>
				<Button variant="ghost" size="sm" class="h-8 w-8" onclick={() => handleEdit('personal')}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
						<path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
						<path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
					</svg>
				</Button>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<h3 class="text-sm font-medium text-muted-foreground">Personal Info</h3>
						<div class="space-y-1">
							<p class="text-sm">Age: {calculateAge(profile.dob)} years</p>
							<p class="text-sm">Gender: {profile.gender}</p>
						</div>
					</div>
					<div class="space-y-2">
						<h3 class="text-sm font-medium text-muted-foreground">Metrics</h3>
						<div class="space-y-1">
							<p class="text-sm">Height: {profile.height} cm</p>
							<p class="text-sm">Weight: {profile.weight} kg</p>
							{#if bmi && bmiInfo}
								<p class="text-sm flex items-center gap-2">
									BMI: {bmi}
									<span class="text-xs px-2 py-0.5 rounded-full {bmiInfo.bgColor} {bmiInfo.color}">
										{bmiInfo.category}
									</span>
								</p>
							{/if}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Medical History Card -->
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle>Medical History</CardTitle>
				<Button variant="ghost" size="sm" class="h-8 w-8" onclick={() => handleEdit('medical')}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
						<path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
						<path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
					</svg>
				</Button>
			</CardHeader>
			<CardContent>
				{#if profile.medical_history && profile.medical_history.length > 0}
					<ul class="list-disc list-inside space-y-1">
						{#each profile.medical_history as condition}
							<li class="text-sm">{condition}</li>
						{/each}
					</ul>
				{:else}
					<p class="text-sm text-muted-foreground">No medical conditions reported</p>
				{/if}
			</CardContent>
		</Card>

		<!-- Combined Allergies & Medications Card -->
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle>Allergies & Medications</CardTitle>
				<div class="flex gap-1">
					<Button variant="ghost" size="sm" class="h-8 w-8" onclick={() => handleEdit('allergies')}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
							<path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
							<path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
						</svg>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-1 gap-4">
					<div>
						<h3 class="text-sm font-medium mb-2">Allergies</h3>
						{#if profile.allergies && profile.allergies.length > 0}
							<ul class="list-disc list-inside space-y-1">
								{#each profile.allergies as allergy}
									<li class="text-sm">{allergy}</li>
								{/each}
							</ul>
						{:else}
							<p class="text-sm text-muted-foreground">No allergies reported</p>
						{/if}
					</div>
					<div>
						<h3 class="text-sm font-medium mb-2">Current Medications</h3>
						{#if profile.medications && profile.medications.length > 0}
							<ul class="list-disc list-inside space-y-1">
								{#each profile.medications as medication}
									<li class="text-sm">{medication}</li>
								{/each}
							</ul>
						{:else}
							<p class="text-sm text-muted-foreground">No current medications</p>
						{/if}
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</div> 