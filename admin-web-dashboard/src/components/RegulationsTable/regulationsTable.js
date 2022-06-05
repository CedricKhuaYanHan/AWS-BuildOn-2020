import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '90%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function RegulationsTable(props) {
    const classes = useStyles();
    return (
        <List dense className={classes.root}>
            {/* {[0, 1, 2, 3].map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return ( */}
                    <ListItem key={0} button>
                        <ListItemAvatar>
                            <Avatar
                                alt={`Avatar n°${1}`}
                        src="../../assets/avatar.png"
                            />
                        </ListItemAvatar>
                <ListItemText id={"checkbox-list-secondary-label-0"} primary={`Check for unauthorised visitors (not approved)`} />
                        <ListItemSecondaryAction>
                            <Checkbox
                                edge="end"
                                onChange={props.toggleUnauthorised}
                                checked={props.unauthorised}
                                inputProps={{ 'aria-labelledby': "checkbox-list-secondary-label-0" }}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                {/* );
            })} */}
        </List>
    );
}