// IMPORTS (Main)
const express = require('express');
const CORS = require('cors');

// IMPORTS (Routes)
const visits = require('./routes/visits');
const rules = require('./routes/rules');
const patients = require('./routes/patients');
const beds = require('./routes/beds');
const visitors = require('./routes/visitors');

// EXPRESS init & settings
const port = process.env.PORT || 3000
const app = express()

// Server init for Socket
const server = require('http').createServer(app);
const io = require('socket.io')(server, {});

// Socket
io.on('connection', socket => {
    console.log(`socket ${socket.id} connected`)
});

// CORS
app.use(CORS())

// GET Root
app.get('/', (req, res) => {
    res.send('Welcome to the noobmaster69 Backend API!')
})

//socket avail to routes
app.use(function (req, res, next) {
    req.io = io;
    next();
});

// ROUTES
app.use('/visits', visits)
app.use('/rules', rules)
app.use('/patients', patients)
app.use('/beds', beds)
app.use('/visitors', visitors)

// INIT Server
server.listen(port, () => console.log(`Server ONLINE on PORT: ${port}`))