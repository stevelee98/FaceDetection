'use strict';
import React, { Component } from 'react';
import { View, TextInput, Image, StyleSheet, Text, ImageBackground, Keyboard, ToastAndroid, TouchableOpacity, BackHandler, Platform } from 'react-native';
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
import { Icon } from 'react-native-elements';
import ic_avatar_small_red from 'images/ic_avatar_small_red.png'
import ic_back_white from 'images/ic_back_white.png'
import ic_back_black from 'images/ic_back_black.png'
import Utils from 'utils/utils'
import * as actions from 'actions/userActions';
import { connect } from 'react-redux';
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import StorageUtil from 'utils/storageUtil';
import screenType from 'enum/screenType';
import TextInputCustom from 'components/textInputCustom';
import OTPType from 'enum/otpType';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import img_logo from 'images/img_logo.png';
import LinearGradient from "react-native-linear-gradient";
import BackgroundCustom from 'components/backgroundCustom';
import CardViewCustom from 'components/cardViewCustom';
import DialogCustom from 'components/dialogCustom';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MaskGroupLogin from 'images/MaskGroupLogin.png';

class ForgotPasswordView extends BaseView {

    constructor(props) {
        super(props);
        const { userSocial } = this.props.navigation.state.params;
        this.state = {
            emailOrPhone: '',
            isAlertSuccess: false,
            faultPhone: false,
        }
        this.userSocial = userSocial;
        this.isPhone = false;
        this.isEmail = false;
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
    }

    // Forget password
    onForgotPass = () => {
        var { emailOrPhone } = this.state;
        const res = emailOrPhone.trim().charAt(0);
        //this.isPhone = new RegExp(res).test("0123456789");
        this.isEmail = res != '0';
        this.isPhone = !this.isEmail;
        if (Utils.isNull(emailOrPhone)) {
            this.showMessage(localizes("forgot_password.input_phone"))
            this.emailOrPhone.focus()
            this.setState({
                faultPhone: true,
            })
        } else if (this.isPhone && (emailOrPhone.trim().length != 10 || res != '0')) {
            this.showMessage(localizes("register.errorPhone"))
            this.emailOrPhone.focus()
            this.setState({
                faultPhone: true,
            })
        } else if (this.isPhone && !Utils.validatePhone(emailOrPhone.trim())) {
            this.showMessage(localizes("register.errorPhone"))
            this.emailOrPhone.focus()
            this.setState({
                faultPhone: true,
            })
        } else if (this.isEmail && !Utils.validateEmail(emailOrPhone.trim())) {
            this.showMessage(localizes("register.errorPhone"))
            this.emailOrPhone.focus()
            this.setState({
                faultPhone: true,
            })
        } else {
            let email = ""; // this.isEmail ? emailOrPhone : "";
            let phone = this.isPhone ? emailOrPhone.trim() : "";
            if (Utils.isNull(this.userSocial)) {
                this.props.forgetPass(email, phone);
            } else {
                this.props.updatePhoneNumber(this.userSocial.id, phone);
            }
        }
    }

    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.FORGET_PASS)
                    || this.props.action == getActionSuccess(ActionEvent.UPDATE_PHONE_NUMBER)) {
                    if (data == true) {
                        if (this.isPhone) {
                            this.props.navigation.pop();
                            this.props.navigation.navigate('OTP', {
                                'phone': this.state.emailOrPhone,
                                'otpType': Utils.isNull(this.userSocial)
                                    ? OTPType.FORGOT_PASS
                                    : OTPType.REGISTER,
                                'userSocial': this.userSocial
                            })
                        } else if (this.isEmail) {
                            this.setState({ isAlertSuccess: true });
                        }
                    } else {
                        this.showMessage(localizes('forgot_password.existsPhone'))
                        this.setState({
                            faultPhone: true,
                        })
                    }
                }
            } else if (this.props.errorCode == ErrorCode.INVALID_ACCOUNT) {
                this.setState({
                    faultPhone: true,
                })
                if (this.props.action == getActionSuccess(ActionEvent.FORGET_PASS)) {
                    this.showMessage(localizes('forgot_password.phoneNotExist'))
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData();
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    render() {
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
                                    title={Utils.isNull(this.userSocial)
                                        ? localizes("forgot_password.titleForgotPassword")
                                        : localizes("forgot_password.update_phone_number")}
                                    viewChild={
                                        <Form style={{ padding: Constants.PADDING_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }}>
                                            <Text style={[commonStyles.text, {
                                                textAlign: "center",
                                                marginVertical: Constants.MARGIN_X_LARGE
                                            }]}>
                                                {Utils.isNull(this.userSocial)
                                                    ? "Nhập số điện thoại bạn đã dùng để đăng ký tài khoản"
                                                    : "Nhập số điện thoại của bạn"
                                                }
                                            </Text>
                                            <TextInputCustom
                                                refInput={ref => this.emailOrPhone = ref}
                                                styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                                isInputAction={true}
                                                placeholder={"Số điện thoại"}
                                                fault={this.state.faultPhone}
                                                onChangeText={
                                                    emailOrPhone => {
                                                        this.setState({
                                                            emailOrPhone: emailOrPhone,
                                                            faultPhone: false
                                                        })
                                                    }
                                                }
                                                title={"Số điện thoại"}
                                                keyboardType="phone-pad"
                                                value={this.state.emailOrPhone}
                                                returnKeyType={"done"}
                                                onSubmitEditing={() => {
                                                    Keyboard.dismiss()
                                                }}
                                            />
                                        </Form>
                                    }
                                />
                                {/* button confirm */}
                                <View style={[{ flexDirection: 'row', marginHorizontal: Constants.MARGIN_X_LARGE, marginTop: Constants.MARGIN_XX_LARGE }]}>
                                    {
                                        this.renderCommonButton(
                                            localizes('forgot_password.btnConfirm'),
                                            { color: Colors.COLOR_WHITE },
                                            {
                                                flex: 1,
                                                marginTop: Constants.MARGIN_X_LARGE,
                                                paddingHorizontal: Constants.PADDING_X_LARGE
                                            },
                                            () => { this.onForgotPass() }
                                        )
                                    }
                                </View>
                                {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}
                            </View>
                        </Content>
                        {this.showLoadingBar(this.props.isLoading)}
                        {this.renderAlertSuccess()}
                    </Root>
                </ImageBackground>
            </Container>
        )
    }

    /**
     * Render alert add address success
     */
    renderAlertSuccess() {
        return (
            <DialogCustom
                visible={this.state.isAlertSuccess}
                isVisibleTitle={true}
                isVisibleOneButton={true}
                isVisibleContentText={true}
                contentTitle={"Thông báo"}
                textBtn={"Ok"}
                contentText={"Mật khẩu mới đã được gửi vào email của bạn, vui lòng kiểm tra và đăng nhập lại!"}
                onPressBtn={() => {
                    this.setState({ isAlertSuccess: false });
                    this.onBack();
                }}
            />
        )
    }
}

const mapStateToProps = state => ({
    data: state.forgetPass.data,
    action: state.forgetPass.action,
    isLoading: state.forgetPass.isLoading,
    error: state.forgetPass.error,
    errorCode: state.forgetPass.errorCode
});
export default connect(mapStateToProps, actions)(ForgotPasswordView);