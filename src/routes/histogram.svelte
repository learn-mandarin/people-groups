<script>
	import { scaleLinear, scaleOrdinal } from 'd3-scale';
	import { extent } from 'd3-array';
	import { browser } from '$app/env';

	import { persons } from '$lib/data/persons';
	import { layoutHistogram } from '$lib/utils/layoutHistogram';

	import Canvas from '$lib/components/Canvas.svelte';
	import Person from '$lib/components/Person.svelte';

	const padding = 32;

	let width = 0;
	let height = 0;
	let state = false;

	// define x-axis scale
	$: ageScale = scaleLinear()
		.domain(extent(persons, (d) => d.age))
		.range([padding, width - padding]);

	// define color scale
	$: categoryColorScale = scaleOrdinal()
		.domain(extent(persons, (d) => d.category))
		.range(['#D03D12', '#403D12']);

	// give an ID to each person
	$: idPersons = persons.map((d, i) => ({ id: i, ...d }));

	// split by category
	$: categories = state ? [...new Set(idPersons.map((d) => d.category))] : ['all'];
	$: personsStack = categories.map((category) => {
		const data = idPersons.filter((d) => d.category === category || category === 'all');
		return data;
	});

	// render histogram layout
	$: renderedPersons = personsStack
		.map((persons, i) => {
			return layoutHistogram(persons, {
				radius: width / 50,
				x: (d) => ageScale(d.age),
				xCategory: 'age',
				fy: height / (i + 1) - padding
			});
		})
		.flat();
</script>

<div class="wrapper">
	<div class="inputs">
		<label for="ste-changer">Switch histogram</label>
		<input type="checkbox" bind:checked={state} />
	</div>
	<div class="histogram" bind:clientWidth={width} bind:clientHeight={height}>
		{#if browser}
			<Canvas {width} {height}>
				{#each renderedPersons as { id, x, y, radius, category } (id)}
					<Person {x} {y} {radius} color={categoryColorScale(category)} delay={x} />
				{/each}
			</Canvas>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
	}

	.inputs {
		display: flex;
		gap: 1rem;
	}

	.histogram {
		flex: 1;
		overflow: hidden;
	}
</style>
