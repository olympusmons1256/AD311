A simple Express web server that responds with plain text on multiple routes (basic routes, conditional routing, regex routes, dynamic params, query strings, and a 404 handler).

# Prerequisites
- Node.js (18+ recommended)
- npm


# Install
From this project folder, install dependencies:
`npm install`


# Run the server
Start the server with:
`npm start`
By default it listens on port 3000.

- You should see a message like: “Server is successfully running at http://localhost:3000”
- dotenv is included under devDepedencies in package.json so that you may set the port to something else using a .env file if you choose (i.e. PORT=5000).


# Test the endpoints
Once the server is running, open a browser.


# Required routes
 / > Hello World
 /about > About page
 /foo > randomly returns sometimes this OR and sometimes that
 /user > matches the regex route
 /username > matches the regex route
 /user/:username > returns Hello {username}
 /get?any=query > logs query parameters to the console
 /Any other route > 404 - Not Found


# Notes
The /foo route is intentionally random, so try it multiple times to observe both responses.
The /get route prints query parameters in the server console.
