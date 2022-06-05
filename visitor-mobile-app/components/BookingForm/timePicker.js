import React, { useState } from "react";
import { View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Button, Text } from 'native-base'

function TimePicker(props) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const confirmation = (time) => {
        props.setTime(time)
        hideDatePicker()
    }
    return (
        <View>
            <Button rounded onPress={showDatePicker} style={{ margin: 15 }}>
                <Text>{props.title}</Text>
            </Button>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={confirmation}
                onCancel={hideDatePicker}
                isDarkModeEnabled={false}
                textColor="black"
                headerTextIOS="Start Time"
                is24Hour={true}
                date={new Date()}
                minuteInterval={30}
            />
        </View>
    );
};

export default TimePicker;
