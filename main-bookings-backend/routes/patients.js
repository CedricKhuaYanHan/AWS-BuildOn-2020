// IMPORTS (Main)
const express = require('express');
const docClient = require('../AWS/main').docClient;
const uuid = require('uuid').v4;

// INIT Router
const router = express.Router()

// The Alphabet
let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

// GET ALL PATIENTS
router.get('/', (req, res) => {
    docClient.scan({
        TableName: 'Patients'
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

// GET (SINGLE) PATIENT
router.get('/details/:id', (req, res) => {
    docClient.get({
        TableName: 'Patients',
        Key: {
            ID : req.params.id
        }
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

// POST NEW PATIENT
router.post('/new', express.json(), (req, res) => {
    let ID = uuid()
    docClient.put({
        TableName: "Patients",
        Item: Object.assign({}, req.body, {ID})
    }, (err, data) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            res.send(`Item created with ID: ${ID}`)
            console.log(`Item created with ID: ${ID}`)
        }
    })
})

// PUT (SINGLE) PATIENT
router.put('/update/:id', express.json(), (req, res) => {
    docClient.update({
        TableName: "Patients",
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
            return Object.assign({}, acc, {[`:${abc[i]}`]: req.body[cur]})
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

// DELETE (SINGLE) PATIENT
router.delete('/delete/:id', (req, res) => {
    docClient.delete({
        TableName: "Patients",
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

// UPDATE PATIENT-BED ASSIGNMENT
router.put('/assign', express.json(), (req, res) => {
    try {
        Object.keys(req.body).forEach((e) => {
            docClient.update({
                TableName: "Patients",
                Key: {
                    "ID": e
                },
                UpdateExpression: "set Bed = :b",
                ExpressionAttributeValues: {
                    ":b": req.body[e]
                }
            }, (err, data) => {
                if (err) throw err
            })
            docClient.update({
                TableName: "Beds",
                Key: {
                    "ID": req.body[e]
                },
                UpdateExpression: "set PatientID = :p",
                ExpressionAttributeValues: {
                    ":p": e
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