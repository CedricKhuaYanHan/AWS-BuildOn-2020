// IMPORTS (Main)
const express = require('express');
const docClient = require('../AWS/main').docClient;
const uuid = require('uuid').v4;

// INIT Router
const router = express.Router()

// The Alphabet
let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

// GET ALL VISITORS
router.get('/', (req, res) => {
    docClient.scan({
        TableName: 'Visitors'
    }, (err, data) => {
        if (err) console.error(err)
        else res.send(data)
    })
})

// GET (SINGLE) VISITOR
router.get('/details/:id', (req, res) => {
    docClient.get({
        TableName: 'Visitors',
        Key: {
            ID: req.params.id
        }
    }, (err, data) => {
        if (err) console.error(err)
        else res.send(data)
    })
})

// POST NEW VISITOR
router.post('/new', express.json(), (req, res) => {
    let ID = uuid()
    docClient.put({
        TableName: "Visitors",
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

// PUT (SINGLE) VISITOR
router.put('/update/:id', express.json(), (req, res) => {

    docClient.update({
        TableName: "Visitors",
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

// DELETE (SINGLE) VISITOR
router.delete('/delete/:id', (req, res) => {
    docClient.delete({
        TableName: "Visitors",
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

router.post('/register', express.json(), (req, res) => {
    try {
        Object.keys(req.body).forEach((e) => {
            docClient.put({
                TableName: "Relations",
                Item: {
                    ID: uuid(),
                    VisitorUUID: e,
                    PatientUUID: req.body[e]
                }
            }, (err, data) => {
                if (err) throw err
            })
        })
    } catch(err) {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
    } finally {
        res.send(`All items updated succesfully!`)
        console.log(`${Object.keys(req.body).length} patients (re)-assigned to beds.`)
    }
})

// EXPORT Router
module.exports = router