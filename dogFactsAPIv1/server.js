const express = require('express');
const dogFacts = require('./data/dog_facts');

const app = express();
const PORT = 3000;

// GET /facts endpoint
app.get('/facts', (req, res) => {
    try {
        const { number } = req.query;
        
        // If no 'number' is provided, return all facts
        if (!number) {
            return res.json({
                facts: dogFacts,
                success: true
            });
        }

        // Parse and validate the 'number' parameter
        const count = parseInt(number);

        if (isNaN(count) || count <= 0) {
            return res.status(400).json({
                success: false,
                message: "The 'number' parameter must be a positive integer."
            });
        }

        // Return the requested number of facts
        const slicedFacts = dogFacts.slice(0, count);
        
        res.json({
            facts: slicedFacts,
            success: true
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Dog Facts API is running at http://localhost:${PORT}`);
    });
}

module.exports = app;