require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors'); // Import cors package

const app = express();
const port = 5006; // Change the port number

app.use(express.json());
app.use(cors()); // Add cors middleware

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'AKIARZW3GTWUOYBTEWXZ',
  secretAccessKey: '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',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Users';

// API to create a quote with likes and dislikes
app.post('/quotes', (req, res) => {
  const { id, author, text, isLiked } = req.body;
  const createdAt = new Date().toISOString(); // Generate a timestamp in ISO format
  const params = {
    TableName: tableName,
    Item: { id, author, text, isLiked, createdAt },
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

app.listen(port, '0.0.0.0',() => {
  console.log(`Profile API with likes and dislikes listening on:${port}`);
});
