import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import {Grid, Button} from '@material-ui/core';
import ReactModal from 'react-modal'
import CloseIcon from '@material-ui/icons/Close';
import PastVisitorTable from 'components/PastVisitorsTable/pastVisitorTable';
import './styles.css'

export default class BedModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            beds: [],
            currentPDetails: null,
            pDetailsLoad: false,
            tableDisplay: 0
        }
    }

    componentDidMount = async () => {
        try {
            let res = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/beds")
            res = await res.json()
            this.setState({ beds: res["Items"] })
        } catch (error) {
            console.log(error)
        }
    }

    setCurrent = () => {
        this.setState({ tableDisplay: 0 })
    }
    setPast = () => {
        this.setState({ tableDisplay: 1 })
    }
    render() {
        return (
            <>
                <ReactModal isOpen={this.props.visible}>
                    {console.log(this.props.details)}
                    <Grid container>
                        <Typography variant="h4">
                            Bed A{this.props.id} Summary
                        </Typography>
                        <IconButton style={{ marginLeft: 5 }}><CloseIcon onClick={this.props.closeModal} /></IconButton>
                    </Grid>
                    <Grid style={{ marginLeft: 300, marginRight: 300, marginTop: 100 }}>
                        <List disablePadding>
                            <ListItem>
                                <ListItemText primary="Name" />
                                <Typography variant="body2"> {this.props.details.PatientName}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="IC Number: " />
                                <Typography variant="body2"> {this.props.details.IC}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Age: " />
                                <Typography variant="body2"> {this.props.details.Age}</Typography>
                            </ListItem>

                            <ListItem>
                                <ListItemText primary="Gender: " />
                                {this.props.details.isMale == false &&
                                    <Typography>Female</Typography>
                                }
                                {this.props.details.isMale == true &&
                                    <Typography>Male</Typography>
                                }
                            </ListItem>

                        </List>
                        <div id="route-container">
                            <Button onClick={this.setCurrent} class={["route selected", "route"][this.state.tableDisplay]}>Current Visitors</Button>
                            <Button onClick={this.setPast} class={["route", "route selected"][this.state.tableDisplay]}>The Rest</Button>
                        </div>
                        {this.state.tableDisplay === 0 && <PastVisitorTable status={[3]} wantedUUID={this.props.details.ID} />}
                        {this.state.tableDisplay === 1 && <PastVisitorTable status={[0,1,2,4]} wantedUUID={this.props.details.ID} />}
                    </Grid>
                </ReactModal>
            </>
        );
    }
}
