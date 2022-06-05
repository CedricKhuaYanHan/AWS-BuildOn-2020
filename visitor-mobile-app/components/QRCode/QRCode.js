import React, {Component} from 'react'
import QRCode from 'react-native-qrcode-svg';

class ProfileCode extends Component {
    render() {
        return (
            <QRCode size={300} value={this.props.text} />
        );
    };
}

export default ProfileCode