## Dynamic Alert Buttons with Props
A React app that demonstrates dynamic rendering of AlertButton components from an array of data using the .map() function.

### Features
- Renders a Toolbar with multiple AlertButton components based on an array of objects.
- Each button displays a unique alert message when clicked.
- Demonstrates use of the key prop, passing props, and dynamic children.

### Prerequisites
- Node.js v18 or higher recommended
- npm (comes bundled with Node.js)

### Steps to Start
- Install dependencies: `npm install`
- Start the development server: `npm run dev`
- Open your browser to the local address provided (usually http://localhost:5173)

### Usage
- Click any button in the toolbar to see a browser alert with the specific message for that button.

---

#### Files
- AlertButton.jsx: Reusable button component that shows an alert with a custom message.
- Toolbar.jsx: Renders AlertButton components dynamically from an array.
- App.jsx: Main app component.
- main.jsx: Entry point for React.
- index.html: HTML template.
