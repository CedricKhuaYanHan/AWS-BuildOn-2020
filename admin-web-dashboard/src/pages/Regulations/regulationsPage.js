import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Grid, Typography, Button, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import styles from './styles.js';
// import './regulationsPage.css'
import LimitSlider from './limitSlider';
import AgeSlider from './ageSlider'
import RegulationsTable from 'components/RegulationsTable/regulationsTable.js';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class RegulationsPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            start: "Tue Sep 15 2020 09:00:00 GMT+0800 (Singapore Standard Time)",
            end: "Tue Sep 15 2020 20:00:00 GMT+0800 (Singapore Standard Time)",
            openTimeBar: false,
            openCountBar: false,
            openAgeBar: false,
            CountLimit: 5,
            AgeLimit: [18, 65],
            unauthorisedCheck: false,
            openAuthBar: false,
            exceedArr: []
        }
    }
    toggleUnauthorised = () => {
        this.updateAuthBool(!this.state.unauthorisedCheck)
        this.setState({
            unauthorisedCheck: !this.state.unauthorisedCheck,
            openAuthBar: true
        })
    }
    openTimeBar = () => {
        this.setState({ openTimeBar: true })
    }
    closeTimeBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openTimeBar: false })
    };

    openAgeBar = () => {
        this.setState({ openAgeBar: true })
    }
    closeAgeBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openAgeBar: false })
    };

    openAuthBar = () => {
        this.setState({ openAuthBar: true })
    }
    closeAuthBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openAuthBar: false })
    };

    openCountBar = () => {
        this.setState({ openCountBar: true })
    }
    closeCountBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openCountBar: false })
    };

    changeStart = (start) => {
        this.setState({ start: start.toString() })
    }

    changeEnd = (end) => {
        this.setState({ end: end.toString() })
    }
    getCurrentBookedNumber = async () => {
        let currentPatientUUID
        let totCount = {}
        try {
            let res = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/beds")
            res = await res.json()
            currentPatientUUID = res["Items"]
            try {
                let currentApprovedList = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/visits")
                currentApprovedList = await currentApprovedList.json()

                currentApprovedList = currentApprovedList["Items"]

                currentPatientUUID.forEach(elem => {

                    currentApprovedList.forEach(elem2 => {
                        if (!(elem['ID'] in totCount)) {
                            totCount[elem['ID']] = 0
                        }
                        if (elem["PatientUUID"] === elem2["patientUUID"] && elem2["ApptStatus"] === 0) {
                            if (elem["ID"] in totCount) {
                                let count = totCount[elem['ID']]
                                totCount[elem['ID']] = count + 1
                            }
                        }
                    })
                })
                return totCount
            } catch (err) {
                console.log(err)
            }
        } catch (err) {
            console.log(err)
        }

    }
    sendCancelEmail = (wardArr) => {
        fetch('http://NoobmasterSnsServer2-env.eba-mzpcfvn3.us-east-1.elasticbeanstalk.com/publish/cancel',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    "wards": wardArr
                })
            }
        )
            .then(res => res.json())
            .then(res => { console.log(res) })
            .catch(err => { console.log(err) })
    }
    setLimit = (limit) => {
        let prev = this.state.CountLimit
        this.setState({ CountLimit: parseInt(limit["srcElement"].innerText) })
        if (this.state.CountLimit < prev) {
            console.log(prev, this.state.CountLimit)
            this.sendCancelEmail(this.state.exceedArr)
        }
    }

    setAgeLimit = (limit) => {
        console.log(limit["srcElement"].innerText.split('\n'))
    }
    updateLimit = () => {
        this.openTimeBar()
    }
    updateCountLimit = async () => {
        this.openCountBar()
        try {
            let response = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/rules/update", {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    "CountLimit": this.state.CountLimit,
                })
            });
            let booked = await this.getCurrentBookedNumber()
            let exceedArr = []
            Object.keys(booked).forEach((e) => {
                if (booked[e] > this.state.CountLimit) {
                    exceedArr.push(e)
                }
            })

            this.setState({ exceedArr: exceedArr })
        }
        catch (err) {
            console.log(err)
        }

    }

    updateAuthBool = async (bool) => {
        try {
            let response = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/rules/update", {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    "AuthBool": bool,
                })
            });
        }
        catch (err) {
            console.log(err)
        }

    }

    updateAgeLimit = () => {
        this.openAgeBar()
    }

    render() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container>
                    <Grid item xs={3}>
                        <TimePicker
                            autoOk
                            variant="static"
                            openTo="hours"
                            value={this.state.start}
                            onChange={this.changeStart}
                        />
                    </Grid>

                    <Grid item xs={6} id="time_render" style={styles.timeRender} direction="column">
                        {/* <Typography variant="h3">
                            {this.state.start.toLocaleTimeString().slice(0, -3)} to {this.state.end.toLocaleTimeString().slice(0, -3)}
                            </Typography>   
                            <Button variant="contained" id="time_update_button" style={styles.timeUpdateButton}>
                                update
                            </Button> */}
                        <Typography variant="h3">
                            {this.state.start.split(' ').slice(4, 5).join().slice(0, -3)} to {this.state.end.split(' ').slice(4, 5).join().slice(0, -3)}
                        </Typography>
                        <Button variant="contained" id="time_update_button" style={styles.timeUpdateButton} onClick={this.updateLimit}>
                            update
                            </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <TimePicker
                            autoOk
                            variant="static"
                            openTo="hours"
                            value={this.state.end}
                            onChange={this.changeEnd}
                        />
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <LimitSlider
                            setLimit={this.setLimit}
                            updateLimit={this.updateCountLimit}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <AgeSlider
                            setAgeLimit={this.setAgeLimit}
                            updateLimit={this.updateAgeLimit}
                        />
                    </Grid>
                </Grid>
                <Grid container style={{ marginBottom: 100 }}>
                    <Grid item xs={12} style={{ border: 1 }}>
                        <RegulationsTable
                            unauthorised={this.state.unauthorisedCheck}
                            toggleUnauthorised={this.toggleUnauthorised}
                        />
                    </Grid>
                </Grid>
                <Snackbar open={this.state.openTimeBar} autoHideDuration={3000} onClose={this.closeTimeBar}>
                    <Alert onClose={this.closeTimeBar} severity="success">
                        Visitation period updated! It is now from {this.state.start.split(' ').slice(4, 5).join().slice(0, -3)} to {this.state.end.split(' ').slice(4, 5).join().slice(0, -3)}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.openCountBar} autoHideDuration={3000} onClose={this.closeCountBar}>
                    <Alert onClose={this.closeCountBar} severity="success">
                        Visitation Count limit has been updated to {this.state.CountLimit}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.openAgeBar} autoHideDuration={3000} onClose={this.closeAgeBar}>
                    <Alert onClose={this.closeAgeBar} severity="success">
                        Visitation Age limit has been updated to {this.state.AgeLimit}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.openAuthBar} autoHideDuration={3000} onClose={this.closeAuthBar}>
                    <Alert onClose={this.closeAuthBar} severity="success">
                        Check for unauthorised visitors has been set to {this.state.unauthorisedCheck.toString()}
                    </Alert>
                </Snackbar>
            </MuiPickersUtilsProvider>
        )
    }
}

export default RegulationsPage
