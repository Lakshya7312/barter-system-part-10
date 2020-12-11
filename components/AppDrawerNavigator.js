import * as React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyBarters from '../screens/MyBarters';
import NotificationsScreen from '../screens/NotificationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator,
        navigationOptions: {
            title: "Home"
        }
    },

    MyBarters: {
        screen: MyBarters,
        navigationOptions: {
            title: "My Barters"
        }
    },

    Notifications: {
        screen: NotificationsScreen,
        navigationOptions: {
            title: "Notifications"
        }
    },

    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            title: "Settings"
        }
    },
},
    {
        contentComponent: CustomSideBarMenu
    },
    {
        initialRouteName: "Home",
    }
)