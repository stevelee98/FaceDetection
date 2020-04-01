import React, { Component } from "react";
import {
    ImageBackground, View, StatusBar,
    Image, TouchableWithoutFeedback,
    BackHandler, Alert, Linking,
    RefreshControl, StyleSheet, Slider,
    TextInput, Dimensions, FlatList,
    TouchableHighlight, TouchableOpacity,
    ScrollView,
    Keyboard, Platform
} from "react-native";
import {
    Container, Header, Title, Left, Icon, Right,
    Button, Body, Content, Text, Card, CardItem, Form
} from "native-base";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import ic_back_model from 'images/ic_back_model.png';
import ic_next_white from 'images/ic_next_white.png';
import commonStyles from "styles/commonStyles";
import BaseView from "containers/base/baseView"
import TextInputCustom from "components/textInputCustom";
import ModalDropdown from 'components/dropdown';
import I18n, { localizes } from "locales/i18n";
import StringUtil from "utils/stringUtil";
import { Fonts } from "values/fonts";
import { months } from "moment";
import FlatListCustom from "components/flatListCustom";
import Modal from 'react-native-modalbox';
import moment from 'moment';
import DateUtil from "utils/dateUtil";
import CardViewCustom from "components/cardViewCustom";
import ic_eye_slash_black from 'images/ic_eye_slash_black.png';
import ic_eye_black from 'images/ic_eye_black.png';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const screen = Dimensions.get("window");

