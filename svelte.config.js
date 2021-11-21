import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: vercel(),
		target: '#svelte',
		vite: {
			ssr: {
				// noExternal:  ["d3", "d3-geo", "d3-scale", "d3-array", "d3-interpolate", "d3-format", "d3-time", "d3-time-format"]
				noExternal: ["d3"]
			}
		}
	}
};

export default config;
