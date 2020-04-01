import React, { Component } from 'react';
import { View, Text, Image, BackHandler } from 'react-native';
import BaseView from 'containers/base/baseView';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import commonStyles from 'styles/commonStyles';
//Icon Home
import ic_home_active from "images/ic_home_active.png";
import ic_home_off from "images/ic_home_off.png";

const WIDTH_HEIGHT = 14

class HomeButton extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            isExitApp: true
        };
        global.onOpeningScan = this.onOpeningScan.bind(this)
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    /**
     * 
     * @param {*} isOpeningScan 
     */
    onOpeningScan(isOpeningScan) {
        this.setState({
            isExitApp: isOpeningScan ? false : true
        })
    }

    /**
     * Handler back button
     */
    handlerBackButton() {
        const { focused, navigation } = this.props;
        console.log(this.className, 'back pressed')
        if (focused && navigation) {
            console.log("HOME")
            if (this.state.isExitApp) {
                global.onExitApp()
            }
        } else {
            return false
        }
        return true
    }

    render() {
        const { focused, navigation } = this.props;
        if (focused) {
            console.log("RENDER HOME BUTTON", navigation)
        }
        return (
            <View>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        // style={{ tintColor: focused ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY }}
                        resizeMode={'contain'}
                        source={focused ? ic_home_active : ic_home_off}
                    //tintColor={focused ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY}
                    />
                    <Text style={[{
                        color: focused ? Colors.COLOR_PRIMARY_LOW : Colors.COLOR_GRAY,
                        textAlign: 'center',
                        fontSize: Fonts.FONT_SIZE_X_SMALL
                    }]}>Trang Chủ</Text>
                </View>
            </View>
        );
    }
}


export default HomeButton
