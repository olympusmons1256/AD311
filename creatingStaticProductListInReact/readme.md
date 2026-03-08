## Static Product List (React + Vite)
A simple React app that displays a static list of products. Built using Vite for fast development and hot module replacement (HMR).

### Features
- Renders a list of products with name, description, and price
- Clean, organized layout for easy readability
- No state management or dynamic data

### Prerequisites
- Node.js v18 or higher recommended
- npm (comes bundled with Node.js)

### Steps to Start
- Install dependencies: npm install
- Start the dev server: npm run dev
- Open the app in your browser at the provided local URL

### Example Usage
- The app displays a list of products as cards
- Each card shows the product's name, description, and price

### Test Cases (Demonstration)

Normal Cases
1. All products are displayed with correct names, descriptions, and prices.
2. The list renders as many products as are in the array.
3. The layout remains clean and readable for all products.
Edge Cases
1. If the products array is empty, the list displays nothing (or a message like "No products available").
2. If a product is missing a description or price, the component still renders without crashing.
3. If two products have the same id, React will warn about duplicate keys (demonstrate this by temporarily duplicating an id).