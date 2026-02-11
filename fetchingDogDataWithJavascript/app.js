//Fetches a list of dog breeds from the Dog API
async function fetchDogBreeds() {
    try {
        console.log('Fetching dog breeds...');
        
        // Make GET request to the Dog API
        const response = await fetch('https://dogapi.dog/api/v2/breeds');
        
        // Parse the response as JSON
        const data = await response.json();
        
        // Log the breeds to console
        console.log('Dog Breeds:', data);
        
        return data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
}

/**
 * Enhanced fetch function with proper error handling
 * Checks response status and handles network errors
 */
async function fetchDogBreedsWithErrorHandling() {
    try {
        const response = await fetch('https://dogapi.dog/api/v2/breeds');
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        // Handle different types of errors
        if (error instanceof TypeError) {
            console.error('Network error - API might be down:', error);
            throw new Error('Network error: Unable to reach the Dog API. Please check your connection.');
        } else {
            console.error('Error fetching breeds:', error);
            throw error;
        }
    }
}

//Displays breed names in an HTML list
function displayBreedList(breeds) {
    const container = document.getElementById('breedsContainer');
    
    if (!breeds || breeds.length === 0) {
        container.innerHTML = '<p>No breeds found.</p>';
        return;
    }
    
    // Create an unordered list
    const ul = document.createElement('ul');
    ul.className = 'breed-list';
    
    breeds.forEach(breed => {
        const li = document.createElement('li');
        li.className = 'breed-item';
        li.textContent = breed.attributes.name;
        
        //Add click event for interactive selection
        li.addEventListener('click', () => fetchBreedDetails(breed.id));
        
        ul.appendChild(li);
    });
    
    container.innerHTML = '';
    container.appendChild(ul);
}

/**
 * Fetches detailed information about a specific breed
 * Uses the breed ID to get full details
 */
async function fetchBreedDetails(breedId) {
    try {
        const container = document.getElementById('breedDetails');
        container.innerHTML = '<p class="loading">Loading breed details...</p>';
        
        console.log(`Fetching details for breed ID: ${breedId}`);
        
        // Fetch specific breed by ID
        const response = await fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Breed Details:', data);
        
        // Display breed details in a structured format
        displayBreedDetails(data.data);
        
    } catch (error) {
        const container = document.getElementById('breedDetails');
        container.innerHTML = `<p class="error">Error loading breed details: ${error.message}</p>`;
        console.error('Error fetching breed details:', error);
    }
}


//Displays detailed breed information in a structured format
function displayBreedDetails(breed) {
    const container = document.getElementById('breedDetails');
    const attrs = breed.attributes;
    
    const html = `
        <div class="breed-details">
            <h3>${attrs.name}</h3>
            <p><strong>Description:</strong> ${attrs.description || 'No description available'}</p>
            <p><strong>Life Span:</strong> ${attrs.life ? `${attrs.life.min} - ${attrs.life.max} years` : 'Unknown'}</p>
            <p><strong>Male Weight:</strong> ${attrs.male_weight ? `${attrs.male_weight.min} - ${attrs.male_weight.max} kg` : 'Unknown'}</p>
            <p><strong>Female Weight:</strong> ${attrs.female_weight ? `${attrs.female_weight.min} - ${attrs.female_weight.max} kg` : 'Unknown'}</p>
            <p><strong>Hypoallergenic:</strong> ${attrs.hypoallergenic ? 'Yes' : 'No'}</p>
        </div>
    `;
    
    container.innerHTML = html;
}

//Fetches and displays random dog facts
async function fetchDogFacts() {
    try {
        const container = document.getElementById('factsContainer');
        container.innerHTML = '<p class="loading">Loading dog facts...</p>';
        
        console.log('Fetching dog facts...');
        
        const response = await fetch('https://dogapi.dog/api/v2/facts?limit=5');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dog Facts:', data);
        
        displayDogFacts(data.data);
        
    } catch (error) {
        const container = document.getElementById('factsContainer');
        container.innerHTML = `<p class="error">Error loading dog facts: ${error.message}</p>`;
        console.error('Error fetching dog facts:', error);
    }
}

//Displays dog facts in an interesting format
function displayDogFacts(facts) {
    const container = document.getElementById('factsContainer');
    
    if (!facts || facts.length === 0) {
        container.innerHTML = '<p>No facts found.</p>';
        return;
    }
    
    const html = facts.map((fact, index) => `
        <div class="fact-item">
            <strong>Fact ${index + 1}:</strong> ${fact.attributes.body}
        </div>
    `).join('');
    
    container.innerHTML = html;
}

//Fetches and displays dog groups
async function fetchDogGroups() {
    try {
        const container = document.getElementById('groupsContainer');
        container.innerHTML = '<p class="loading">Loading dog groups...</p>';
        
        console.log('Fetching dog groups...');
        
        const response = await fetch('https://dogapi.dog/api/v2/groups');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dog Groups:', data);
        
        displayDogGroups(data.data);
        
    } catch (error) {
        const container = document.getElementById('groupsContainer');
        container.innerHTML = `<p class="error">Error loading dog groups: ${error.message}</p>`;
        console.error('Error fetching dog groups:', error);
    }
}

//Displays dog groups information
function displayDogGroups(groups) {
    const container = document.getElementById('groupsContainer');
    
    if (!groups || groups.length === 0) {
        container.innerHTML = '<p>No groups found.</p>';
        return;
    }
    
    const html = groups.map(group => `
        <div class="group-item">
            <h4>${group.attributes.name}</h4>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load breeds button
    document.getElementById('loadBreedsBtn').addEventListener('click', async () => {
        try {
            const container = document.getElementById('breedsContainer');
            container.innerHTML = '<p class="loading">Loading breeds...</p>';
            
            const data = await fetchDogBreedsWithErrorHandling();
            displayBreedList(data.data);
        } catch (error) {
            const container = document.getElementById('breedsContainer');
            container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    });
    
    // Load facts button
    document.getElementById('loadFactsBtn').addEventListener('click', fetchDogFacts);
    
    // Load groups button
    document.getElementById('loadGroupsBtn').addEventListener('click', fetchDogGroups);
    
    console.log('Dog API Explorer initialized! Click the buttons to fetch data.');
});
