const express = require('express');
const CORS = require('cors');
const url = require('url');
const AWS = require('aws-sdk');

// EXPRESS init & settings
const port = process.env.PORT || 4000
const app = express()

// AWS config & init
AWS.config.update({
    region : 'us-east-1'
})

// AWS Forecast
const forecast = new AWS.ForecastQueryService({
    endpoint : 'forecastquery.us-east-1.amazonaws.com'
})

// CORS
app.use(CORS())

// GET Root
app.get('/', (req, res) => {
    res.send('Welcome to the noobmaster69 Forecast API!')
})

// GET Predict
app.get('/predict/:bed', express.json(), (req, res) => {
    forecast.queryForecast({
        Filters: {
            item_id: `${req.params.bed}`
        },
        ForecastArn: 'arn:aws:forecast:us-east-1:064625423172:forecast/hackathon_forecast_deepar',
        StartDate: url.parse(req.url, true).query.start,
        EndDate: url.parse(req.url, true).query.end
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.send(err).status(400)
        } else {
            res.send(data)
            console.log(data)
        }
    })
})

// INIT Server
app.listen(port, () => console.log(`Server ONLINE on PORT: ${port}`))