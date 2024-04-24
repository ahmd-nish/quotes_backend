import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Import cors package

const app = express();
const port = 5050; // You can choose any port that is available

// Use cors middleware with default options to allow all origins
app.use(cors());

app.get('/random-quote', async (req, res) => {
    try {
        // Fetching the random quote from the API
        const response = await fetch('https://api.quotable.io/quotes/random?limit=1');
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        console.log(data);

        // Returning the quote content in the response
        res.status(200).json({
            content: data[0].content,
            author: data[0].author
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching the quote');
    }
});

app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
});
