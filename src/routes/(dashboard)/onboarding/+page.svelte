<script lang="ts">
	import { Button } from '$lib/shadcn/components/ui/button';
	import { Input } from '$lib/shadcn/components/ui/input';
	import { Label } from '$lib/shadcn/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/shadcn/components/ui/card';
	import Calendar13 from '$lib/shadcn/components/calendar-13.svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { today, getLocalTimeZone, CalendarDate, type DateValue } from '@internationalized/date';

	let currentStep = 1;
	const totalSteps = 4;

	// Common medical conditions
	const commonConditions = [
		"Diabetes",
		"Hypertension",
		"Asthma",
		"Heart Disease",
		"Arthritis",
		"Thyroid Disorder",
		"Chronic Kidney Disease",
		"COPD",
		"Cancer",
		"Depression",
		"Anxiety",
		"High Cholesterol",
		"Obesity",
		"Allergies",
		"Migraines"
	];

	// Add common allergies
	const commonAllergies = [
		"Peanuts",
		"Tree Nuts",
		"Milk",
		"Eggs",
		"Wheat",
		"Soy",
		"Fish",
		"Shellfish",
		"Pollen",
		"Dust Mites",
		"Pet Dander",
		"Latex",
		"Insect Stings",
		"Mold",
		"Medications"
	];

	// Form data
	let formData = {
		firstName: '',
		lastName: '',
		dob: new CalendarDate(
			today(getLocalTimeZone()).year,
			today(getLocalTimeZone()).month,
			today(getLocalTimeZone()).day
		),
		gender: '',
		height: '',
		weight: '',
		medicalHistory: [] as string[],
		allergies: [] as string[],
		medications: [] as string[]
	};

	let isSubmitting = false;
	let newItem = '';
	let formMessage: { type: 'success' | 'error'; text: string } | null = null;

	function addToArray(array: string[]) {
		if (newItem.trim() && !array.includes(newItem.trim())) {
			formData.medicalHistory = [...array, newItem.trim()];
		}
		newItem = '';
	}

	function removeFromArray(array: string[], index: number) {
		formData.medicalHistory = array.filter((_, i) => i !== index);
	}

	function toggleCondition(condition: string) {
		const idx = formData.medicalHistory.indexOf(condition);
		if (idx === -1) {
			formData.medicalHistory = [...formData.medicalHistory, condition];
		} else {
			formData.medicalHistory = formData.medicalHistory.filter((c) => c !== condition);
		}
	}

	function handleEnhance() {
		isSubmitting = true;
		formMessage = null;
		
		return async ({ result, update }: { result: ActionResult, update: () => Promise<void> }) => {
			if (result.type === 'success') {
				formMessage = {
					type: 'success',
					text: 'Profile created successfully! Redirecting...'
				};
				
				// Add a small delay to show the success message
				await new Promise(resolve => setTimeout(resolve, 1000));

				// Check if we have a redirect URL
				const data = result.data as { redirect?: string } | undefined;
				if (data?.redirect) {
					window.location.href = data.redirect;
					return;
				}
				
				// If no redirect, just update the form
				await update();
			} else if (result.type === 'failure') {
				formMessage = {
					type: 'error',
					text: result.data?.error || 'An unexpected error occurred'
				};
				console.error('Form submission error:', result.data);
				isSubmitting = false;
				await update();
			} else {
				formMessage = {
					type: 'error',
					text: 'An unexpected error occurred'
				};
				isSubmitting = false;
				await update();
			}
		};
	}

	function nextStep() {
		if (currentStep < totalSteps) {
			// Set submitting state for step transitions
			isSubmitting = true;
			// Clear newItem when moving to next step
			newItem = '';
			// Small delay to show loading state
			setTimeout(() => {
				currentStep++;
				isSubmitting = false;
			}, 100);
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			// Set submitting state for step transitions
			isSubmitting = true;
			// Clear newItem when moving to previous step
			newItem = '';
			// Small delay to show loading state
			setTimeout(() => {
				currentStep--;
				isSubmitting = false;
			}, 100);
		}
	}

	$: canProceed =
		currentStep === 1
			? formData.firstName && formData.lastName && formData.dob && formData.gender
			: currentStep === 2
				? true // Medical history is now optional
				: currentStep === 3
					? true // Allergies are optional
					: true; // Medications are optional

	// Calculate max date (must be at least 18 years old)
	const todayVal = today(getLocalTimeZone());
	const maxDate = new CalendarDate(todayVal.year - 18, todayVal.month, todayVal.day);

	// Helper to check if a condition is baked-in
	function isBakedInCondition(condition: string) {
		return commonConditions.includes(condition);
	}

	function toggleAllergy(allergy: string) {
		const idx = formData.allergies.indexOf(allergy);
		if (idx === -1) {
			formData.allergies = [...formData.allergies, allergy];
		} else {
			formData.allergies = formData.allergies.filter((a) => a !== allergy);
		}
	}

	function addAllergy() {
		if (newItem.trim() && !formData.allergies.includes(newItem.trim())) {
			formData.allergies = [...formData.allergies, newItem.trim()];
		}
		newItem = '';
	}

	function removeAllergy(index: number) {
		formData.allergies = formData.allergies.filter((_, i) => i !== index);
	}

	// Helper to check if an allergy is baked-in
	function isBakedInAllergy(allergy: string) {
		return commonAllergies.includes(allergy);
	}

	function addMedication() {
		if (newItem.trim() && !formData.medications.includes(newItem.trim())) {
			formData.medications = [...formData.medications, newItem.trim()];
		}
		newItem = '';
	}

	function removeMedication(index: number) {
		formData.medications = formData.medications.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto w-full max-w-2xl px-4 py-8">
	<Card>
		<CardHeader>
			<CardTitle>Complete Your Medical Profile</CardTitle>
			<p class="text-muted-foreground text-sm">Step {currentStep} of {totalSteps}</p>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				action="?/createMedicalProfile"
				use:enhance={handleEnhance}
				class="space-y-6"
			>
				<!-- Hidden form fields for all data -->
				<input type="hidden" name="firstName" value={formData.firstName} />
				<input type="hidden" name="lastName" value={formData.lastName} />
				<input type="hidden" name="dob" value={formData.dob ? formData.dob.toString() : ''} />
				<input type="hidden" name="gender" value={formData.gender} />
				<input type="hidden" name="height" value={formData.height} />
				<input type="hidden" name="weight" value={formData.weight} />
				<input type="hidden" name="medicalHistory" value={JSON.stringify(formData.medicalHistory)} />
				<input type="hidden" name="allergies" value={JSON.stringify(formData.allergies)} />
				<input type="hidden" name="medications" value={JSON.stringify(formData.medications)} />

				<!-- Form message -->
				{#if formMessage}
					<div
						class="p-4 rounded-md {formMessage.type === 'success'
							? 'bg-green-50 text-green-700 border border-green-200'
							: 'bg-red-50 text-red-700 border border-red-200'}"
						role="alert"
					>
						{formMessage.text}
					</div>
				{/if}

				<!-- Progress bar -->
				<div class="h-2.5 w-full rounded-full bg-gray-200">
					<div
						class="bg-primary h-2.5 rounded-full transition-all duration-300"
						style="width: {(currentStep / totalSteps) * 100}%"
					></div>
				</div>

				<!-- Step 1: Basic Information -->
				{#if currentStep === 1}
					<div class="space-y-4">
						<div>
							<Label for="firstName">First Name *</Label>
							<Input
								id="firstName"
								name="firstName"
								bind:value={formData.firstName}
								required
								disabled={isSubmitting}
							/>
						</div>
						<div>
							<Label for="lastName">Last Name *</Label>
							<Input
								id="lastName"
								name="lastName"
								bind:value={formData.lastName}
								required
								disabled={isSubmitting}
							/>
						</div>
						<div>
							<Label for="dob">Date of Birth *</Label>
							<div class="grid gap-2">
								<Calendar13 bind:value={formData.dob} id="dob-calendar" />
							</div>
							<p class="text-muted-foreground mt-1 text-xs">You must be at least 18 years old</p>
						</div>
						<div>
							<Label for="gender">Gender *</Label>
							<select
								id="gender"
								name="gender"
								bind:value={formData.gender}
								class="border-input bg-background w-full rounded-md border p-2"
								required
								disabled={isSubmitting}
							>
								<option value="">Select gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
								<option value="prefer_not_to_say">Prefer not to say</option>
							</select>
						</div>
						<div>
							<Label for="height">Height (cm)</Label>
							<Input
								id="height"
								name="height"
								type="number"
								min="0"
								bind:value={formData.height}
								disabled={isSubmitting}
							/>
						</div>
						<div>
							<Label for="weight">Weight (kg)</Label>
							<Input
								id="weight"
								name="weight"
								type="number"
								min="0"
								bind:value={formData.weight}
								disabled={isSubmitting}
							/>
						</div>
					</div>

					<!-- Step 2: Medical History -->
				{:else if currentStep === 2}
					<div class="space-y-4">
						<Label>Medical History (optional)</Label>
						<p class="text-muted-foreground text-sm">Add any past or current medical conditions</p>

						<!-- Common conditions as selectable chips -->
						<div class="flex flex-wrap gap-2">
							{#each commonConditions as condition}
								<button
									type="button"
									class="px-3 py-1 rounded-full border text-sm transition-all {formData.medicalHistory.includes(condition) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-300'}"
									onclick={() => toggleCondition(condition)}
									disabled={isSubmitting}
									aria-pressed={formData.medicalHistory.includes(condition)}
								>
									{condition}
								</button>
							{/each}
						</div>

						<p class="text-xs text-muted-foreground">Can't find your condition? Add your own below:</p>
						<div class="flex gap-2">
							<Input
								placeholder="Enter a medical condition or Leave blank if None"
								bind:value={newItem}
								disabled={isSubmitting}
								onkeydown={(e) => {
									const event = e as KeyboardEvent;
									if (event.key === 'Enter') {
										event.preventDefault();
										addToArray(formData.medicalHistory);
									}
								}}
							/>
							<Button
								type="button"
								onclick={() => addToArray(formData.medicalHistory)}
								disabled={!newItem.trim() || isSubmitting || formData.medicalHistory.includes(newItem.trim())}
							>
								Add
							</Button>
						</div>

						<ul class="flex flex-wrap gap-2 mt-2">
							{#each formData.medicalHistory as condition, i}
								<li class="flex items-center bg-secondary rounded-full px-3 py-1 text-sm">
									<span>{condition}</span>
									<button
										type="button"
										class="ml-2 text-gray-500 hover:text-red-600 focus:outline-none"
										onclick={() => isBakedInCondition(condition) ? toggleCondition(condition) : removeFromArray(formData.medicalHistory, i)}
										disabled={isSubmitting}
										aria-label="Remove condition"
									>
										&times;
									</button>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Step 3: Allergies -->
				{:else if currentStep === 3}
					<div class="space-y-4">
						<Label>Allergies (optional)</Label>
						<p class="text-muted-foreground text-sm">List any allergies you have or select from common ones below.</p>

						<!-- Common allergies as selectable chips -->
						<div class="flex flex-wrap gap-2">
							{#each commonAllergies as allergy}
								<button
									type="button"
									class="px-3 py-1 rounded-full border text-sm transition-all {formData.allergies.includes(allergy) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-300'}"
									onclick={() => toggleAllergy(allergy)}
									disabled={isSubmitting}
									aria-pressed={formData.allergies.includes(allergy)}
								>
									{allergy}
								</button>
							{/each}
						</div>

						<p class="text-xs text-muted-foreground">Can't find your allergy? Add your own below:</p>
						<div class="flex gap-2">
							<!-- @ts-ignore -->
							<Input
								placeholder="Enter an allergy or Leave blank if None"
								bind:value={newItem}
								disabled={isSubmitting}
								onkeydown={(e) => {
									const event = e as KeyboardEvent;
									if (event.key === 'Enter') {
										event.preventDefault();
										addAllergy();
									}
								}}
							/>
							<Button
								type="button"
								onclick={addAllergy}
								disabled={!newItem.trim() || isSubmitting || formData.allergies.includes(newItem.trim())}
							>
								Add
							</Button>
						</div>

						<ul class="flex flex-wrap gap-2 mt-2">
							{#each formData.allergies as allergy, i}
								<li class="flex items-center bg-secondary rounded-full px-3 py-1 text-sm">
									<span>{allergy}</span>
									<button
										type="button"
										class="ml-2 text-gray-500 hover:text-red-600 focus:outline-none"
										onclick={() => isBakedInAllergy(allergy) ? toggleAllergy(allergy) : removeAllergy(i)}
										disabled={isSubmitting}
										aria-label="Remove allergy"
									>
										&times;
									</button>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Step 4: Medications -->
				{:else if currentStep === 4}
					<div class="space-y-4">
						<Label>Current Medications</Label>
						<p class="text-muted-foreground text-sm">
							List any medications you're currently taking (optional)
						</p>

						<div class="flex gap-2">
							<Input
								placeholder="Enter a medication"
								bind:value={newItem}
								disabled={isSubmitting}
								onkeydown={(e) => {
									const event = e as KeyboardEvent;
									if (event.key === 'Enter') {
										event.preventDefault();
										addMedication();
									}
								}}
							/>
							<Button
								type="button"
								onclick={addMedication}
								disabled={!newItem.trim() || isSubmitting || formData.medications.includes(newItem.trim())}
							>
								Add
							</Button>
						</div>

						<ul class="flex flex-wrap gap-2 mt-2">
							{#each formData.medications as medication, i}
								<li class="flex items-center bg-secondary rounded-full px-3 py-1 text-sm">
									<span>{medication}</span>
									<button
										type="button"
										class="ml-2 text-gray-500 hover:text-red-600 focus:outline-none"
										onclick={() => removeMedication(i)}
										disabled={isSubmitting}
										aria-label="Remove medication"
									>
										&times;
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Navigation buttons -->
				<div class="flex justify-between pt-4">
					<Button
						type="button"
						variant="outline"
						onclick={prevStep}
						disabled={currentStep === 1 || isSubmitting}
					>
						Previous
					</Button>

					{#if currentStep < totalSteps}
						<Button type="button" onclick={nextStep} disabled={!canProceed || isSubmitting}>
							Next
						</Button>
					{:else}
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Complete Profile'}
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>
</div>

<!-- Debug: Show formData as JSON -->
<pre class="mt-8 bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(formData, null, 2)}</pre>
<pre class="mt-8 bg-gray-100 p-4 rounded text-xs overflow-x-auto">
Debug Info:
- currentStep: {currentStep}
- totalSteps: {totalSteps}
- canProceed: {canProceed}
- isSubmitting: {isSubmitting}
- isFinalStep: {currentStep === totalSteps}
</pre>
 