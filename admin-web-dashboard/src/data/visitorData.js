//socket import

let socketIOClient = require('socket.io-client')
const ENDPOINT = `http://localhost:3000/`
const socket = socketIOClient(ENDPOINT);
socket.on("statusChange", data => {
    console.log(data)
});

const status = ["BOOKING", "PENDING", "REJECTED", "APPROVED", "ARCHIVED"]
let rows = []
// fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits')
//     .then(data => {
//         return data.json()
//     })
//     .then(obj => {
//         let items = obj.Items
//         let allRows = []
//         for (let i = 0; i < items.length; i++) {
//             let wholeObj = items[i]
//             let timeInt = wholeObj['startTime'].split(':')
//             timeInt = parseInt(timeInt[0] + timeInt[1])
//             let interObj = createData(wholeObj['visitorName'], timeInt, wholeObj['patientName'], 36, parseInt(wholeObj['status']))
//             console.log(interObj)
//             allRows.push(interObj)
//         }
//         return allRows
//     })
//     .then(allRows => {
//         console.log(allRows)
//         setRows(allRows)
//     })
//     .catch(err => { console.log(err) })

function createData(visitorName, dateTime, patientName, temperature, status) {
    return { visitorName, dateTime, patientName, temperature, status };
}

function fetchData() {
    fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits')
        .then(data => {
            return data.json()
        })
        .then(obj => {
            let items = obj.Items
            for (let i = 0; i < items.length; i++) {
                let wholeObj = items[i]
                let timeInt = wholeObj['startTime'].split(':')
                timeInt = parseInt(timeInt[0] + timeInt[1])
                rows.push((createData(wholeObj['visitorName'], timeInt, wholeObj['patientName'], 36, parseInt(wholeObj['status']))))
            }
            return rows
        })
        .then(rows => {
            console.log(rows)
            module.exports = { rows }
        })
        .catch(err => { console.log(err) })
}

fetchData()

rows = [
    createData('Cedric', 2359, "Mom", 36, 0),
    createData('Matt', 2357, "Bro", 38, 2),
    createData('Marcus', 2356, "Sis", 39, 3),
    createData('Justin', 2355, "John", 40, 4),
];

console.log(rows)
module.exports = { rows }