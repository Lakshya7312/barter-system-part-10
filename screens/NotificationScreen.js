import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import db from '../config';
import SwipeableFlatlist from '../components/SwipeableFlatlist';

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      allNotifications: []
    };
    this.notificationRef = null
  }

  getNotifications = () => {
    this.requestRef = db.collection("all-notifications")
      .where("notification_status", "==", "unread")
      .where("requesterID", '==', this.state.userID)
      .onSnapshot((snapshot) => {
        var allNotifications = []
        snapshot.docs.map((doc) => {
          var notification = doc.data()
          notification["doc_id"] = doc.id
          allNotifications.push(notification)
        });
        this.setState({
          allNotifications: allNotifications
        });
      })
  }

  componentDidMount() {
    this.getNotifications()
  }

  componentWillUnmount() {
    this.notificationRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        leftElement={<Icon name="list" color='#696969' />}
        title={item.itemName}
        titleStyle={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
        subtitle={item.message}
        subtitleStyle={{ fontSize: 15 }}
        bottomDivider
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title={"Notifications"} navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          {
            this.state.allNotifications.length === 0
              ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={require('../assets/Notification.png')} />
                  <Text style={{ fontSize: 19 }}>You have no notifications!</Text>
                </View>
              )
              : (
                <SwipeableFlatlist allNotifications={this.state.allNotifications} />
              )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
