import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 50,
    },
});

class CustomCalendarPicker extends Component {    
    render() {
        return (
            <View style={styles.container}>
                <CalendarPicker
                    onDateChange={this.props.onDateChange}
                />
            </View>
        );
    }
}

export default CustomCalendarPicker