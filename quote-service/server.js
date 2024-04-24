require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors'); // Import cors package

const app = express();
const port = process.env.PORT || 5005; // Allow port to be configured via environment variable

app.use(express.json());
app.use(cors()); // Add cors middleware

// Configure AWS DynamoDB
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1', // Use AWS region from environment variable or default to 'us-east-1'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Use AWS access key ID from environment variable
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Use AWS secret access key from environment variable
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Quotes';

// API to create a quote
app.post('/quotes', (req, res) => {
  const { id, author, text } = req.body;
  const createdAt = new Date().toISOString(); // Generate a timestamp in ISO format
  const params = {
    TableName: tableName,
    Item: { id, author, text, createdAt },
  };

  dynamoDb.put(params, (err) => {
    if (err) {
      console.error('Unable to add quote. Error JSON:', JSON.stringify(err, null, 2));
      res.status(500).send('Error adding the quote');
    } else {
      res.status(201).send('Quote added');
    }
  });
});

// API to get all quotes
app.get('/quotes', (req, res) => {
  const params = {
    TableName: tableName,
  };

  dynamoDb.scan(params, (err, data) => {
    if (err) {
      console.error('Unable to get quotes. Error JSON:', JSON.stringify(err, null, 2));
      res.status(500).send('Error getting the quotes');
    } else {
      res.status(200).json(data.Items);
    }
  });
});

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`Quotes API listening on port ${port}`);
});
