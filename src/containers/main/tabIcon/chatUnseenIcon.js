
import React, { Component } from 'react';
import { View, Image, BackHandler, Platform, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Badge, Text, Icon } from 'native-base';
import BaseView from 'containers/base/baseView';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import commonStyles from 'styles/commonStyles';
//Icon Notification
import ic_notification_black from "images/ic_notification_black.png";
import ic_notification_white from "images/ic_notification_white.png";
import * as actions from 'actions/userActions'
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import StorageUtil from 'utils/storageUtil';
import firebase from 'react-native-firebase';
import Utils from 'utils/utils';
import StringUtil from 'utils/stringUtil';

class ChatUnseenIcon extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            unseen: 0
        };
        this.heightStatusBar = (Platform.OS === 'ios') ? Constants.STATUS_BAR_HEIGHT : 10;
    }

    componentDidMount() {
        this.handleUnseen()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps != this.props) {
            this.handleUnseen()
        }
    }

    /**
     * Handle number unseen
     */
    handleUnseen() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            if (!Utils.isNull(user)) {
                try {
                    firebase.database().ref(`members`).on('value', (memberSnap) => {
                        let unseen = 0
                        if (!Utils.isNull(memberSnap.val())) {
                            let conversationIds = []
                            memberSnap.forEach(item => {
                                const objMember = item.val()
                                Object.keys(objMember).map((key, index) => {
                                    const uIdMember = key // ~ u1, u2, u3 ... (u = user_id)
                                    const valueMember = objMember[key] // ~ {number_of_unseen_messages: 15, deleted_conversation: true or false}
                                    const idMember = StringUtil.getNumberInString(uIdMember) // from u1 => 1...
                                    if (idMember == user.id & !valueMember.deleted_conversation) {
                                        unseen += valueMember.number_of_unseen_messages
                                    }
                                });
                            });
                            global.numberUnseen = unseen
                        }
                        this.setState({ unseen })
                    })
                } catch (error) {
                    console.log("ERROR GET UNSEEN BASEVIEW: ", error)
                }
            }
        }).catch(error => {

        });
    }

    render() {
        const { onClick } = this.props;
        const WIDTH = Utils.getLength(parseInt(this.state.unseen)) < 2 ? 20 : 28
        const HEIGHT = 20
        return (
            this.state.unseen > 0
                ?
                <TouchableOpacity
                    style={{
                        // If you're using react-native < 0.57 overflow outside of the parent
                        // will not work on Android, see https://git.io/fhLJ8
                        position: 'absolute',
                        top: -Constants.MARGIN_LARGE + 2,
                        right: -Constants.MARGIN_LARGE + 2,
                        height: HEIGHT,
                        width: WIDTH,
                        backgroundColor: Colors.COLOR_SKY_BLUE,
                        borderRadius: Constants.CORNER_RADIUS,
                        padding: Constants.PADDING,
                        borderColor: Colors.COLOR_WHITE,
                        borderWidth: 1,
                        ...commonStyles.viewCenter
                    }}
                    onPress={() => {
                        onClick()
                    }}
                >
                    <Text style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: Fonts.FONT_SIZE_X_SMALL,
                    }}>{this.state.unseen}</Text>
                </TouchableOpacity>
                : null
        );
    }
}

export default (ChatUnseenIcon)
