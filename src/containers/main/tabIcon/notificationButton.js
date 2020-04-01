import React, { Component } from 'react';
import { View, Image, BackHandler } from 'react-native';
import { Container, Header, Content, Badge, Text, Icon } from 'native-base';
import BaseView from 'containers/base/baseView';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import commonStyles from 'styles/commonStyles';
//Icon Notification
import ic_alarm_active from "images/ic_alarm_active.png";
import ic_alarm_off from "images/ic_alarm_off.png";
import * as actions from 'actions/userActions'
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import Utils from 'utils/utils';

const WIDTH = 28
const HEIGHT = 20

class NotificationButton extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        this.props.countNewNotification()
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
            console.log("NOTIFICATION")
            this.props.navigation.navigate('Home')
        } else {
            return false
        }
        return true
    }

    render() {
        const WIDTH = Utils.getLength(parseInt(global.badgeCount)) < 2 ? 18 : 26
        const HEIGHT = 18
        const RIGHT = Utils.getLength(parseInt(global.badgeCount)) < 2 ? 8 : 0
        const { focused, navigation } = this.props;
        if (focused) {
            console.log("RENDER NOTIFICATION BUTTON", navigation)
            this.className = navigation.state.routeName
        }
        return (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        resizeMode={'contain'}
                        //style={{ tintColor: focused ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY }}
                        source={focused ? ic_alarm_active : ic_alarm_off}
                    // tintColor={focused ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY}
                    />
                    <Text style={[{
                        color: focused ? Colors.COLOR_PRIMARY_LOW : Colors.COLOR_GRAY,
                        textAlign: 'center',
                        fontSize: Fonts.FONT_SIZE_X_SMALL
                    }]}>Thông báo</Text>
                </View>

                {
                    global.badgeCount > 0 ?
                        (
                            <View style={{
                                // If you're using react-native < 0.57 overflow outside of the parent
                                // will not work on Android, see https://git.io/fhLJ8
                                position: 'absolute',
                                alignSelf: 'flex-start',
                                right: RIGHT,
                                // top: 0,
                                height: HEIGHT,
                                width: WIDTH,
                                backgroundColor: Colors.COLOR_RED,
                                borderRadius: Constants.CORNER_RADIUS,
                                padding: Constants.PADDING,
                                borderColor: Colors.COLOR_WHITE,
                                borderWidth: 1,
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: Fonts.FONT_SIZE_X_SMALL,
                                }}>{global.badgeCount}</Text>
                            </View>
                        ) : null}

            </View>
        );
    }
}

const mapStateToProps = state => ({
    data: state.notifications.data,
    isLoading: state.notifications.isLoading,
    errorCode: state.notifications.errorCode,
    action: state.notifications.action
})

export default connect(mapStateToProps, actions)(NotificationButton)
