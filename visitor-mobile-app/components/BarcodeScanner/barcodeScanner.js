import React, { useState, useEffect } from 'react';
import {  StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {Button, Text, Body, View} from 'native-base'
export default function CustomBarcodeScanner(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        props.changeNRIC(data)
        alert(`${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: 200,
                width: 200,
            }}>
            { scanned ?
                (<Body>
                <Button onPress={() => setScanned(false)} style={{marginTop: 100}}>
                        <Text>Scan Again</Text>
                </Button>
                </Body>) :
                (<BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />)
            }
        </View>
    );
}
