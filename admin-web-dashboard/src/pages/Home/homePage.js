import React, { Component, useEffect, useState } from 'react'
import { Button, Typography } from '@material-ui/core';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

let HomePage = () => {
    const [response, setResponse] = useState("");
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            setResponse(data);
        })
    }, []);

    return (
        // <div>
            // <Typography variant="h2">
            //     Home Page/Test Page
            // </Typography>
        //     <br />
        //     <Typography variant="h6">
        //         Live Web Sockets Functionality <time dateTime={response}>{response}</time>
        //     </Typography> 
        //     <Button variant="outlined" color="primary">
        //         <time dateTime={response}>{response}</time>
        //     </Button>
        // </div>
        <div>
            <Typography variant="h2" style={{ textAlign: "center", color: "#9D2235", marginTop:"30vh"}}>
                Welcome to the Farrer Park Admin Dashboard!
            </Typography>
        </div>
    )
}

export default HomePage