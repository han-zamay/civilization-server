export const getMatrix = (rows: number, cols: number) => {
	const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
	return matrix;
};

export const getEmptyTiles = (playersCount: number) => {
	if (playersCount % 2 === 0) {
		return getMatrix(4, playersCount === 2 ? 2 : 4);
	}
	const matrix = [];
	for (let i = 0; i < 4; i++) {
		matrix[i] = [];
		for (let j = 0; j < 4; j++) {
			if (j <= i) {
				matrix[i][j] = 0;
			}
		}
	}
	return matrix;
};
