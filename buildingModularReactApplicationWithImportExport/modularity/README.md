A modular React application demonstrating component organization with import/export patterns, including named exports (ContentA, ContentB, Button) and default exports (Header, Footer).

# Prerequisites
- Node.js (18+ recommended)
- npm


# Install
From this project folder, install dependencies:
`npm install`


# Run the app
Start the development server with:
`npm start`
By default it opens on http://localhost:3000.
- The app will automatically reload when you make changes.


# Components
- Header > Default export, renders top navigation
- Footer > Default export, renders bottom content
- ContentA > Named export, renders content section with children support
- ContentB > Named export, renders content section with children support
- Button > Named export from SharedComponents, reusable button component


# Key Features
Demonstrates how to import and use components across the application.
Shows both default and named export patterns.
Button component is passed as children to ContentA and ContentB to show component composition.


# Notes
Components are located in src/components/.
App.js imports and assembles all components together.
The Button component can be reused in any component that accepts children.

# Test Cases
## Normal
- header renders correctly
- footer renders correctly
- Button click handler shows corresponding content text

## Edge
- Button handler works when clicked multiple times
- Both Buttons are clicked in succession to one another
- Button works without children
