const { createApp } = require('./app');

const PORT = Number(process.env.PORT) || 3000;

function start() {
	const app = createApp();
	app.listen(PORT, () => {
		console.log(`Server listening on http://localhost:${PORT}`);
	});
}

if (require.main === module) {
	start();
}

module.exports = { start };
