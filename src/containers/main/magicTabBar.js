import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, View, Image, Text } from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import bg_line from 'images/bg_line.png';
import StorageUtil from 'utils/storageUtil';

import BaseView from 'containers/base/baseView';
import Utils from 'utils/utils';
import firebase from 'react-native-firebase';
import StringUtil from 'utils/stringUtil';

export default class MagicTabBar extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.userInfo = null
        this.route = {
            name: "",
            params: {}
        }
    }

    componentDidMount() {
        this.getProfile()
    }

    /**
     * Get profile user
     */
    getProfile() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                this.userInfo = user
                // firebase.database().ref('conversations').on('value', (snap) => {
                //     console.log("DA VAO LAN ",)
                //     this.countUnseenChatFirebase(user.id)
                // })
                // firebase.database().ref('members').on('value', (snap) => {
                //     this.countUnseenChatFirebase(user.id)
                // })
            }
        }).catch((error) => {

        });
    }

    render() {
        const { style, navigation, activeTintColor, inactiveTintColor, renderIcon, jumpTo } = this.props
        const {
            index,
            routes
        } = navigation.state;
        return (
            <SafeAreaView
                pointerEvents="box-none"
                style={Styles.container}
                forceInset={{
                    top: 'never',
                    bottom: 'always',
                }}
            >
                <SafeAreaView
                    style={[Styles.fakeBackground, style]}
                    forceInset={{
                        top: 'never',
                        bottom: 'always',
                    }}
                >
                    <View style={{ height: 54 }} />
                </SafeAreaView>
                <View
                    pointerEvents="box-none"
                    style={Styles.content}
                >
                    {
                        routes.map((route, idx) => {
                            const focused = index === idx;
                            if (!route.params || !route.params.navigationDisabled) {
                                return (
                                    <View style={{ flex: 1 }} key={idx}>
                                        {this.tabIcon(
                                            route,
                                            renderIcon,
                                            focused,
                                            activeTintColor,
                                            inactiveTintColor,
                                            () => (!route.params || !route.params.navigationDisabled) && jumpTo(route.key)
                                        )}
                                        {/* {focused ? <View style={{ height: Constants.DIVIDE_HEIGHT_MEDIUM + 1 }} >
                                            <Image source={bg_line} resizeMode={"stretch"} style={{ height: '100%', width: '100%' }} />
                                        </View> : null} */}
                                    </View>
                                );
                            }

                            const Icon = renderIcon({
                                route,
                                focused,
                                tintColor: focused
                                    ? activeTintColor
                                    : inactiveTintColor
                            });

                            return {
                                ...Icon,
                                key: 'simple'
                            };
                        })
                    }
                </View>
            </SafeAreaView>
        );
    }

    tabIcon = (route, renderIcon, focused, activeTintColor, inactiveTintColor, onPress) => {
        return (
            <TouchableOpacity
                style={Styles.tabStyle}
                onPress={() => !Utils.isNull(this.userInfo)
                    ? onPress && onPress()
                    : route.routeName != "Notification" && route.routeName != "Profile"
                        ? onPress && onPress()
                        : this.gotoLogin(route)
                }
            >
                {
                    renderIcon({
                        route,
                        focused,
                        tintColor: focused
                            ? activeTintColor
                            : inactiveTintColor
                    })
                }
            </TouchableOpacity>
        )
    }

    /**
     * Go to login screen
     */
    gotoLogin = (route) => {
        this.route.name = route.routeName
        this.props.navigation.navigate("Login", {
            router: this.route
        })
    }
}

const Styles = {
    container: {
        position: 'relative',
        bottom: 0,
        width: '100%',
        justifyContent: 'flex-end',
        minHeight: 54
    },
    fakeBackground: {
        position: 'absolute',
        width: '100%',
        backgroundColor: Colors.COLOR_WHITE
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
};