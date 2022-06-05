import React from "react";
import {
    Modal } from "react-native";

import styles from './styles'
import { Button, Content, H1, Footer, Body, Text, View } from "native-base";
import QRCode from '../QRCode/QRCode'
class ProfileModal extends React.Component {
    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Content style={{ textAlign: "center" }}>
                            <Body>
                                <H1 style={{ color: "#d32f2f", fontWeight: "900", textTransform: "uppercase", marginTop: 50 }}>My QR Code</H1>
                            </Body>
                            <Body>
                                <View style={{marginTop: 100}}>
                                    <QRCode text={this.props.visitorUUID} />
                                </View>
                            </Body>
                            <Body>
                                <Button rounded style={{ marginTop: 50, backgroundColor: "#d32f2f"}}>
                                    <Text>Welcome {this.props.NRIC}</Text>
                                </Button>
                            </Body>
                            <Body>
                                <Button onPress={this.props.logout} rounded style={{ marginTop: 30 }}>
                                    <Text>Logout</Text>
                                </Button>
                            </Body>
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

export default ProfileModal;
