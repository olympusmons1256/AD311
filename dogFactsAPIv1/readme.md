## Dog Facts API
A simple Node.js and Express.js API that serves interesting trivia about dogs.

## Features
- Retrieve a full list of dog facts.
- Use query parameters to limit the number of facts returned.
- Built-in error handling for invalid requests.

# Prequisites
- Node.js v18 or higher recommended
- npm (comes bundled with Node.js)

# Steps to Start
- Install dependencies: npm install
- npm start: The server will start running at http://localhost:3000

# API Usage
- GET /facts //returns an array of dog facts
- GET /facts?number=1 //Returns a specific number of facts
