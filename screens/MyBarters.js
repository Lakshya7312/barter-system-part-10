import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class MyBarters extends React.Component {
  static navigationOptions = { header: null }

  constructor() {
    super();
    this.state = {
      donorID: firebase.auth().currentUser.email,
      allBarters: [],
      donorName: "",
    }
    this.requestRef = null;
  }

  getAllBarters = () => {
    this.requestRef = db.collection("my-barters")
      .where("donorID", "==", this.state.donorID)
      .onSnapshot((snapshot) => {
        var allBarters = [];
        snapshot.docs.map((doc) => {
          var barter = doc.data();
          barter["doc_id"] = doc.id;
          allBarters.push(barter);
        })
        this.setState({ allBarters: allBarters });
      })
  }

  getDonorDetails = (donorID) => {
    db.collection("users").where("emailID", "==", donorID).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().firstName + " " + doc.data().lastName
          })
        });
      })
  }

  componentDidMount() {
    this.getAllBarters();
    this.getDonorDetails(this.state.donorName)
  }

  sendNotification = (itemDetails, requestStatus) => {
    var requestID = itemDetails.requestID;
    var donorID = itemDetails.donorID;
    db.collection("all-notifications")
      .where("requestID", "==", requestID)
      .where("donorID", "==", donorID).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "item Sent") {
            message = this.state.donorName + "sent you the item";
          }
          else {
            message = this.state.donorName + "has shown interest in donating the item";
          }

          db.collection("all-notifications").doc(doc.id).update({
            "message": message,
            "notification_status": "unread",
            "date": firebase.firestore.FieldValue.serverTimestamp(),
          })
        })
      })
  }

  senditem = (itemDetails) => {
    if (itemDetails.requestStatus === "Donor Interested") {
      var requestStatus = "Item Sent";
      db.collection("my-barters").doc(itemDetails.doc_id)
        .update({
          "requestStatus": "item Sent"
        })
      this.sendNotification(itemDetails, requestStatus);
    }
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.itemName}
      subtitle={"Requested by: " + item.requestedBy + "\nStatus:" + item.requestStatus}
      leftElement={<Icon icon name="book" type="font-awesome" color="blue"
        titleStyle={{ color: "black", fontWeight: "bold" }} />}
      rightElement={
        <TouchableOpacity
          style={[styles.button,
          { backgroundColor: item.requestStatus === "item Sent" ? "green" : "#ff5722" }]}
          onPress={() => {
            this.senditem(item);
          }}>
          <Text style={{ color: "white" }}>
            {item.requestStatus === "Donor Interested" ? "Send Item" : "Item Sent"}
          </Text>
        </TouchableOpacity>}
      bottomDivider />
  )

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Barters" />
        <View style={{ flex: 1 }}>
          {
            this.state.allBarters.length === 0
              ? (
                <View style={styles.subtitle}>
                  <Text style={{ fontSize: 20 }}>List of all Barters</Text>
                </View>
              )
              : (
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.allBarters}
                  renderItem={this.renderItem}
                />
              )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ff5722",
    borderRadius: 10
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
