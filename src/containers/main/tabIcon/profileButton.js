import React, { Component } from 'react';
import { View, Text, Image, BackHandler } from 'react-native';
import BaseView from 'containers/base/baseView';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import commonStyles from 'styles/commonStyles';
//Icon Profile
import ic_user_off from "images/ic_user_off.png";
import ic_user_active from "images/ic_user_active.png";

const WIDTH_HEIGHT = 14

class ProfileButton extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    /**
     * Handler back button
     */
    handlerBackButton() {
        const { focused, navigation } = this.props;
        console.log(this.className, 'back pressed')
        if (focused && navigation) {
            console.log("PROFILE")
            this.props.navigation.navigate('Home')
        } else {
            return false
        }
        return true
    }

    render() {
        const { focused, navigation } = this.props;
        if (focused) {
            console.log("RENDER PROFILE BUTTON", navigation)
        }
        return (
            <View>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        //style={{ tintColor: focused ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY }}
                        resizeMode={'contain'}
                        source={focused ? ic_user_active : ic_user_off}
                    // tintColor={focused ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY}
                    />
                    <Text style={[{
                        color: focused ? Colors.COLOR_PRIMARY_LOW : Colors.COLOR_GRAY,
                        textAlign: 'center',
                        fontSize: Fonts.FONT_SIZE_X_SMALL
                    }]}>Tài khoản</Text>
                </View>
            </View>
        );
    }
}


export default ProfileButton
