// IMPORTS (Main)
const express = require('express');
const docClient = require('../AWS/main').docClient;
const fetch = require('node-fetch');
const url = require('url');

// INIT Router
const router = express.Router()

// The Alphabet
let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

// GET ALL BEDS
router.get('/', (req, res) => {
    docClient.scan({
        TableName: 'Beds'
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            res.send(data)
            console.log(data)
        }
    })
})

// PUT (SINGLE) BED
router.put('/update/:id', express.json(), (req, res) => {
    req.io.emit('visitChange', { id: req.params.id, count: req.body.VisitorCount })

    docClient.update({
        TableName: "Beds",
        Key: {
            "ID": req.params.id
        },
        UpdateExpression: Object.keys(req.body).reduce((acc, cur, i) => {
            if (i) {
                return acc + `, ${cur} = :${abc[i]}`
            } else {
                return acc + `${cur} = :${abc[i]}`
            }
        }, "set "),
        ExpressionAttributeValues: Object.keys(req.body).reduce((acc, cur, i) => {
            return Object.assign({}, acc, { [`:${abc[i]}`]: req.body[cur] })
        }, {})
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            res.send(`Item update with ID: ${req.params.id}`)
            console.log(data, `Item updated with ID: ${req.params.id}`)
        }
    })
})

// DELETE BED
router.delete('/delete/:id', (req, res) => {
    docClient.delete({
        TableName: "Beds",
        Key: {
            "ID": req.params.id
        }
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            res.send(`Item deleted with ID: ${req.params.id}`)
            console.log(`Item deleted with ID: ${req.params.id}`)
        }
    })
})

// GET PREDICTIONS
router.get('/predict/:bed', express.json(), (req, res) => {
    fetch(`http://forecastbackend-env.eba-mwwgucx4.us-east-1.elasticbeanstalk.com/predict/${req.params.bed}?${url.parse(req.url).query}`)
        .then(res => res.json())
        .then((val) => {
            console.log(val)
            res.send(val)
        })
        .catch((err) => {
            console.error(err)
            res.status(400).send(err)
        })
})

// GET "3" BEST PREDICTIONS
router.get('/predictBest/:bed/:window', express.json(), (req, res) => {
    const visitingHours = [11, 12, 13, 17, 18, 19]
    fetch(`http://forecastbackend-env.eba-mwwgucx4.us-east-1.elasticbeanstalk.com/predict/${req.params.bed}?${url.parse(req.url).query}`)
        .then(res => res.json())
        .then((val) => {
            let predictions = []
            let timespan = parseInt(req.params.window)

            for (let i = 0; i < val.Forecast.Predictions.p50.length - timespan; i++) {
                let prediction = []
                for (let j = 0; j < timespan; j++) {
                    prediction.push(val.Forecast.Predictions.p50[i + j])
                }
                predictions.push(prediction)
            }

            res.send(predictions
                .filter(e => e.filter(item => visitingHours.includes(new Date(item.Timestamp).getHours())).length === timespan)
                .map(e => {
                    return {
                        Timestamp: e[0].Timestamp,
                        Value: e.reduce((acc, cur) => acc + cur.Value, 0) / timespan
                    }
                })
                .sort((a, b) => a.Value - b.Value).slice(0, 3))
        })
        .catch((err) => {
            console.error(err)
            res.status(400).send(err)
        })
})

// EXPORT Router
module.exports = router