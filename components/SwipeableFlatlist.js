import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../config';

export default class SwipeableFlatlost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allNotifications: this.props.allNotifications
        }
    }

    updateMarkAsRead = (notification) => {
        db.collection("all-notifications").doc(notification.doc_id).update({
            "notification_status": "read"
        })
    }

    onSwipeValueChange = swipeData => {
        var allNotifications = this.state.allNotifications;
        const { key, value } = swipeData;

        if (value < -Dimensions.get('window').width) {
            const newData = [...allNotifications];
            const prevIndex = allNotifications.findIndex(item => item.key === key);
            this.updateMarkAsRead(allNotifications[prevIndex]);
            newData.splice(prevIndex, 1);
            this.setState({ allNotifications: newData })
        };
    };

    renderItem = data => (
        <ListItem
            leftElement={<Icon name="book" type="font-awesome" color="#696969" />}
            title={data.item.book_name}
            titleStyle={{ color: "black", fontWeight: "bold" }}
            subtitle={data.item.message}
            bottomDivider
        />
    )

    renderHiddenItem = () => {
        <View style={styles.rowback}>
            <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <Text style={styles.backTextWhite}></Text>
            </View>
        </View>
    }

    render() {
        return (
            <View style={styles.container}>
                <SwipeListView
                    disableRightSwipe
                    data={this.state.allNotifications}
                    renderItem={this.renderItem}
                    renderHiddenItem={this.renderHiddenItem}
                    rightOpenValue={-Dimensions.get('window').width}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onSwipeValueChange={this.onSwipeValueChange}
                />
            </View>
        )
    }
}