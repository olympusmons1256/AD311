## Converting HTML Profile Card to JSX
A web application that demonstrates using the JavaScript Fetch API to retrieve and display data from the Dog API.

### Features
- creates a react component named UserProfile
- converts an HTML snippet into JSX
- encapsulates the JSX within a single parent
- uses react-dom

### Steps to Start
- npm run dev ("Dev": "Vite")

### Test Cases
Normal
- typical user data:
name: "Jane Doe"
email: "jane.doe@example.com"
photoUrl: "https://example.com/user-photo.jpg"

- Random other user data:
name: "John Smith"
email: "john.smith@example.com"
photoUrl: "https://example.com/john-photo.jpg"

- Username with special characters
name: "Ana María"
email: "ana.maria@example.com"
photoUrl: "https://example.com/ana-photo.jpg"

Edge case
- No content in photoUrl field:
name: "No Photo"
email: "no.photo@example.com"
photoUrl: ""

- Invalid email format
name: "Invalid Email"
email: "not-an-email"
photoUrl: "https://example.com/invalid-photo.jpg"

- Empty name and email fields:
name: ""
email: ""
photoUrl: "https://example.com/empty-photo.jpg"