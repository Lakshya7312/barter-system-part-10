import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Modal
} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class SignUpLoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      emailID: '',
      password: '',
      isModalVisible: false,
      firstName: '',
      lastName: '',
      contact: '',
      address: '',
      confirmPassword: ''
    }
  }

  login = async (emailID, password) => {
    firebase.auth().signInWithEmailAndPassword(emailID, password)
      .then(() => {
        this.props.navigation.navigate("Request");
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      })
  }

  userSignUp = (username, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert("The passwords don't match!\nPlease check and try again.");
    }
    else {
      firebase.auth().createUserWithEmailAndPassword(username, password)
        .then((response) => {
          db.collection("users").add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            mobile_number: this.state.contact,
            address: this.state.address,
            email: this.state.emailID,
          })

          return Alert.alert(
            'User Registered Successfully\nLogin to continue!',
            '',
            [
              { text: 'OK', onPress: () => this.setState({ "isModalVisible": false }) },
            ]
          );
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        })
    }
  }

  showModal = () => {
    return (
      <Modal animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: '100%' }}>
            <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontWeight: "700", fontSize: 30, alignSelf: "center", color: "#fff" }}>REGISTRATION</Text>
              <TextInput style={styles.regForm} placeholder="First Name" placeholderTextColor="#fff" maxLength={8} onChangeText={(text) => { this.setState({ firstName: text }) }} />
              <TextInput style={styles.regForm} placeholder="Last Name" placeholderTextColor="#fff" maxLength={8} onChangeText={(text) => { this.setState({ lastName: text }) }} />
              <TextInput style={styles.address} placeholder="Address" placeholderTextColor="#fff" multiline={true} onChangeText={(text) => { this.setState({ address: text }) }} />
              <TextInput style={styles.regForm} placeholder="Email" placeholderTextColor="#fff" keyboardType="email-address" onChangeText={(text) => { this.setState({ email: text }) }} />
              <TextInput style={styles.regForm} placeholder="Mobile Number" placeholderTextColor="#fff" keyboardType="numeric" maxLength={10} onChangeText={(text) => { this.setState({ contact: text }) }} />
              <TextInput style={styles.regForm} placeholder="Password" placeholderTextColor="#fff" secureTextEntry={true} onChangeText={(text) => { this.setState({ password: text }) }} />
              <TextInput style={styles.regForm} placeholder="Confirm Password" placeholderTextColor="#fff" secureTextEntry={true} onChangeText={(text) => { this.setState({ confirmPassword: text }) }} />
              <View style={styles.modalBackButton}>
                <TouchableOpacity style={[styles.buttons, { borderRadius: 5, marginTop: 25, width: 120, height: 35 }]} onPress={() => {
                  if (this.state.firstName === "") {
                    return Alert.alert("Please enter your name!!");
                  }
                  if (this.state.lastName === "") {
                    return Alert.alert("Please enter your name!!");
                  }
                  if (this.state.contact === "") {
                    return Alert.alert("Please enter your contact!!");
                  }
                  if (this.state.address === "") {
                    return Alert.alert("Please enter your address!!");
                  }
                  if (this.state.confirmPassword === "") {
                    return Alert.alert("Please confirm your password!!");
                  }
                  else {
                    this.userSignUp(this.state.emailID, this.state.password, this.state.confirmPassword);
                  }
                }}>
                  <Text style={{ color: "#000", alignSelf: "center", marginTop: 6 }}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBackButton}>
                <TouchableOpacity style={[styles.buttons, { borderRadius: 5, marginTop: 30 }]} onPress={() => { this.setState({ isModalVisible: false }) }}>
                  <Text style={{ color: "#000", alignSelf: "center", marginTop: 1 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="margin" enabled>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {this.showModal()}
        </View>
        <Text style={{ fontWeight: "700", fontSize: 25, alignSelf: "center", marginTop: 30 }}>BARTER SYSTEM</Text>
        <Image source={require("../assets/Welcome.png")} style={{ marginTop: 10, height: 250, width: 300, alignSelf: "center" }} />
        <View>
          <TextInput
            style={styles.loginBox}
            placeholder="Email"
            keyboardType='email-address'
            onChangeText={(text) => {
              this.setState({
                emailID: text
              })
            }}
          />
          <TextInput
            style={styles.loginBox}
            placeholder='Password'
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({ password: text })
            }}
          />
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              this.login(this.state.emailID, this.state.password);
              this.setState({ emailID: "", password: "" });
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              this.setState({ emailID: "", password: "", isModalVisible: true });
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Image source={require("../assets/Sign-up.png")} style={{ height: 270, width: 350, alignSelf: "center" }} />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff9a76",
    width: '100%',
  },

  loginBox: {
    borderWidth: 1.3,
    borderColor: "#ffeadb",
    marginTop: 30,
    paddingLeft: 9,
    alignSelf: "center",
    outline: "none",
    width: 180,
    height: 27,
    color: "#fff"
  },

  buttons: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#f7c5a8",
    width: 100,
    height: 25,
    borderRadius: 10,
  },

  buttonText: {
    color: "#1c2b2d",
    alignSelf: "center",
    textAlign: "center",
    marginTop: 1.5,
    fontWeight: "400",
    textAlignVertical: "center"
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },

  address: {
    borderWidth: 1.3,
    borderColor: "#ffeadb",
    marginTop: 30,
    paddingLeft: 9,
    alignSelf: "center",
    width: 160,
    height: 80,
    color: "#fff"
  },

  regForm: {
    borderWidth: 1.3,
    borderColor: "#ffeadb",
    marginTop: 30,
    paddingLeft: 9,
    alignSelf: "center",
    width: 160,
    height: 30,
    color: "#fff"
  },

  modalButton: {
    backgroundColor: "#f7c5a8",
    alignSelf: "center",
    marginTop: 15,
  }

})