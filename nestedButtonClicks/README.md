## Nested Button Clicks: Event Propagation Demo
A React app demonstrating event propagation (bubbling) and how to use event.stopPropagation() to isolate event handlers in nested elements.

### Features
- Outer container and inner button, each with their own click handler.
- Clicking the outer container triggers only the outer handler.
- Clicking the inner button triggers only the inner handler, not the outer.
- Demonstrates use of event.stopPropagation() in React.

### Prerequisites
- Node.js v18 or higher recommended
- npm (comes bundled with Node.js)

### Steps to Start
- Install dependencies: `npm install`
- Start the development server: `npm run dev`
- Open your browser to the local address provided (usually http://localhost:5173)

### Usage
- Click the outer container: Only the outer alert appears.
- Click the inner button: Only the inner alert appears (outer is blocked).
