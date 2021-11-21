<script lang="ts">
	// import { json } from 'd3';
	import { geoGraticule10, geoPath, geoOrthographic } from 'd3-geo';
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
	export let contextName = 'canvas';
	export let width = 0;
	export let height = 0;
	let sphere = { type: 'Sphere' };

	const { register, deregister, invalidate } = getContext(contextName);

	import * as topojson from 'topojson-client';
	// import land50Json from './land-50m.json';
	import land110Json from '../data/land-110m.json';
	import countries110Json from '../data/countries-110m.json';
	import { peoples } from '../data/people_groups_ch';
	// const land50 = json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
	// const land110 = json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")

	// const land50 = topojson.feature(land50Json, land50Json.objects.land);
	const land110 = topojson.feature(land110Json, land110Json.objects.land);
	const borders = topojson.mesh(
		countries110Json,
		countries110Json.objects.countries,
		(a, b) => a !== b
	);

	// $: projection = geoOrthographic().precision(0.1);
	$: projection = geoOrthographic()
		.fitExtent(
			[
				[-1, -1],
				[width + 1, height + 1]
			],
			// @ts-ignore
			sphere
		)
		.clipExtent([
			[-1, -1],
			[width + 1, height + 1]
		])
		.rotate([-90, -20]);

	const points: number[][] = peoples.map((people) => [people.Longitude, people.Latitude]);

	function draw(context: CanvasRenderingContext2D) {
		console.log('drawing');
		const path = geoPath(projection, context).pointRadius(1.5);

		context.beginPath();
		path(geoGraticule10());
		context.lineWidth = 0.5;
		context.strokeStyle = '#eee';
		context.stroke();

		context.beginPath();
		path(land110);
		context.fillStyle = '#cdcdcd';
		context.fill();

		context.beginPath(),
			path(borders),
			(context.strokeStyle = '#fff'),
			(context.lineWidth = 0.5),
			context.stroke();

		context.beginPath();
		// @ts-ignore
		path(sphere);
		context.lineWidth = 1;
		context.strokeStyle = '#000';
		context.stroke();

		context.beginPath();
		// path({ type: 'MultiPoint', coordinates: points });
		path({ type: 'Point', coordinates: [0, 0] });
		context.fillStyle = '#000';
		context.fill();

		// context.canvas.value = points.filter(tester(projection));
		context.canvas.dispatchEvent(new CustomEvent('input'));
	}

	onMount(() => {
		register(draw);
		invalidate();

		// const selection = select($contextStore.canvas);
		// console.log(selection);

		return () => {
			deregister(draw);
			// selection.on('zoom', null);
		};
	});

	afterUpdate(invalidate);

	onDestroy(invalidate);
</script>

<slot {projection} />
