const { createApp } = require('../buildBasicExpressNodejsServer/app');
const PORT = Number(process.env.PORT) || 3000;

// Start the server
function start() {
	const app = createApp();
	app.listen(PORT, () => {
		console.log(`Server is successfully running at http://localhost:${PORT}`);
	});
}

module.exports = { start };
