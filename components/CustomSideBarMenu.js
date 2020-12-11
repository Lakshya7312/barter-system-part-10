import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import firebase from 'firebase';

export default class CustomSideBarMenu extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate('SignUpLoginScreen');
              firebase.auth().signOut();
            }}>
            <Text style={styles.logOutText}>SIGN OUT</Text>
          </TouchableOpacity>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  drawerItemsContainer: {
    flex: 1
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30
  },
  logOutButton: {
    height: "5%",
    width: '100%',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "blue"
  },
  logOutText: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 20,
    color: "white",
    textAlign: "center"
  }
})
