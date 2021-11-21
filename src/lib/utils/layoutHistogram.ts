export const layoutHistogram = (
	data,
	{ radius = 1, x = (d) => d, xCategory = 'x', fy = 0, offset = radius * 2 }
) => {
	const scaledData = data.map((d) => ({ ...d, x: +x(d), y: 0 }));

	const histo = scaledData.reduce((acc, cur) => {
		const entry = cur[xCategory].toString();
		if (acc[entry]) {
			return {
				...acc,
				[entry]: [...acc[entry], { ...cur, y: cur.y + offset * acc[entry].length }]
			};
		} else {
			return { ...acc, [entry]: [cur] };
		}
	}, {});

	const result = Object.values(histo)
		.flat()
		.map((d, i) => {
			return {
				...d,
				y: -d.y + fy,
				radius,
				withinClusterIndex: i * 10
			};
		});

	return result;
};
