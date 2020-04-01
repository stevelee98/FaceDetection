import React, { Component } from "react";
import {
    FlatList, Picker, ScrollView, Dimensions,
    ImageBackground, View, StatusBar, StyleSheet,
    Alert, Animated, Easing
} from "react-native";
import {
    Container, Header, Title, Left, Icon,
    Right, Button, Body, Content, Text,
    Card, CardItem, Image
} from "native-base";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import StorageUtil from "utils/storageUtil";
import Utils from 'utils/utils';
import SplashScreen from 'react-native-splash-screen';
import statusType from "enum/statusType";

class SplashView extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
        this.animate = new Animated.Value(1)
    }

    render() {
        const animateStyle = this.animate.interpolate({
            inputRange: [0, 0],
            outputRange: [0.5, 1],
        })
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: `center`,
                    backgroundColor: Colors.COLOR_BACKGROUND
                }}>

                <Animated.Image
                    style={{
                        transform: [{
                            scale: animateStyle
                        }
                        ],
                        resizeMode: 'contain',
                        opacity: 0
                    }}
                    source={require('images/ic_logo_splash.png')}
                />
            </View>
        );
    }

    componentDidMount() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                if (user.status == statusType.ACTIVE) {
                    this.setState({ user });
                }
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
        });
        this.getToken();
    }

    /**
     * Login
     */
    login() {
        const { user } = this.state;
        if (!Utils.isNull(user)) {
            this.goHomeScreen();
        } else {
            this.goLoginScreen()
        }
        SplashScreen.hide();
    }

    /**
     * Get token
     */
    getToken() {
        StorageUtil.retrieveItem(StorageUtil.USER_TOKEN).then((token) => {
            //this callback is executed when your Promise is resolved
            global.token = token;
            this.login()
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
            this.login()
        })
    }
}

export default SplashView;