import React from 'react';
import { AppLoading } from 'expo';
import { Container, Header, Content, Left, Body, Right, Drawer, Button, Icon, IconNB, Title, Text, View, Fab } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import BookingModal from './components/BookingModal/bookingModal';
import SearchBar from './components/SearchBar/searchBar';
import SwipeableList from './components/SwipeableList/swipeList'
import ProfileModal from './components/profileModal/profileModal'
import ScannerModal from './components/scannerModal/scannerModal'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      active: false,
      modalVisible: false,
      profileVisible: false,
      scannerVisible: false,
      searchActive: false,
      loggedIn: false,
      visitorUUID: "-1",
      visitorName: "",
      NRIC: "",
      visitorList: [],
      filteredList: [],
      patientDetails: [],
      ListLoading: false,
      email: ""
    };
  }

  async componentDidMount() {
    console.disableYellowBox = true;
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.reloadList()
    this.getPatientDetails()
    // console.log(this.state.patientDetails)
    this.setState({ isReady: true });

  }
  getPatientDetails = async () => {
    try {
      res = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/patients")
      res = await res.json()
      this.setState({ patientDetails: res["Items"] })
    } catch (err) {
      console.log(err)
    }
  }
  reloadList = () => {
    fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits')
      .then((data) => {
        return data.json()
      })
      .then(jsonData => {
        let visitorList = []
        jsonData.Items.forEach((e) => {
          // e.ward = '3'
          // e.bed = '10'
          visitorList.push(e)
        })
        // console.log(visitorList)
        return visitorList
      })
      .then(visitorList => {
        return visitorList.filter((e) => e["visitorUUID"] == this.state.visitorUUID)
      })
      .then(visitorList => {
        this.setState({
          visitorList: visitorList,
          filteredList: visitorList,
          ListLoading: false
        });

      })
      .catch((err) => {
        console.log(err)
      })
  }
  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  toggleProfile = () => {
    this.setState({ profileVisible: !this.state.profileVisible })
    this.reloadList()
  }
  toggleScanner = () => {
    this.setState({ scannerVisible: !this.state.scannerVisible })
  }

  toggleSearch = () => {
    this.setState({ searchActive: !this.state.searchActive })
  }
  changeName = (name) => {
    this.setState({ visitorName: name })
  }

  changeNRIC = (NRIC) => {
    this.setState({ NRIC: NRIC })
  }

  changeEmail = (email) => {
    this.setState({ email: email })
  }

  search = (val) => {
    let searchValue = val.nativeEvent.text
    let filteredList = this.state.visitorList.filter((booking) => {
      return booking["patientName"].includes(searchValue)
    })
    this.setState({ filteredList })
  }
  createVisitorUUID = async () => {
    try {
      const data = {
        "IC": this.state.NRIC,
        "isMale": true,
        "VisitorName": this.state.visitorName,
        "Age": -1
      }
      const response = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/visitors/new", {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
      });
      const text = await response.text()
      const responseUUID = text.split(": ").slice(1, 2).join('')
      this.setState({ visitorUUID: responseUUID })
      // console.log("new ID", responseUUID)
      this.reloadList()
      return response.json()
    }
    catch (err) {
      console.log(err)
    }
  }
  retrieveVisitorUUID = () => {
    fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/visitors')
      .then((data) => {
        return data.json()
      })
      .then(jsonData => {
        let returnedUUID = ""
        let stored = false
        jsonData["Items"].forEach((e) => {
          if (e["IC"] == this.state.NRIC) {
            returnedUUID = e["ID"]
            stored = true
          }
        })
        return stored ? returnedUUID : -1
      })
      .then(uuid => {
        if (uuid === -1) {
          this.createVisitorUUID()
        }
        else {
          this.setState({ visitorUUID: uuid })
          // console.log("ID", uuid)
          this.reloadList()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  regEmail = async () => {
    try {
      let res = await fetch(`http://NoobmasterSnsServer2-env.eba-mzpcfvn3.us-east-1.elasticbeanstalk.com/add`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ "email": this.state.email }) // body data type must match "Content-Type" header
      })
    } catch (err) {
      console.log(err)
    }
  }

  login = () => {
    if (this.state.NRIC === "" || this.state.visitorName === "" || this.state.email === "") {
      alert("Please key in all fields.")
    }
    else {
      this.setState({
        loggedIn: true,
        scannerVisible: false
      })
      this.retrieveVisitorUUID()
      this.regEmail()
    }
    this.reloadList()
  }

  logout = () => {
    this.setState({
      loggedIn: false,
      profileVisible: false,
      NRIC: "",
      visitorUUID: "-1",
      visitorName: ""
    })
    this.reloadList()
  }

  deleteItem = async (itemID) => {
    try {
      let res = await fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits/delete/' + itemID, {
        method: 'DELETE'
      })
      this.reloadList()
      alert("Booking Deleted")
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Container>
        <Header style={{ backgroundColor: "#d32f2f" }}>
          <Left>
            <Button onPress={this.toggleSearch} style={{ backgroundColor: "white" }}>
              {/* <Text style={{ color: "#d32f2f" }}>LOGIN</Text> */}
              <Icon name={this.state.searchActive ? 'close' : 'search'} style={{ color: "#d32f2f" }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "white", fontFamily: "Roboto_medium" }}>FARRER PARK</Title>
          </Body>
          <Right>
            <Button onPress={this.state.loggedIn ? this.toggleProfile : this.toggleScanner} style={{ backgroundColor: "white" }}>
              <Icon name={this.state.loggedIn ? 'person' : 'barcode'} style={{ color: "#d32f2f" }} />
            </Button>
          </Right>
        </Header>
        <SearchBar
          active={this.state.searchActive}
          search={this.search}
        />
        <Content>
          <View
            style={{
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 10,
            }}>
            <Text style={{ fontSize: 30, fontWeight: '600' }}>My Bookings</Text>
          </View>
          <SwipeableList
            ListLoading={this.state.ListLoading}
            visitorList={this.state.visitorList}
            filteredList={this.state.filteredList}
            searchActive={this.state.searchActive}
            deleteItem={this.deleteItem}
            loggedIn={this.loggedIn}
          />
          <Body>
            <Text>Total Bookings: {this.state.visitorList.length}</Text>
          </Body>
        </Content>
        <BookingModal
          visitorUUID={this.state.visitorUUID}
          toggle={this.toggleModal}
          modalVisible={this.state.modalVisible}
          reloadList={this.reloadList}
          visitorName={this.state.visitorName}
          patientDetails={this.state.patientDetails}
          email={this.state.email}
        />
        <ProfileModal
          logout={this.logout}
          toggle={this.toggleProfile}
          modalVisible={this.state.profileVisible}
          NRIC={this.state.NRIC}
          visitorUUID={this.state.visitorUUID}
        />
        <ScannerModal
          login={this.login}
          changeName={this.changeName}
          name={this.state.visitorName}
          toggle={this.toggleScanner}
          modalVisible={this.state.scannerVisible}
          changeNRIC={this.changeNRIC}
          NRIC={this.state.NRIC}
          email={this.state.email}
          changeEmail={this.changeEmail}
        />
        <Fab
          active={this.state.active}
          direction="up"
          style={{ backgroundColor: "#d32f2f" }}
          position="bottomRight"
          onPress={this.toggleModal}
        >
          <IconNB name="md-add" />
        </Fab>
      </Container>
    );
  }
}