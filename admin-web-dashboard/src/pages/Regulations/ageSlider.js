import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Slider, Button, Typography} from '@material-ui/core';

const styles = {
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: 50
    }
}

export default class AgeSlider extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             value: [18,65]
        }
    }
    
    valuetext = (value) => {
        return `${value}`;
    }

    handleChange = (event,newValue) => {
        this.setState({value: newValue});
    };
    render() {
        return (
            <div style={styles.root}>
                <Typography id="discrete-slider" variant="h4" style={{ color: "#4051B5", marginBottom: 50 }}>
                    Age Limit
                </Typography>
                <Slider
                    value={this.state.value}
                    onChange={this.handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    getAriaValueText={this.valuetext}
                    valueLabelDisplay="on"
                    min={0}
                    max={100}
                    onChangeCommitted={this.props.setAgeLimit}
                />
                <Button
                    onClick={this.props.updateAgeimit}
                    variant="outlined" style={{ margin: 20, backgroundColor: "#4051B5", color: "white" }}>
                    Update
                </Button>
            </div>
        );
    }
}
