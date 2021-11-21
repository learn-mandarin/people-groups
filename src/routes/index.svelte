<script lang="ts">
	import { browser } from '$app/env';
	import Canvas from '$lib/components/Canvas.svelte';
	import Globe from '$lib/components/Globe.svelte';
	import Zoomer from '$lib/components/Zoomer.svelte';

	let width = 0;
	let height = 0;
</script>

<div style="width: 100%; height: 100vh;" bind:clientWidth={width} bind:clientHeight={height}>
	{#if browser}
		<Canvas {width} {height} let:context>
			<Globe {width} {height} let:projection>
				<Zoomer {context} {projection} />
			</Globe>
		</Canvas>
	{/if}
</div>
