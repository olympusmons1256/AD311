const express = require('express');

function createApp() {
	const app = express();

	app.get('/health', (req, res) => {
		res.status(200).json({ ok: true });
	});

	return app;
}

module.exports = { createApp };
