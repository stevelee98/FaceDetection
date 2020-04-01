'use strict';
import React, { Component } from 'react';
import { View, TextInput, Image, StyleSheet, Text, ImageBackground, TouchableOpacity, TouchableHighlight, Keyboard, ScrollView } from 'react-native';
import { Container, Form, Content, Item, Input, Button, Right, Icon, Header, Root, Left, Body, Title, Toast } from 'native-base';
import ButtonComp from 'components/button';
import StringUtil from 'utils/stringUtil';
import cover from 'images/bg_launch.png';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import * as actions from 'actions/userActions';
import { connect } from 'react-redux';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import ic_facebook_blue from 'images/ic_facebook_blue.png'
import ic_google_red from 'images/ic_google_red.png'
import ic_lock_white from 'images/ic_lock_white.png'
import ic_unlock_white from 'images/ic_unlock_white.png'
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import ic_avatar_small_red from 'images/ic_avatar_small_red.png'
import ic_back_white from 'images/ic_back_white.png'
import { ErrorCode } from 'config/errorCode';
import Utils from 'utils/utils';
import StorageUtil from 'utils/storageUtil';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { NavigationActions } from 'react-navigation'
import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import GenderType from 'enum/genderType';
import { StackActions } from 'react-navigation';
import ic_facebook from 'images/ic_facebook.png'
import ic_google_plus from 'images/ic_google_plus.png'
import statusType from 'enum/statusType';
import screenType from 'enum/screenType';
import TextInputCustom from 'components/textInputCustom';
import ic_password_green from 'images/ic_password_green.png';
import ic_eye_slash_black from 'images/ic_eye_slash_black.png';
import ic_eye_black from 'images/ic_eye_black.png';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import MaskGroupLogin from 'images/MaskGroupLogin.png';
import CardViewCustom from 'components/cardViewCustom';
import ic_back_black from 'images/ic_back_black.png'

class ConfirmPasswordView extends BaseView {

