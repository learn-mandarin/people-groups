<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { scaleCanvas } from '../utils/scaleCanvas';

	export let width = 0;
	export let height = 0;
	export let center = false;
	export let contextName = 'canvas';

	const drawFunctions = [];

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let pendingInvalidation = false;
	let frameId: number;

	function update() {
		if (!context) return;

		if (center) {
			context.clearRect(-width / 2, -height / 2, width, height);
		} else {
			context.clearRect(0, 0, width, height);
		}

		drawFunctions.forEach((fn) => {
			context.save();
			fn(context);
			context.restore();
		});

		pendingInvalidation = false;
	}

	onMount(() => {
		context = canvas.getContext('2d');
	});

	onDestroy(() => {
		if (frameId) {
			cancelAnimationFrame(frameId);
		}
	});

	$: setContext(contextName, {
		register(fn) {
			drawFunctions.push(fn);
		},
		deregister(fn) {
			drawFunctions.splice(drawFunctions.indexOf(fn), 1);
		},
		invalidate() {
			if (pendingInvalidation) return;
			pendingInvalidation = true;
			frameId = requestAnimationFrame(update);
		},
	});

	$: if (canvas && context) scaleCanvas(canvas, context, width, height, center);
</script>

<canvas bind:this={canvas} />
<slot {context} />
