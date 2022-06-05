import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';

import { Text, Body, Badge, Button, Spinner } from 'native-base';

import styles from './styles'

const statusConvert = ["BOOKING", "PENDING", "REJECTED", "APPROVED", "ARCHIVED"]

const extractItemKey = item => {
    return item.ID.toString();
};

function Item({ item }) {
    return (
        <>
            <View style={styles.item}>
                <View
                    style={{
                        width: 60,
                        height: 100,
                        borderRadius: 10,
                        backgroundColor: '#d32f2f',
                        marginRight: 7,
                        marginLeft: 3,
                        marginTop: 2,
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{
                        color: "white",
                        fontFamily: "Roboto_medium",
                        fontWeight: "bold",
                        paddingTop: 15
                    }}>{item.date.split(' ').slice(1,2).join('')}</Text>
                    <Text style={{
                        color: "white",
                        fontFamily: "Roboto",
                        fontSize: 30
                    }}>{item.date.split(' ').slice(2, 3).join('')}</Text>
                </View>
                <View style={styles.messageContainer}>
                    <View style={{ maxWidth: 300 }}>
                        <Text style={styles.name} numberOfLines={1}>
                            {item.patientName}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <Button small bordered rounded style={{ backgroundColor: 'white', margin: 5, borderColor: "#d32f2f" }}>
                                <Text style={{ color: "#d32f2f", fontFamily: "Roboto", paddingBottom: 20 }}>Ward {item.patientWard}</Text>
                            </Button>
                            <Button small bordered rounded style={{ backgroundColor: 'white', margin: 5, borderColor: "#d32f2f" }}>
                                <Text style={{ color: "#d32f2f", fontFamily: "Roboto", paddingBottom: 20 }}>Bed {item.patientBed}</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <Button small rounded style={[styles.booking, styles.pending, styles.rejected, styles.approved, styles.archived][item.ApptStatus]}>
                            <Text style={styles.badge}>{statusConvert[item.ApptStatus]}</Text>
                        </Button>
                        <Button small rounded style={{margin: 5, marginTop: 8}}>
                <Text style={styles.badge}>{item.startTime} – {item.endTime}</Text>
                        </Button>
                    </View>
                </View>
            </View>
            <View />
        </>
    );
}

function renderItemSeparator() {
    return <View style={{ height: 10 }} />;
}

function QuickActions(props) {

    return (
        <View style={styles.qaContainer}>
            {/* <View style={[styles.button, styles.button1]}>
                <Text style={[styles.buttonText, styles.button1Text]}>Archive</Text>
            </View>
            <View style={[styles.button, styles.button2]}>
                <Text style={[styles.buttonText, styles.button2Text]}>Snooze</Text>
            </View> */}
            <View style={[styles.button, styles.button3]}>
                <Text onPress={props.deleteItem} style={[styles.buttonText, styles.button3Text]}>Delete</Text>
            </View>
        </View>
    );
}

class SwipeableList extends Component {
    render() {
            if (!this.props.ListLoading) {
                return (
                    <>
                        <SafeAreaView>
                            <SwipeableFlatList
                                keyExtractor={extractItemKey}
                                data={this.props.searchActive ? this.props.filteredList : this.props.visitorList}
                                renderItem={({ item }) => <Item item={item} />}
                                maxSwipeDistance={80}
                                renderQuickActions={({ item }) => <QuickActions item={item} deleteItem={() => this.props.deleteItem(item["ID"])} />}
                                contentContainerStyle={styles.contentContainerStyle}
                                shouldBounceOnMount={true}
                                ItemSeparatorComponent={renderItemSeparator}
                                style={{padding: 10}}
                            />
                        </SafeAreaView>
                    </>
                )
            } else {
                return (
                    <Spinner color='red' />
                )
            }
    };
};

export default SwipeableList;
