<script lang="ts">
	import Calendar from "$lib/shadcn/components/ui/calendar/calendar.svelte";
	import { CalendarDate } from "@internationalized/date";
	import type { ComponentProps } from "svelte";

	// 1️⃣ Declare bindable prop
	export let value: CalendarDate = new CalendarDate(2025, 6, 12);
  
	// 2️⃣ Other props
	let dropdown: ComponentProps<typeof Calendar>["captionLayout"] = "dropdown";

	const dropdownOptions = [
		{
			label: "Month and Year",
			value: "dropdown",
		},
	];

	const selectedDropdown = dropdownOptions.find((option) => option.value === dropdown)?.label ?? "Dropdown";

	export let id: string | undefined;
</script>

<div class="flex flex-col gap-4">
	<!-- 3️⃣ Forward the binding: -->
	<Calendar
		type="single"
		bind:value
		class="rounded-lg border shadow-sm"
		captionLayout={dropdown}
	  {id}
	/>
</div>
