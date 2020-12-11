import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import db from '../config';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';

export default class RequestScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            itemName: "",
            reasonToRequest: '',
            userName: ''
        }
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7);
    }

    addRequest = (itemName, reasonToRequest) => {
        var userID = this.state.userID;
        var randomrequestID = this.createUniqueId();

        db.collection("users").where("emailID", "==", this.state.userID).get()
            .then(data => {
                data.forEach(doc => {
                    this.setState({ userName: doc.data().firstName })
                })
            })

        db.collection('exchange-requests').add({
            "userID": userID,
            "item_name": itemName,
            "reasonToRequest": reasonToRequest,
            "exchangeID": randomrequestID,
            "username": this.state.userName,
        })

        this.setState({
            itemName: '',
            reasonToRequest: ''
        })

        return Alert.alert("Your Item has been requested successfully!");
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="Request An Item" />
                <KeyboardAvoidingView behavior="margin" enabled style={styles.keyBoardStyle}>
                    <TextInput style={styles.inputBox}
                        onChangeText={(text) => {
                            this.setState({ itemName: text });
                        }}
                        value={this.state.itemName}
                        placeholder="Item Name"
                    />
                    <TextInput
                        style={[styles.inputBox, { height: 300, marginBottom: 50 }]}
                        multiline={true}
                        placeholder={"Why do you need the item?"}
                        onChangeText={(text) => {
                            this.setState({
                                reasonToRequest: text
                            })
                        }}
                        value={this.state.reasonToRequest}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            if (this.state.itemName === "") {
                                Alert.alert("Please enter the name of the item!");
                            } else if (this.state.reasonToRequest == "") {
                                Alert.alert("Please enter the reason to request!");
                            } else {
                                this.addRequest(this.state.itemName, this.state.reasonToRequest);
                            }
                        }}>
                        <Text style={{
                            color: "#1c2b2d",
                            alignSelf: "center",
                            textAlign: "center",
                            marginTop: 1.5,
                            fontWeight: "400",
                            justifyContent: "center"
                        }}>Request</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyBoardStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#ff9a76"
    },

    inputBox: {
        width:"75%",
        height:"10%",
        alignSelf:'center',
        borderWidth: 1.3,
        borderColor: "#ffeadb",
        marginTop: 30,
        paddingLeft: 9,
        outline: "none",
        color: "#fff"
    },

    button: {
        marginTop: 20,
        alignSelf: "center",
        backgroundColor: "#f7c5a8",
        width: 100,
        height: 25,
        borderRadius: 10,
    },
})