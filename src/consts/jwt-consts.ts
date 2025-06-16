export const getAccessSignOptions = () => ({
	secret: process.env.JWT_ACCESS_SECRET,
	expiresIn: '15m',
});

export const getRefreshSignOptions = () => ({
	secret: process.env.JWT_REFRESH_SECRET,
	expiresIn: '7d',
});
