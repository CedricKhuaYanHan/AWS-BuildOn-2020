import React, { Component } from 'react'
import { View } from 'react-native'

import { Button, Text, Body } from 'native-base'
import ModalFilterPicker from 'react-native-modal-filter-picker'

export default class PatientModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            patients: [],
            visible: false,
            pickedPatient: null,
        };
    }

    onShow = () => {
        this.setState({ visible: true });
    }

    onSelection = (pick) => {
        this.props.onSelect(pick)
        this.setState({
            visible: false
        })
    }

    onCancel = () => {
        this.setState({
            visible: false
        });
    }
    componentDidMount = () => {
        fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/patients')
            .then(data => data.json())
            .then(jsonData => {
                let patients = []
                jsonData["Items"].forEach((e) => {
                    patients.push({ key: e["ID"], label: e["PatientName"] })
                })
                return patients
            })
            .then(patients =>
                this.setState({ patients: patients })
            )
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        return (
            <View>
                <Body>
                    <Button rounded onPress={this.onShow} style={{ margin: 15 }}>
                        <Text>{this.props.pickedPatient ? this.props.pickedPatient["label"].toString() : "Select Patient"}</Text>
                    </Button>
                </Body>
                <ModalFilterPicker
                    visible={this.state.visible}
                    onSelect={this.onSelection}
                    onCancel={this.onCancel}
                    placeholderText="Find Patient"
                    noResultsText="No Patient Found"
                    filterTextInputStyle={{ height: 50, color: "black" }}
                    optionTextStyle={{ color: "black" }}
                    options={this.state.patients}
                    autoFocus={false}
                    modal={{ visible: false }}
                />
            </View>
        );
    }
}