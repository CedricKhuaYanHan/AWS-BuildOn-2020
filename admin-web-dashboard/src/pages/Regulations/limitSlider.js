import React, { useState, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Slider, Typography, Button } from '@material-ui/core';

const styles = {
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: 50
    }
}

export default class LimitSlider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sliderValue: null
        }
    }

    valuetext = (value) => {
        return `${value}`;
    }

    componentDidMount() {
        fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/rules')
            .then((res) => res.json())
            .then(res => {
                let items = res.Items
                items.forEach((elem) => {
                    if (elem.Field == 'CountLimit') {
                        this.setState({ sliderValue: elem.Value ? elem.Value : 5 })
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div style={styles.root}>
                <Typography id="discrete-slider" variant="h4" style={{ color: "#4051B5", marginTop: 50, marginBottom: 50 }}>
                    Visitor Count Limit
                </Typography>
                {this.state.sliderValue != null &&
                    <>
                        <Slider
                            defaultValue={this.state.sliderValue}
                            getAriaValueText={this.valuetext}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChangeCommitted={this.props.setLimit}
                            valueLabelDisplay="on"
                        />
                        <Button
                            onClick={this.props.updateLimit}
                            variant="outlined" style={{ margin: 20, backgroundColor: "#4051B5", color: "white" }}>
                            Update
                        </Button>
                    </>
                }

            </div>
        )
    };
}
