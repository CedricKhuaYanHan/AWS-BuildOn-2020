// IMPORTS (Main)
const express = require('express');
const docClient = require('../AWS/main').docClient;

// INIT Router
const router = express.Router()

// GET ALL RULES
router.get('/', (req, res) => {
    docClient.scan({
        TableName: 'Rules'
    }, (err, data) => {
        if (err) console.error(err)
        else res.send(data)
    })
})

// UPDATE RULE
router.post('/update', express.json(), (req, res) => {
    docClient.batchWrite({
        RequestItems: {
            Rules: Object.keys(req.body).map(e => {
                return {
                    PutRequest: {
                        Item: {
                            Field: e,
                            Value: req.body[e]
                        }
                    }
                }
            })
        }
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.send(err).status(400)
        } else {
            res.send(`Items updated!`)
            console.log(`Items updated!`)
        }
    })
})

// DELETE RULE
router.delete('/delete/:id', (req, res) => {
    docClient.delete({
        TableName: "Rules",
        Key: {
            "Field": req.params.id
        }
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.send(err).status(400)
        } else {
            res.send(`Rule deleted with Field: ${req.params.id}`)
            console.log(`Rule deleted with Field: ${req.params.id}`)
        }
    })
})

// EXPORT Router
module.exports = router