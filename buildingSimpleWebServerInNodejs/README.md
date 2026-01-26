# Simple Node.js Web Server
This project implements a minimal Node.js HTTP server that serves a homepage and an about page, and returns 404 for unknown routes.

# Quick start
- Prerequisites: Node.js >= 18
- From the project folder run:
`npm start`


# Server behavior
- / or /home — returns home.html
- /about — returns a plain-text response: "This is the About page.
- /Any other route — returns: "Not Found"

# Files of interest
- server.js — server implementation using ES6 module imports
- home.html — homepage HTML served by the server
- package.json — project metadata and `start` script

# Notes
- The project uses ES6 modules (see type: "module" in package.json).
- http and fs are core Node modules and should not be added to dependencies.
- To test manually, visit http://localhost:3000/ and http://localhost:3000 about after starting the server.

