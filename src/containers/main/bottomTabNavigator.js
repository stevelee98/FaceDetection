import React, { Component } from 'react';
import { BackHandler, Text, View, Image, Alert, Dimensions } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

// Import screens
import NotificationView from 'containers/notification/notificationView';
import UserProfileView from 'containers/profile/info/userProfileView';
import HomeView from 'containers/home/homeView';

// import icons
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import commonStyles from 'styles/commonStyles';
import { Constants } from 'values/constants';
import MagicTabBar from './magicTabBar';
import HomeButton from './tabIcon/homeButton'
import NotificationButton from './tabIcon/notificationButton';
import ProfileButton from './tabIcon/profileButton';

const RouteConfig = {
	Home: {
		screen: HomeView,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => (
				<HomeButton focused={focused} navigation={navigation} />
			),
		}),
	},
	Notification: {
		screen: NotificationView,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => (
				<NotificationButton focused={focused} navigation={navigation} />
			),
		}),
	},
	Profile: {
		screen: UserProfileView,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => (
				<ProfileButton focused={focused} navigation={navigation} />
			),
		}),
	},
};

const BottomNavigatorConfig = {
	tabBarComponent: props => <MagicTabBar {...props} />,
	tabBarOptions: {
		activeTintColor: '#14a08c',
		inactiveTintColor: '#cccccc',
		style: {
			backgroundColor: '#2f2e2e',
		},
		showLabel: false,
	},
	tabStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
};

export default createBottomTabNavigator(RouteConfig, BottomNavigatorConfig);