'use strict';
import React, { Component } from 'react';
import { View, TextInput, Image, StyleSheet, Text, ImageBackground, Keyboard, ToastAndroid, TouchableOpacity, BackHandler } from 'react-native';
import { Container, Form, Content, Item, Input, Button, Right, Radio, center, ListItem, Left, Root, Header, Body } from 'native-base';
import ButtonComp from 'components/button';
import { capitalizeFirstLetter } from 'utils/stringUtil';
import cover from 'images/bg_launch.png';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import { Colors } from 'values/colors';
import I18n from 'react-native-i18n';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import ic_lock_white from 'images/ic_lock_white.png'
import { Constants } from 'values/constants';
import { Icon, colors } from 'react-native-elements';
import ic_avatar_small_red from 'images/ic_avatar_small_red.png'
import ic_back_white from 'images/ic_back_white.png'
import ic_back_black from 'images/ic_back_black.png'
import Utils from 'utils/utils'
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import { connect } from 'react-redux';
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import StorageUtil from 'utils/storageUtil';
import DateUtil from 'utils/dateUtil';
import statusType from 'enum/statusType';
import shadow_otp_1 from "images/shadow_otp_1.png";
import BackgroundShadow from 'components/backgroundShadow';
import img_logo from 'images/img_logo.png';
import ic_eye_slash_black from 'images/ic_eye_slash_black.png';
import ic_eye_black from 'images/ic_eye_black.png';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import LinearGradient from "react-native-linear-gradient";
import BackgroundCustom from 'components/backgroundCustom';
import CardViewCustom from 'components/cardViewCustom';
import otpType from 'enum/otpType';
import MaskGroupLogin from 'images/MaskGroupLogin.png';