    constructor() {
        super();
        this.state = {
            hideNewPassword: true,
            hideRetypePassword: true,
            newPass: "",
            retypePass: "",
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
      * Handle data when request
      */
    handleData() {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS && data == true) {
                if (this.props.action == getActionSuccess(ActionEvent.CHANGE_PASS)) {
                    if (data) {
                        this.showMessage(localizes("setting.change_pass_success"));
                        this.props.navigation.goBack()
                        this.props.navigation.navigate('Login')
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    // On press change password
    onPressUpdatePass = () => {
        let { newPass, retypePass } = this.state;
        const { phone } = this.props.navigation.state.params
        if (newPass == "") {
            this.showMessage(localizes('confirmPassword.enterNewPass'))
            this.newPass.focus()
            return false
        } else if (newPass.length < 6 || newPass.length > 20) {
            this.showMessage(localizes("confirmPassword.vali_character_password"))
            this.newPass.focus()
            return false
        } else if (!Utils.validateContainUpperPassword(newPass)) {
            this.showMessage(localizes("register.vali_character_password"));
            this.newPass.focus();
            return false
        } else if (Utils.validateSpacesPass(newPass)) {
            this.showMessage(localizes("register.vali_pass_space"));
            this.newPass.focus();
            return false
        } else if (retypePass == "") {
            this.showMessage(localizes('confirmPassword.vali_fill_repeat_password'))
            this.retypePass.focus()
            return false
        } else if (newPass !== retypePass) {
            this.showMessage(localizes('confirmPassword.vali_confirm_password'))
            this.retypePass.focus()
            return false
        } else {
            this.props.changePass("", newPass, phone, screenType.FROM_FORGET_PASSWORD);
            return true
        }
    }

    render() {
        return (
            <Container style={styles.container}>
            <ImageBackground source={MaskGroupLogin} style={{width: '100%', height: '100%'}}>
                <Root>
                    <Header noShadow style={[commonStyles.header, { backgroundColor: Colors.COLOR_TRANSPARENT }]}>
                        {this.renderHeaderView({
                            visibleStage: false,
                            title: "",
                            icBackMenu: ic_back_black,
                            renderRightMenu: this.renderRightHeader
                        })}
                    </Header>
                    <Content contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                        <View style={[commonStyles.viewCenter, { flex: 1 }]}>
                            {/* {Input form} */}
                            <CardViewCustom
                                title={localizes("forgot_password.titleConfirmPassword")}
                                viewChild={
                                    <Form style={{ padding: Constants.PADDING_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }}>
                                        <View style={{ justifyContent: 'center', position: 'relative' }}>
                                            <TextInputCustom
                                                title={"Mật khẩu mới"}
                                                refInput={ref => this.newPass = ref}
                                                isInputAction={true}
                                                styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                                placeholder={localizes('forgot_password.input_newPass')}
                                                value={this.state.newPass}
                                                secureTextEntry={this.state.hideNewPassword}
                                                onChangeText={(newPass) => {
                                                    this.setState({
                                                        newPass
                                                    })
                                                }}
                                                onSelectionChange={({ nativeEvent: { selection } }) => {
                                                    console.log(this.className, selection)
                                                }}
                                                returnKeyType={"next"}
                                                onSubmitEditing={() => {
                                                    this.retypePass.focus()
                                                }}
                                                inputNormalStyle={[{
                                                    paddingRight: Constants.PADDING_LARGE * 5
                                                }]}
                                                isAsterisk={true}
                                            />
                                            <TouchableHighlight
                                                onPress={() => {
                                                    this.setState({ hideNewPassword: !this.state.hideNewPassword })
                                                }}
                                                style={[commonStyles.shadowOffset, {
                                                    position: 'absolute', right: Constants.PADDING_LARGE
                                                }]}
                                                underlayColor='transparent'
                                            >
                                                <Image style={{ resizeMode: 'contain', opacity: Constants.SHADOW_OPACITY_BUTTON }}
                                                    source={(this.state.hideNewPassword) ? ic_eye_slash_black : ic_eye_black} />
                                            </TouchableHighlight>
                                        </View>
                                        {/* Confirm password */}
                                        <View style={{ justifyContent: 'center', position: 'relative' }}>
                                            <TextInputCustom
                                                title={"Nhập lại mật khẩu mới"}
                                                refInput={ref => this.retypePass = ref}
                                                isInputAction={true}
                                                styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                                placeholder={"Nhập lại mật khẩu mới"}
                                                value={this.state.retypePass}
                                                secureTextEntry={this.state.hideRetypePassword}
                                                onChangeText={(retypePass) => {
                                                    this.setState({
                                                        retypePass
                                                    })
                                                }}
                                                onSelectionChange={({ nativeEvent: { selection } }) => {
                                                    console.log(this.className, selection)
                                                }}
                                                returnKeyType={"done"}
                                                onSubmitEditing={() => {
                                                    Keyboard.dismiss()
                                                }}
                                                inputNormalStyle={[{
                                                    paddingRight: Constants.PADDING_LARGE * 5
                                                }]}
                                                isAsterisk={true}
                                            />
                                            <TouchableHighlight
                                                onPress={() => {
                                                    this.setState({ hideRetypePassword: !this.state.hideRetypePassword })
                                                }}
                                                style={[commonStyles.shadowOffset, {
                                                    position: 'absolute', right: Constants.PADDING_LARGE
                                                }]}
                                                underlayColor='transparent'
                                            >
                                                <Image style={{ resizeMode: 'contain', opacity: Constants.SHADOW_OPACITY_BUTTON }}
                                                    source={(this.state.hideRetypePassword) ? ic_eye_slash_black : ic_eye_black} />
                                            </TouchableHighlight>
                                        </View>
                                        
                                    </Form>
                                }
                            />
                            <View style={[{flexDirection: 'row', marginHorizontal: Constants.MARGIN_X_LARGE, marginTop: Constants.MARGIN_XX_LARGE }]}>
                            {
                                this.renderCommonButton(
                                    localizes('forgot_password.btnChangePass'),
                                    { color: Colors.COLOR_WHITE },
                                    {   flex: 1,
                                        marginTop: Constants.MARGIN_X_LARGE,
                                        paddingHorizontal: Constants.PADDING_X_LARGE 
                                    },
                                    () => { this.onPressUpdatePass() }
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
    data: state.changePass.data,
    action: state.changePass.action,
    isLoading: state.changePass.isLoading,
    error: state.changePass.error,
    errorCode: state.changePass.errorCode
});

export default connect(mapStateToProps, actions)(ConfirmPasswordView);
