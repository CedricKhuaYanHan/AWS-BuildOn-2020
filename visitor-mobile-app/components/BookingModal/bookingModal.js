import React from "react";
import {
    Modal,
    Text,
    View
} from "react-native";

import styles from './styles'
import { Button, Content, H1, Icon, Footer, Body } from "native-base";
import BookingForm from "../BookingForm/BookingForm";

class BookingModal extends React.Component {
    render() {
        return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.modalVisible}
                    onRequestClose={() => {
                        // Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Content style={{textAlign: "center"}}>
                                <Body>
                                <H1 style={{ color: "#d32f2f", fontWeight: "900", textTransform: "uppercase", marginTop: 50 }}>New Booking</H1>
                                </Body>
                            <BookingForm
                                reloadList={this.props.reloadList}
                                visitorUUID={this.props.visitorUUID}
                                closeModal={this.props.toggle}
                                visitorName={this.props.visitorName}
                                patientDetails={this.props.patientDetails}
                            />
                            </Content>
                            <Footer>
                                <Button hasText style={styles.modalClose} onPress={this.props.toggle}>
                                    <Body>
                                        <Text style={{ color: "white", textAlign: "center" }}>CLOSE</Text>  
                                    </Body>
                                </Button>
                            </Footer>
                        </View>
                    </View>
                </Modal>
        )
    };
};

export default BookingModal;