export default class ModalChangePass extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            oldPass: '',
            newPass: '',
            confirmPass: '',
            hideOldPassword: true,
            hideNewPassword: true,
            hideNewPasswordConfirm: true
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
    }

    componentWillMount = () => {
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
    handleData() { }

    /**
     * Show Modal Week
     */
    showModal() {
        this.setState({})
        this.refs.modalChangePass.open();
    }

    /**
     * hide Modal Week
     */
    hideModal() {
        this.refs.modalChangePass.close();
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentWillUnmount = () => {
    }

    render() {
        const { oldPass, newPass, confirmPass } = this.state;
        return (
            <Modal
                ref={"modalChangePass"}
                style={{
                    backgroundColor: "#00000000",
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                backdrop={true}
                onClosed={() => {
                    this.hideModal()
                }}
                backButtonClose={true}
                swipeToClose={false}
            >
                <CardViewCustom
                    style={{}}
                    title={"Đổi mật khẩu"}
                    viewChild={
                        <Form style={{ padding: Constants.PADDING_X_LARGE }}>
                            <View style={{ justifyContent: 'center', position: 'relative' }}>
                                <TextInputCustom
                                    styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                    refInput={ref => (this.password = ref)}
                                    isInputNormal={true}
                                    placeholder={"Nhập mật khẩu cũ"}
                                    value={this.state.oldPass}
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={this.state.hideOldPassword}
                                    onChangeText={(text) => {
                                        this.setState({
                                            oldPass: text
                                        })
                                    }}
                                    onSubmitEditing={() => {
                                        this.newPassword.focus();
                                    }}
                                    returnKeyType={"next"}
                                    inputNormalStyle={{
                                        paddingRight: Constants.PADDING_LARGE * 5
                                    }}
                                />
                                <TouchableHighlight
                                    onPress={this.manageOldPasswordVisibility}
                                    style={[commonStyles.shadowOffset, {
                                        position: 'absolute', right: Constants.PADDING_LARGE * 4
                                    }]}
                                    underlayColor='transparent'
                                >
                                    <Image style={{ resizeMode: 'contain' }}
                                        source={(this.state.hideOldPassword) ? ic_eye_slash_black : ic_eye_black} />
                                </TouchableHighlight>
                            </View>
                            {/* New password */}
                            <View style={{ justifyContent: 'center', position: 'relative' }}>
                                <TextInputCustom
                                    styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                    refInput={ref => this.newPassword = ref}
                                    isInputNormal={true}
                                    placeholder={"Nhập mật khẩu mới"}
                                    value={this.state.newPass}
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={this.state.hideNewPassword}
                                    onChangeText={
                                        (text) => {
                                            this.setState({
                                                newPass: text
                                            })
                                        }
                                    }
                                    onSubmitEditing={() => {
                                        this.confirmPassword.focus();
                                    }}
                                    returnKeyType={"next"}
                                    inputNormalStyle={{
                                        paddingRight: Constants.PADDING_LARGE * 5
                                    }}
                                />
                                <TouchableHighlight
                                    onPress={this.manageNewPasswordVisibility}
                                    style={[commonStyles.shadowOffset, {
                                        position: 'absolute', right: Constants.PADDING_LARGE * 4
                                    }]}
                                    underlayColor='transparent'
                                >
                                    <Image style={{ resizeMode: 'contain' }}
                                        source={(this.state.hideNewPassword) ? ic_eye_slash_black : ic_eye_black} />
                                </TouchableHighlight>
                            </View>
                            {/* Confirm new password */}
                            <View style={{ justifyContent: 'center', position: 'relative' }}>
                                <TextInputCustom
                                    refInput={ref => this.confirmPassword = ref}
                                    isInputNormal={true}
                                    styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                    placeholder={"Nhập lại mật khẩu mới"}
                                    value={this.state.confirmPass}
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={this.state.hideNewPasswordConfirm}
                                    onChangeText={
                                        (text) => {
                                            this.setState({
                                                confirmPass: text
                                            })
                                        }
                                    }
                                    returnKeyType={"done"}
                                    inputNormalStyle={{
                                        paddingRight: Constants.PADDING_LARGE * 5
                                    }}
                                />
                                <TouchableHighlight
                                    onPress={this.manageNewPasswordConfirmVisibility}
                                    style={[commonStyles.shadowOffset, {
                                        position: 'absolute', right: Constants.PADDING_LARGE * 4
                                    }]}
                                    underlayColor='transparent'
                                >
                                    <Image style={{ resizeMode: 'contain' }}
                                        source={(this.state.hideNewPasswordConfirm) ? ic_eye_slash_black : ic_eye_black} />
                                </TouchableHighlight>
                            </View>
                            <View style={[commonStyles.viewCenter, { flexDirection: 'row', marginTop: Constants.MARGIN_LARGE }]}>
                                {
                                    this.renderCommonButton(
                                        "Thay đổi",
                                        {
                                            color: Colors.COLOR_WHITE
                                        },
                                        { alignSelf: 'stretch', marginRight: Constants.MARGIN_LARGE },
                                        () => this.onPressCommonButton(),
                                        null,
                                        false,
                                        { width: "45%" }
                                    )
                                }
                                {
                                    this.renderCommonButton(
                                        "Hủy",
                                        {
                                            color: Colors.COLOR_TEXT,
                                            margin: 3
                                        },
                                        {
                                            alignSelf: 'stretch',
                                            backgroundColor: Colors.COLOR_WHITE,
                                            borderWidth: Constants.BORDER_WIDTH,
                                            borderColor: Colors.COLOR_TEXT,
                                            marginLeft: Constants.MARGIN_LARGE
                                        },
                                        () => this.hideModal(),
                                        null,
                                        false,
                                        { width: "45%" }
                                    )
                                }
                            </View>
                        </Form>
                    }
                />
                {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}
            </Modal>
        );
    }

    // Hide & show old password
    manageOldPasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.oldPass
        this.setState({
            hideOldPassword: !this.state.hideOldPassword,
            oldPass: ""
        });
        setTimeout(() => {
            this.setState({
                oldPass: last
            })
        }, 0)
    }

    // Hide & show new password
    manageNewPasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.newPass
        this.setState({
            hideNewPassword: !this.state.hideNewPassword,
            newPass: ""
        });
        setTimeout(() => {
            this.setState({
                newPass: last
            })
        }, 0)
    }

    // Hide & show confirm new password
    manageNewPasswordConfirmVisibility = () => {
        let last = this.state.confirmPass
        this.setState({
            hideNewPasswordConfirm: !this.state.hideNewPasswordConfirm,
            confirmPass: ""
        });
        setTimeout(() => {
            this.setState({
                confirmPass: last
            })
        }, 0)
    }

    // On press change password
    onPressCommonButton = () => {
        let {
            oldPass,
            newPass,
            confirmPass
        } = this.state;
        if (oldPass.length == 0) {
            this.showMessage(localizes('setting.enterOldPass'))
            this.password.focus()
            return false
        } else if (newPass.length == 0) {
            this.showMessage(localizes('setting.enterNewPass'))
            this.newPassword.focus()
            return false
        } else if (newPass.length < 6 || newPass.length > 20) {
            this.showMessage(localizes("confirmPassword.vali_character_password"))
            this.newPassword.focus()
        } else if (confirmPass.length == 0) {
            this.showMessage(localizes('setting.enterConfPass'))
            this.confirmPassword.focus()
            return false
        } else if (newPass !== confirmPass) {
            this.showMessage(localizes('register.vali_confirm_password'))
            this.confirmPassword.focus()
            return false
        } else {
            this.props.onChangePassWord(oldPass, newPass);
            return true;
        }
    }
}