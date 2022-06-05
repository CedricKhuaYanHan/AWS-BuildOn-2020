import React from "react";
import { Modal, Left, Right } from "react-native";
import styles from './styles'
import { Button, H1, H3, Content, View, Label, Input, Item, Text, Footer, Body } from "native-base";
import BarcodeScanner from "../BarcodeScanner/barcodeScanner";
import CheckBox from 'react-native-check-box'

class ScannerModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isChecked1: false
        }
    }
    changeNRIC = (NRIC) => {
        this.props.changeNRIC(NRIC)
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Content style={{ textAlign: "center", width: "100%" }}>
                            <Body>
                                <H1 style={{ color: "#d32f2f", fontWeight: "900", textTransform: "uppercase", marginTop: 50 }}>LOGIN PAGE</H1>
                            </Body>
                            <Body>
                                <Item floatingLabel style={{ marginVertical: 20 }}>
                                    <Label style={{ textAlign: "center" }}>Name</Label>
                                    <Input value={this.props.name} onChangeText={this.props.changeName} />
                                </Item>
                                <Item floatingLabel style={{ marginBottom: 20 }}>
                                    <Label style={{ textAlign: "center" }}>Email</Label>
                                    <Input value={this.props.email} onChangeText={this.props.changeEmail} />
                                </Item>
                            </Body>
                            <Body>
                                <H3 style={{ color: "#d32f2f", fontWeight: "500" }}>Scan ID</H3>
                                <BarcodeScanner
                                    NRIC={this.props.NRIC}
                                    changeNRIC={this.changeNRIC}
                                />
                            </Body>
                            <Body style={{ margin: 25 }}>
                                <H3 style={{ textAlign: "center", fontWeight: "bold", margin: 3, marginTop: 20 }}>Not in close contact with confirmed COVID-19 cases.</H3>
                                <H3 style={{ textAlign: "center", fontWeight: "bold", margin: 3, marginTop: 20 }}>Not under a quarantine order/stay home notice.</H3>
                                <H3 style={{ textAlign: "center", fontWeight: "bold", margin: 3, marginTop: 20 }}>No flu/fever like symptoms.</H3>
                                <CheckBox
                                    style={{ flex: 1, padding: 10 }}
                                    onClick={() => {
                                        this.setState({
                                            isChecked1: !this.state.isChecked1
                                        })
                                    }}
                                    isChecked={this.state.isChecked1}
                                    leftText="Checked"
                                />
                            </Body>
                            <Body>
                                <Button onPress={this.props.login} rounded style={{ marginBottom: 50 }}>
                                    <Text>Login  as {this.props.NRIC}</Text>
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

export default ScannerModal;
