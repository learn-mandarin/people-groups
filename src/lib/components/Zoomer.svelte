<script lang="ts">
	import { GeoProjection, select } from 'd3';
	import { getContext } from 'svelte';
	import { versorZoom } from '../utils/versorZoom';
	export let context: CanvasRenderingContext2D;
	export let projection: GeoProjection;
	export let contextName = 'canvas';

	// const selection = select(context.canvas);
	const { invalidate } = getContext(contextName);

	$: if (projection && context)
		select(context.canvas).call(
			versorZoom(projection, { scaleExtent: [0.8, 200] }).on('zoom.render', invalidate)
		);

	// onMount(() => {
	// selection.call(versorZoom(projection).on('zoom.render', invalidate));
	// const zooom = selection.call(versorZoom(projection).on('zoom.render', invalidate));
	// console.log(selection)
	// selection.on('zoom.render', () => console.log('zoom-render'));
	// });

	// onDestroy(() => {
	// 	selection.on('zoom', null);
	// });
</script>
