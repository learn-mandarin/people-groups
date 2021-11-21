<script>
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let x = 0;
	export let y = 0;
	export let radius = 4;
	export let color = '#000000';
	export let delay = 0;
	export let contextName = 'canvas';

	const { register, deregister, invalidate } = getContext(contextName);

	$: tweenParameters = {
		duration: 400,
		easing: cubicOut,
		delay
	};

	const tX = tweened(null, tweenParameters);
	const tY = tweened(null, tweenParameters);

	$: tX.set(x, tweenParameters);
	$: tY.set(y, tweenParameters);

	function draw(ctx) {
		ctx.translate($tX, $tY);

		ctx.fillStyle = color;

		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
		ctx.fill();
	}

	onMount(() => {
		register(draw);
		invalidate();

		return () => {
			deregister(draw);
		};
	});

	afterUpdate(invalidate);

	onDestroy(invalidate);
</script>
