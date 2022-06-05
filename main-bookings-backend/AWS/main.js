const AWS = require('aws-sdk');

// AWS config & init
AWS.config.update({
    region : 'us-east-1'
})

// DynamoDB
const db = new AWS.DynamoDB({
    endpoint : 'dynamodb.us-east-1.amazonaws.com'
})
const docClient = new AWS.DynamoDB.DocumentClient()

// SNS
const sns = new AWS.SNS({
    endpoint: 'sns.us-east-1.amazonaws.com'
})

// Exports
module.exports = {db, docClient, sns}