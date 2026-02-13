## Test Cases for Harvard Art Museums Explorer

### Normal Test Cases

#### Test Case 1: Search with Valid Keyword
- Grid displays multiple portrait artworks
- Cards show artwork images, titles, artists, and dates


#### Test Case 2: Infinite Scroll Loading
- Initial load shows ~50+ items (multiple rows)
- Scrolling to bottom triggers automatic loading
- More artworks appear seamlessly


#### Test Case 3: Artwork Detail Modal
- Modal opens with artwork details
- Full image displays
- Title, artist, date, medium, classification, credit line, description all visible
- Close button works
- Clicking outside modal closes it


### Edge Case Test Cases

#### Test Case 4: Empty Search Query
- Error message appears: "Please enter a search term"
- No API call made
- Grid remains empty
- Error disappears after 5 seconds


#### Test Case 5: No Results with Images
- API returns results but none have images
- Grid displays: "No artworks with images found."
- No cards rendered
- No errors thrown


#### Test Case 6: Random Artwork
- Each click loads a different artwork
- Modal opens with artwork details
- "Random artwork" label shown instead of total count
- Infinite scroll disabled (no more loading on scroll)
- Random selections are actually different on subsequent clicks