class OTPView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            charOne: '',
            charTwo: '',
            charThere: '',
            charFour: '',
            otpCode: '',
            statusSend: false,
            timeCountDown: 60 * 1.5,
        }
        this.auThenTime = 60 * 1.5
        const { phone, otpType, userSocial } = this.props.navigation.state.params;
        this.phone = phone;
        this.otpType = otpType;
        this.userSocial = userSocial;
    };

    /**
     * Send otp
     */
    sendOTP() {
        let filter = {
            otpType: this.otpType,
            phone: this.phone.trim()
        };
        this.props.sendOTP(filter);
        this.setState({
            statusSend: true,
            timeCountDown: this.auThenTime
        });
    }

    // Action button
    onActionOTP = () => {
        const { statusSend, otpCode, charOne, charTwo, charThere, charFour } = this.state;
        if (charOne !== "" && charTwo != "" && charThere !== "" && charFour != "") {
            const filter = {
                otpType: this.otpType,
                otpCodeOfUser: charOne + charTwo + charThere + charFour,
                phone: this.phone.trim()
            }
            this.props.confirmOTP(filter); // set status for user = 1
        } else {
            this.showMessage(localizes('otp.valiCode'));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData();
        }
    }

    handleData() {
        const { statusSend } = this.state;
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.SEND_OTP)) {
                    if (!Utils.isNull(data)) {
                        this.setState({
                            statusSend: true,
                            timeCountDown: this.auThenTime,
                        });
                    } else {
                        this.showMessage(localizes('otp.errorSendCode'))
                        this.setState({
                            statusSend: false
                        })
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.CONFIRM_OTP)) {
                    if (!Utils.isNull(data)) {
                        if (data == otpType.REGISTER) {
                            StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
                                this.showMessage(localizes('otp.succesOTP'));
                                if (!Utils.isNull(user)) {
                                    user.status = statusType.ACTIVE;
                                    StorageUtil.storeItem(StorageUtil.USER_PROFILE, user);
                                    //Save token login
                                    StorageUtil.storeItem(StorageUtil.USER_TOKEN, user.token);
                                    StorageUtil.storeItem(StorageUtil.FIREBASE_TOKEN, user.firebaseToken);
                                    global.token = user.token;
                                    global.firebaseToken = user.firebaseToken;
                                    this.props.notifyLoginSuccess();
                                    this.goHomeScreen();
                                    // refresh token:                
                                    this.refreshToken();
                                }
                            }).catch((error) => {
                                this.saveException(error, 'handleData')
                            });

                        } else if (data == otpType.FORGOT_PASS) {
                            this.props.navigation.pop();
                            this.props.navigation.navigate("ConfirmPassword", {
                                'phone': this.phone,
                                'onBack': this.onBack
                            })
                        }
                    } else {
                        this.showMessage(localizes('otp.errOTP'));
                    }
                } else {
                    this.handleError(this.props.errorCode, this.props.error)
                }
            }
        }
    }

    componentDidMount() {
        super.componentDidMount();
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
        this.sendOTP();
        this._interval = setInterval(() => {
            if (this.state.timeCountDown > 0) {
                this.setState({
                    timeCountDown: this.state.timeCountDown - 1
                })
            } else {
                this.setState({
                    statusSend: false
                })
            }
        }, 1000);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
        clearInterval(this._interval);
    }

    render() {
        const { statusSend, timeCountDown, charOne, charTwo, charThere, charFour } = this.state;
        return (
            <Container style={styles.container}>
                <ImageBackground source={MaskGroupLogin} style={{ width: '100%', height: '100%' }}>
                    <Root>
                        <Header noShadow style={[commonStyles.header, { backgroundColor: Colors.COLOR_TRANSPARENT }]}>
                            {this.renderHeaderView({
                                visibleStage: false,
                                title: "",
                                icBackMenu: ic_back_black,
                                renderRightMenu: this.renderRightHeader
                            })}
                        </Header>
                        <Content showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                            <View style={[commonStyles.viewCenter, { flex: 1 }]}>
                                {/* {Input form} */}
                                <CardViewCustom
                                    title={localizes("otp.title")}
                                    viewChild={
                                        <Form style={{ padding: Constants.PADDING_X_LARGE }}>
                                            <Text style={[commonStyles.text, {
                                                fontSize: Fonts.FONT_SIZE_X_MEDIUM - 2,
                                                textAlign: "center",
                                                marginTop: Constants.MARGIN_X_LARGE
                                            }]}>
                                                Mã số xác thực vừa được gửi đến
                                        </Text>
                                            <Text style={[commonStyles.textBold, {
                                                fontSize: Fonts.FONT_SIZE_LARGE,
                                                textAlign: "center",
                                                marginBottom: Constants.MARGIN_X_LARGE
                                            }]}>
                                                {this.phone}
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <TextInput style={[commonStyles.textBold, commonStyles.inputText, styles.styleInput]}
                                                    onChangeText={charOne => { this.setState({ charOne }, () => charOne ? this.charTwo.focus() : null) }}
                                                    keyboardType="numeric"
                                                    onSubmitEditing={() => {
                                                    }}
                                                    value={charOne}
                                                    underlineColorAndroid='transparent'
                                                    maxLength={1}
                                                    autoFocus={true}
                                                    ref={ref => this.charOne = ref}
                                                />
                                                <TextInput style={[commonStyles.textBold, commonStyles.inputText, styles.styleInput]}
                                                    onChangeText={charTwo => { this.setState({ charTwo }, () => charTwo ? this.charThere.focus() : null) }}
                                                    keyboardType="numeric"
                                                    onSubmitEditing={() => {
                                                        this.charThere.focus();
                                                    }}
                                                    value={charTwo}
                                                    underlineColorAndroid='transparent'
                                                    maxLength={1}
                                                    onKeyPress={(event) => {
                                                        event.nativeEvent.key == "Backspace"
                                                            ? charTwo ? null : this.setState({ charOne: "" }, () => this.charOne.focus())
                                                            : null
                                                    }

                                                    }
                                                    ref={ref => this.charTwo = ref}
                                                />
                                                <TextInput style={[commonStyles.textBold, commonStyles.inputText, styles.styleInput]}
                                                    onChangeText={charThere => { this.setState({ charThere }, () => charThere ? this.charFour.focus() : null) }}
                                                    keyboardType="numeric"
                                                    onSubmitEditing={() => {
                                                        this.charFour.focus();
                                                    }}
                                                    value={charThere}
                                                    underlineColorAndroid='transparent'
                                                    maxLength={1}
                                                    onKeyPress={(event) =>
                                                        event.nativeEvent.key == "Backspace"
                                                            ? charThere ? null : this.setState({ charTwo: "" }, () => this.charTwo.focus())
                                                            : null
                                                    }
                                                    ref={ref => this.charThere = ref}
                                                />
                                                <TextInput style={[commonStyles.textBold, commonStyles.inputText, styles.styleInput]}
                                                    onChangeText={charFour => { this.setState({ charFour }, () => charFour ? null : null) }}
                                                    keyboardType="numeric"
                                                    value={charFour}
                                                    underlineColorAndroid='transparent'
                                                    maxLength={1}
                                                    onKeyPress={(event) =>
                                                        event.nativeEvent.key == "Backspace"
                                                            ? charFour ? null : this.setState({ charThere: "" }, () => this.charThere.focus())
                                                            : null
                                                    }
                                                    ref={ref => this.charFour = ref}
                                                />
                                            </View>
                                            <View style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: Constants.MARGIN_LARGE
                                            }}>
                                                <TouchableOpacity
                                                    activeOpacity={Constants.ACTIVE_OPACITY}
                                                    disabled={timeCountDown != 0 ? true : false}
                                                    onPress={() => this.sendOTP()}>
                                                    <Text style={[commonStyles.text, {
                                                        fontSize: Fonts.FONT_SIZE_X_MEDIUM - 2
                                                    }]}>
                                                        {timeCountDown != 0 ? localizes('otp.auThenTime') : localizes('otp.notReceived')}
                                                        <Text style={[commonStyles.textBold, {
                                                            fontSize: Fonts.FONT_SIZE_X_MEDIUM - 2
                                                        }]}>
                                                            {timeCountDown != 0
                                                                ? DateUtil.parseMillisecondToTime(this.state.timeCountDown * 1000)
                                                                : localizes('otp.resendOTP')}
                                                        </Text>
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Form>
                                    }
                                />
                                <View style={[{ flexDirection: 'row', marginHorizontal: Constants.MARGIN_X_LARGE, marginTop: Constants.MARGIN_XX_LARGE }]}>
                                    {
                                        this.renderCommonButton(
                                            localizes('otp.btnConfirm'),
                                            { color: Colors.COLOR_WHITE },
                                            {
                                                flex: 1,
                                                marginTop: Constants.MARGIN_X_LARGE,
                                                paddingHorizontal: Constants.PADDING_X_LARGE
                                            },
                                            () => { this.onActionOTP() }
                                        )
                                    }
                                </View>
                            </View>
                        </Content>
                        {this.showLoadingBar(this.props.isLoading)}
                    </Root>
                </ImageBackground>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    data: state.otp.data,
    action: state.otp.action,
    isLoading: state.otp.isLoading,
    error: state.otp.error,
    errorCode: state.otp.errorCode
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, actions)(OTPView);