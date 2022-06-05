// IMPORTS (Main)
const express = require('express');
const docClient = require('../AWS/main').docClient;
const uuid = require('uuid').v4;


// INIT Router
const router = express.Router()

// The Alphabet
let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

// GET ALL VISITS
router.get('/', (req, res) => {
    docClient.scan({
        TableName: 'Visits'
    }, (err, data) => {
        if (err) console.error(err)
        else res.send(data)
    })
})

// POST NEW VISIT
router.post('/new', express.json(), (req, res) => {
    let ID = uuid()
    req.io.emit('newPatient', { id: req.params.id, status: req.body.ApptStatus })

    docClient.put({
        TableName: "Visits",
        Item: Object.assign({}, req.body, { ID })
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.send(err).status(400)
        } else {
            res.send(`Item created with ID: ${ID}`)
            console.log(`Item created with ID: ${ID}`)
        }
    })

})

// PUT (SINGLE) VISIT
router.put('/update/:id', express.json(), (req, res) => {
    req.io.emit('statusChange', { id: req.params.id, status: req.body.ApptStatus })

    docClient.update({
        TableName: "Visits",
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
            res.send(err).status(400)
        } else {
            res.send(`Item update with ID: ${req.params.id}`)
            console.log(data, `Item updated with ID: ${req.params.id}`)
        }
    })
})

// DELETE (SINGLE) VISIT
router.delete('/delete/:id', (req, res) => {
    req.io.emit('deleteUser', { id: req.params.id })
    docClient.delete({
        TableName: "Visits",
        Key: {
            "ID": req.params.id
        }
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.send(err).status(400)
        } else {
            res.send(`Item deleted with ID: ${req.params.id}`)
            console.log(`Item deleted with ID: ${req.params.id}`)
        }
    })
})

// EXPORT Router
module.exports = router
