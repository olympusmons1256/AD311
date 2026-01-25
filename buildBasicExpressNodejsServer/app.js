const express = require('express');
const app = express();
const port = 3000;

//1.) Basic route handler
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about', (req, res) => {
  res.send('About page');
});

// 2.) Conditional routing for /foo
//Randomly decides to respond or pass control
app.get('/foo', (req, res, next) => {
  if (Math.random() > 0.5) {
	res.send('sometimes this');
	} else {
	// Pass control to the next matching route	
		next();
	}
});

//second handler: the fallback for /foo
app.get('/foo', (req, res) => {
	  res.send('and sometimes that');
});

// 3.) Regular expression routes
//Matches /user and /username
app.get(/^\/user(name)?$/, (req, res) => {
	  res.send('Matched the username pattern');
});

// 4.) Dynamic route handling
//Accesses dynamic segment via req.params
app.get('/user/:username', (req, res) => {
	  const username = req.params.username;
	  res.send(`Hello ${username}`);
});

// 5.) Query string handling
// user req.query to access parameters
app.get('/get', (req, res) => {
	console.log('Query Parameters:', req.query);
	res.send('Check console for query parameters');
});

// 6.) 404 error handling
app.use((req, res) => {
	  res.status(404).send('404 - Not Found');
});

// 7.) Start the server
function createApp() {
	return app;
}

exports.createApp = createApp;