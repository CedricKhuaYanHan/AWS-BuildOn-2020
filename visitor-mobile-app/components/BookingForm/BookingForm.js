import React, { Component } from 'react';
import { Container, Content, View, H1, Body, Button, Text, Item, Input, Label } from 'native-base';

import CustomCalendarPicker from './calendarPicker.js';
import TimePicker from './timePicker';
import PatientModal from '../PatientInputModal/patientModal.js';
import HealthForm from '../healthDecForm/healthForm.js'

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function bedToId(bed) {
    let bedArr = ['A', 'B', 'C', 'D']
    let finId = 1
    finId = finId * (bedArr.indexOf(bed[0])) * 30
    let numb = parseInt(bed.split(bed[0])[1])
    finId += numb
    return `bed_${finId}`
}

class BookingForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            custom: false,
            recselection: null,
            appointments: {},
            selectedStartDate: null,
            startTime: null,
            endTime: null,
            pickedPatient: null,
            email: '',
            patientBed: null,
            patientWard: null,
            recArr: null
        }
    }

    onSelect = (pick) => {
        this.setState({
            pickedPatient: pick
        })
        if (this.state.selectedStartDate) {
            let predURL = 'http://noobmaster69.us-east-1.elasticbeanstalk.com/beds/predictBest'
            this.props.patientDetails.forEach((e, index) => {
                if (e["ID"] === pick["key"]) {
                    this.setState({ patientWard: e["Ward"] })
                    this.setState({ patientBed: e["Bed"] })
                    let startDate = addDays(this.state.selectedStartDate, 0)
                    let endDate = addDays(this.state.selectedStartDate, 1)
                    let bed = bedToId(e['Bed'])
                    let finURL = `${predURL}/${bed}/2?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
                    // console.log(finURL)
                    fetch(finURL)
                        .then(val => {
                            return val.json()
                        })
                        .then(respObj => {
                            this.setState({ recArr: respObj })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
        }
    }
    setStartTime = (time) => {
        // console.log("START", time)
        this.setState({ startTime: time.toString().split(" ").slice(4, 5).join('').split(':').slice(0, 2).join(':') })
    }
    setEndTime = (time) => {
        // console.log("END", time)
        this.setState({ endTime: time.toString().split(" ").slice(4, 5).join('').split(':').slice(0, 2).join(':') })
    }


    onDateChange = (date) => {
        this.setState({ selectedStartDate: date.toString().split(' ').slice(0, 4).join(" ") })
        if (this.state.pickedPatient) {
            let predURL = 'http://noobmaster69.us-east-1.elasticbeanstalk.com/beds/predictBest'
            this.props.patientDetails.forEach((e, index) => {
                if (e["ID"] === this.state.pickedPatient["key"]) {
                    this.setState({ patientWard: e["Ward"] })
                    this.setState({ patientBed: e["Bed"] })
                    let endDate = addDays(date, 1)
                    let bed = bedToId(e['Bed'])
                    let finURL = `${predURL}/${bed}/2?start=${date.toISOString()}&end=${endDate.toISOString()}`
                    // console.log(finURL)
                    fetch(finURL)
                        .then(val => {
                            return val.json()
                        })
                        .then(respObj => {
                            this.setState({ recArr: respObj })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
        }
    }
    toggleCustom = () => {
        this.setState({ custom: !this.state.custom })
    }
    postData = async (url = '', data = {}) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
            this.props.reloadList()
            return response.json();
        }
        catch (err) {
            console.log(err)
        }
    }
    handleSelectionOne = () => {
        this.setState({
            recselection: 0,
            startTime: this.state.recArr[0]["Timestamp"].split('T')[1].slice(0, 5),
            endTime: (parseInt(this.state.recArr[0]["Timestamp"].split('T')[1].slice(0, 2)) + 1).toString() + ":00"
        })
    }
    handleSelectionTwo = () => {
        this.setState({
            recselection: 1,
            startTime: this.state.recArr[1]["Timestamp"].split('T')[1].slice(0, 5),
            endTime: (parseInt(this.state.recArr[1]["Timestamp"].split('T')[1].slice(0, 2)) + 2).toString() + ":00"
        })
    }
    handleSelectionThree = () => {
        this.setState({
            recselection: 2,
            startTime: this.state.recArr[2]["Timestamp"].split('T')[1].slice(0, 5),
            endTime: (parseInt(this.state.recArr[2]["Timestamp"].split('T')[1].slice(0, 2)) + 3).toString() + ":00"
        })
    }

    sendConfEmail = () => {

        fetch(`http://NoobmasterSnsServer2-env.eba-mzpcfvn3.us-east-1.elasticbeanstalk.com/publish/confirm`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({ "patient": this.state.pickedPatient.label, "time": this.state.selectedStartDate }) // body data type must match "Content-Type" header
        })
            .then(res => res.json())
            .then(res => { console.log(res) })
            .catch(err => { console.log(err) })

    }
    calcTimeDiff = (start, end) => {
        let startArr = start.split(':')
        let endArr = end.split(':')
        let minDiff = (parseInt(endArr[0]) - parseInt(startArr[0])) * 60 - parseInt(startArr[1]) + parseInt(endArr[1])
        return minDiff
    }

    isTimeAllowed = (start, end) => {
        let startT = parseInt(start.replace(':', ''))
        let endT = parseInt(end.replace(':', ""))
        if (startT < 1100 || endT < 1100 || (startT > 1400 && startT < 1700) || (endT > 1400 && endT < 1700) || startT > 2000 || endT > 2000) {
            return false
        }
        return true
    }

    submitBooking = () => {
        console.log('email', this.props.email)
        if (this.state.selectedStartDate === null ||
            this.state.pickedPatient === null) {
            alert("Some fields are not filled.")
        }
        else if (!this.state.custom) {
            this.props.patientDetails.forEach((e) => {
                if (this.state.pickedPatient !== null && e["ID"] === this.state.pickedPatient["key"]) {
                    this.setState({ patientWard: e["Ward"] })
                    this.setState({ patientBed: e["Bed"] })
                    console.log(this.state.pickedPatient)
                }
            })
            let dateObj = new Date(this.state.selectedStartDate)
            let dateStr = dateObj.toISOString()
            dateStr = dateStr.split('T')[0]
            let dateArr = dateStr.split('-')
            let startTimeArr = this.state.startTime.split(':')
            let endTimeArr = this.state.endTime.split(':')

            console.log(startTimeArr, endTimeArr, dateArr)

            let startDate = Date.UTC(dateArr[0], parseInt(dateArr[1]) - 1, parseInt(dateArr[2]) + 1, parseInt(startTimeArr[0]) - 8, startTimeArr[1])
            let endDate = Date.UTC(dateArr[0], parseInt(dateArr[1]) - 1, parseInt(dateArr[2]) + 1, parseInt(endTimeArr[0]) - 8, endTimeArr[1])
            let data = {
                visitorUUID: this.props.visitorUUID,
                patientUUID: this.state.pickedPatient["key"],
                patientName: this.state.pickedPatient["label"],
                date: this.state.selectedStartDate,
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                visitorName: this.props.visitorName,
                ApptStatus: 0,
                patientWard: this.state.patientWard,
                patientBed: this.state.patientBed,
                Start1: startDate,
                End1: endDate
            }
            this.postData('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits/new', data)
            this.sendConfEmail()
            alert("Successful.")
            this.props.closeModal()
        }
        else {
            let patientBed, patientWard;
            this.props.patientDetails.forEach((e, index) => {
                if (e["ID"] === this.state.pickedPatient["key"]) {
                    this.setState({ patientWard: e["Ward"] })
                    this.setState({ patientBed: e["Bed"] })
                }
            })

            let timeD = this.calcTimeDiff(this.state.startTime, this.state.endTime)
            let allowed = this.isTimeAllowed(this.state.startTime, this.state.endTime)
            if (!allowed) {
                alert('Visitation hours are strictly from 11am-2pm and 5pm-8pm.')
                return
            }
            if (timeD < 0) {
                alert('End time must be after start time')
                return
            }
            else if (timeD > 180) {
                alert('Maximum visitation time is 3hours')
                return
            }
            let dateObj = new Date(this.state.selectedStartDate)
            let dateStr = dateObj.toISOString()
            dateStr = dateStr.split('T')[0]
            let dateArr = dateStr.split('-')
            let startTimeArr = this.state.startTime.split(':')
            let endTimeArr = this.state.endTime.split(':')

            console.log(startTimeArr, endTimeArr, dateArr)

            let startDate = Date.UTC(dateArr[0], parseInt(dateArr[1]) - 1, parseInt(dateArr[2]) + 1, parseInt(startTimeArr[0]) - 8, startTimeArr[1])
            let endDate = Date.UTC(dateArr[0], parseInt(dateArr[1]) - 1, parseInt(dateArr[2]) + 1, parseInt(endTimeArr[0]) - 8, endTimeArr[1])

            let data = {
                visitorUUID: this.props.visitorUUID,
                patientUUID: this.state.pickedPatient["key"],
                patientName: this.state.pickedPatient["label"],
                date: this.state.selectedStartDate,
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                visitorName: this.props.visitorName,
                ApptStatus: 0,
                patientWard: this.state.patientWard,
                patientBed: this.state.patientBed,
                Start1: startDate,
                End1: endDate
            }

            this.postData('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits/new', data)
            this.sendConfEmail()

            alert("Successful.")
            this.props.closeModal()
        }
    }

    render() {
        let startDate = this.state.selectedStartDate ? this.state.selectedStartDate.toString() : 'Jan 1 2020'
        let startTime = this.state.startTime ? this.state.startTime.toString() : '12:00'
        let endTime = this.state.endTime ? this.state.endTime.toString() : '12:00'

        return (
            <Container>
                <Content>
                    <PatientModal onSelect={this.onSelect} pickedPatient={this.state.pickedPatient} />

                    <CustomCalendarPicker onDateChange={this.onDateChange} />

                    {(!this.state.custom && this.state.pickedPatient && this.state.selectedStartDate && this.state.recArr) &&
                        <View>
                            <Body>
                                <H1 style={{ color: "#d32f2f", fontWeight: "700", textTransform: "uppercase", margin: 20 }}>We recommend...</H1>
                            </Body>
                            <Body>
                                <Button
                                    onPress={this.handleSelectionOne}
                                    bordered={this.state.recselection !== 0}
                                    rounded style={{ margin: 10, marginHorizontal: 20 }}>
                                    <Text>
                                        {this.state.recArr[0]["Timestamp"].split('T')[1].slice(0, 5)} – {
                                            (parseInt(this.state.recArr[0]["Timestamp"].split('T')[1].slice(0, 5).slice(0, 2)) + 1).toString() + ":00"
                                        }
                                    </Text>
                                </Button>
                            </Body>
                            <Body>
                                <Button
                                    onPress={this.handleSelectionTwo}
                                    bordered={this.state.recselection !== 1}
                                    rounded style={{ margin: 10, marginHorizontal: 20 }}>
                                    <Text>
                                        {this.state.recArr[1]["Timestamp"].split('T')[1].slice(0, 5)} – {
                                            (parseInt(this.state.recArr[1]["Timestamp"].split('T')[1].slice(0, 5).slice(0, 2)) + 2).toString() + ":00"
                                        }
                                    </Text>
                                </Button>
                            </Body>
                            <Body>
                                <Button
                                    onPress={this.handleSelectionThree}
                                    bordered={this.state.recselection !== 2}
                                    rounded style={{ margin: 10, marginHorizontal: 20 }}>
                                    <Text>
                                        {this.state.recArr[2]["Timestamp"].split('T')[1].slice(0, 5)} – {
                                            (parseInt(this.state.recArr[2]["Timestamp"].split('T')[1].slice(0, 5).slice(0, 2)) + 3).toString() + ":00"
                                        }
                                    </Text>
                                </Button>
                            </Body>
                            <Body>
                                <Button bordered rounded style={{ margin: 10, marginHorizontal: 20 }} onPress={this.toggleCustom}>
                                    <Text>Custom Timing</Text>
                                </Button>
                            </Body>
                        </View>}



                    {this.state.custom &&
                        <View>
                            <Body style={{ flexDirection: "row", alignItems: "center" }}>
                                <TimePicker setTime={this.setStartTime} title={this.state.startTime ? startTime : "Start Time"} />
                                <TimePicker setTime={this.setEndTime} title={this.state.endTime ? endTime : "End Time"} />
                            </Body>

                            <Body>
                                <Button bordered rounded>
                                    <Text>{startDate}</Text><Text>{startTime} - {endTime}</Text>
                                </Button>
                            </Body>
                        </View>
                    }

                    <Body>
                        <HealthForm />
                    </Body>
                    <Body>
                        <Button onPress={this.submitBooking} rounded style={{ margin: 20, backgroundColor: "green" }}>
                            <Text>SUBMIT</Text>
                        </Button>
                    </Body>
                </Content>
            </Container>
        )
    }
}

export default BookingForm