## Harvard Art Museums Explorer
A web application that demonstrates using the JavaScript Fetch API to search and explore Harvard's public art collection.

### Features
- Search artworks by artist, title, or subject
- Browse infinite scroll gallery with lazy loading
- View detailed artwork information in modal
- Random artwork discovery
- Responsive grid layout
- Image filtering (only displays artworks with images)

### Prerequisites
- A modern web browser
- Internet connection (API access required)

### Steps to Start
- Open index.html in your web browser
- Enter a search term (e.g., "portrait", "landscape", artist name)
- Click Search or press Enter
- Scroll down to load more artworks automatically
- Click any artwork to view full details

### API Usage
- GET https://api.harvardartmuseums.org/object?apikey={key}&size={size}&page={page}&keyword={query} // Search artworks
- GET https://api.harvardartmuseums.org/object/{id}?apikey={key} // Get specific artwork details

### Notes
- API key: Included in code for demo purposes
- Rate limit: 2500 requests/day
- Attribution required when republishing content
- Infinite scroll loads ~50 items per page for better performance
