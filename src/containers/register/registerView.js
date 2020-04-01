'use strict';
import React, { Component } from 'react';
import {
    Dimensions, View, TextInput, Image, StyleSheet, Text, PixelRatio, ImageBackground, Platform,
    TouchableHighlight, TouchableOpacity, Keyboard, ToastAndroid, ScrollView, Modal, BackHandler
} from 'react-native';
import { Container, Form, Content, Input, Button, Right, Radio, center, ListItem, Left, Header, Item, Picker, Body, Root } from 'native-base';
import ButtonComp from 'components/button';
import { capitalizeFirstLetter } from 'utils/stringUtil';
import cover from 'images/bg_launch.png';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import I18n from 'react-native-i18n';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { CheckBox } from 'react-native-elements'
import { Constants } from 'values/constants'
import { Icon } from 'react-native-elements';
import index from '../../reducers';
import ic_down_black from 'images/ic_down_black.png';
import Utils from 'utils/utils'
import ic_avatar_small_red from 'images/ic_avatar_small_red.png'
import ic_back_white from 'images/ic_back_white.png'
import ic_back_black from 'images/ic_back_black.png'
import ic_lock_white from 'images/ic_lock_white.png'
import ic_unlock_white from 'images/ic_unlock_white.png'
import ic_check_box_white from 'images/ic_check_box_white.png'
import ic_uncheck_box_white from 'images/ic_uncheck_box_white.png'
import ModalDropdown from 'components/modalDropdown'
import Autocomplete from 'components/autocomplete';
import { connect } from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import { ErrorCode } from 'config/errorCode';
import { getActionSuccess, ActionEvent } from 'actions/actionEvent';
import * as actions from 'actions/userActions'
import GenderType from 'enum/genderType';
import StringUtil from 'utils/stringUtil';
import ImagePicker from 'react-native-image-crop-picker'
import roleType from 'enum/roleType'
import screenLincareType from 'enum/screenLincareType';
import userType from 'enum/userType';
import statusType from 'enum/statusType';
import DateUtil from 'utils/dateUtil';
import { CalendarScreen } from 'components/calendarScreen';
import TextInputCustom from 'components/textInputCustom';
import moment from 'moment';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import ic_phone_receiver_green from 'images/ic_phone_receiver_green.png';
import ic_eye_slash_black from 'images/ic_eye_slash_black.png';
import ic_eye_black from 'images/ic_eye_black.png';
import img_logo from 'images/img_logo.png';
import LinearGradient from "react-native-linear-gradient";
import BackgroundCustom from 'components/backgroundCustom';
import CardViewCustom from 'components/cardViewCustom';
import otpType from 'enum/otpType';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MaskGroupRegister from 'images/MaskGroupRegister.png';
import screenType from 'enum/screenType';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const MARGIN_BETWEEN_ITEM = 0

class RegisterView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            repeatPassword: '',
            images: null,
            image: null,
            path: '',
            pickerSelection: 'Default',
            pickerDisplayed: false,
            hidePassword: true,
            hidePasswordConfirm: true,
            enableScrollViewScroll: true,
            faultPhone: false,
            faultPass: false,
            faultConfirmPass: false,
        };
        this.today = DateUtil.now();
        this.selectedType = null;
        this.isFirstTime = true;
        this.hidePassword = true;
        this.hidePasswordConfirm = true;
        this.staffs = [];
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
        this.props.getStaffs();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    managePasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.password
        this.setState({ hidePassword: !this.state.hidePassword, password: "" });
        setTimeout(() => {
            this.setState({ password: last })
        }, 0)
    }

    managePasswordConfirmVisibility = () => {
        // function used to change password visibility
        let last = this.state.repeatPassword
        this.setState({ hidePasswordConfirm: !this.state.hidePasswordConfirm, repeatPassword: "" });
        setTimeout(() => {
            this.setState({ repeatPassword: last })
        }, 0)
    }

    /**
     * Validate and sign up
     */
    validateAndSignUp() {
        const { password, email, phone, repeatPassword } = this.state;
        let type = []
        let certificatePath = []
        if (this.state.images != null) {
            for (let i = 0; i < this.state.images.length; i++) {
                certificatePath.push(this.state.images[i].uri)
            }
        }
        //type.push(this.selectedType);
        const res = phone.trim().charAt(0);
        if (Utils.isNull(phone.trim())) {
            this.showMessage(localizes("register.vali_fill_phone"))
            this.setState({
                faultPhone: true,
            })
            this.phone.focus()
        } else if (!Utils.validatePhone(phone.trim()) || phone.trim().length != 10 || res != '0') {
            this.showMessage(localizes("register.errorPhone"))
            this.phone.focus()
            this.setState({
                faultPhone: true,
            })
        } else if (Utils.isNull(password)) {
            this.showMessage(localizes("register.vali_fill_password"))
            this.password.focus()
            this.setState({
                faultPass: true,
            })
        } else if (password.length < 6 || password.length > 20) {
            this.showMessage(localizes("register.vali_character_password"))
            this.password.focus()
            this.setState({
                faultPass: true,
            })
        } else if (!Utils.validateContainUpperPassword(password)) {
            this.showMessage(localizes("register.vali_character_password"));
            this.password.focus();
            this.setState({
                faultPass: true,
            })
        } else if (Utils.validateSpacesPass(password)) {
            this.showMessage(localizes("register.vali_pass_space"));
            this.password.focus();
            this.setState({
                faultPass: true,
            })
        } else if (Utils.isNull(repeatPassword)) {
            this.showMessage(localizes("register.vali_fill_repeat_password"))
            this.confirmPassword.focus()
            this.setState({
                faultConfirmPass: true,
            })
        } else if (password != repeatPassword) {
            this.showMessage(localizes("register.vali_confirm_password"))
            this.confirmPassword.focus()
            this.setState({
                faultConfirmPass: true,
            })
        } else {
            let signUpData = {
                phone: this.state.phone.trim(),
                status: statusType.ACTIVE,
                password: this.state.password.trim()
            }
            this.props.signUp(signUpData)
        }
        //this._container.scrollTo({ x: 0, y: 0, animated: true })
    }

    focusInput(text) {
        if (this.isFirstTime)
            return true
        return text !== ''
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.SIGN_UP)) {
                    if (!Utils.isNull(data)) {
                        StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
                        if (data.status == statusType.ACTIVE && data.userType != userType.INTERNAL_USERS) {
                            this.showMessage(localizes("register.register_success"));
                            StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
                            //Save token login
                            StorageUtil.storeItem(StorageUtil.USER_TOKEN, data.token);
                            StorageUtil.storeItem(StorageUtil.FIREBASE_TOKEN, data.firebaseToken);
                            global.token = data.token;
                            global.firebaseToken = data.firebaseToken;
                            this.props.notifyLoginSuccess();
                            this.goHomeScreen() //Register successfully => Main
                            this.refreshToken();
                        } else if (data.status == statusType.DRAFT || data.status == statusType.ACTIVE && data.userType == userType.INTERNAL_USERS) {
                            //this.props.navigation.pop();
                            this.props.navigation.navigate("OTP", {
                                'phone': this.state.phone,
                                'otpType': otpType.REGISTER
                            });
                        }
                    }
                }
            } else if (this.props.errorCode == ErrorCode.USER_EXIST_TRY_LOGIN_FAIL) {
                this.showMessage(localizes('register.existMobile'))
                this.showFault()
            } else if (this.props.errorCode == ErrorCode.EMAIL_EXIST_TRY_LOGIN_FAIL) {
                this.showMessage(localizes('register.existEmail'))
                this.showFault()
            } else {
                this.handleError(this.props.errorCode, this.props.error)
                this.showFault()
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    showFault = () => {
        this.state.faultPhone = true;
        this.state.faultPass = true;
        this.state.faultConfirmPass = true;
    }

    render() {
        return (
            <Container style={styles.container}>
                <ImageBackground source={MaskGroupRegister} style={{ width: '100%', height: '100%' }}>
                    <Root>
                        <Header noShadow style={[commonStyles.header, { backgroundColor: Colors.COLOR_TRANSPARENT }]}>
                            {this.renderHeaderView({
                                visibleStage: false,
                                title: "",
                                icBackMenu: ic_back_black,
                                renderRightMenu: this.renderRightHeader
                            })}
                        </Header>
                        <Content contentContainerStyle={{ flexGrow: 1 }}
                            style={{ flex: 1 }}>
                            <View style={[commonStyles.viewCenter, { flex: 1 }]}>
                                {/* {Input form} */}
                                <CardViewCustom
                                    title={localizes("register.register_title")}
                                    viewChild={
                                        <Form style={{ padding: Constants.PADDING_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }}>
                                            {/* Phone*/}
                                            <TextInputCustom
                                                title={"Số điện thoại"}
                                                styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                                placeholder={"Số điện thoại"}
                                                fault={this.state.faultPhone}
                                                refInput={r => (this.phone = r)}
                                                isInputAction={true}
                                                value={this.state.phone}
                                                onChangeText={phone => this.setState(
                                                    { phone, faultPhone: false }
                                                )}
                                                onSubmitEditing={() => {
                                                    this.password.focus();
                                                    //this._container.scrollTo({ x: 0, y: 100, animated: true })
                                                }}
                                                returnKeyType={"next"}
                                                keyboardType="phone-pad"
                                                isAsterisk={true}
                                            />
                                            {/*Password*/}
                                            <View style={{ justifyContent: 'center', position: 'relative' }}>
                                                <TextInputCustom
                                                    title={"Mật khẩu"}
                                                    refInput={input => {
                                                        this.password = input
                                                    }}
                                                    fault={this.state.faultPass}
                                                    styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                                    isInputAction={true}
                                                    placeholder={"Nhập mật khẩu"}
                                                    value={this.state.password}
                                                    onChangeText={password => this.setState(
                                                        { password, faultPass: false }
                                                    )}
                                                    onSubmitEditing={() => {
                                                        this.confirmPassword.focus()
                                                        //this._container.scrollTo({ x: 0, y: 200, animated: true })
                                                    }}
                                                    returnKeyType={"next"}
                                                    blurOnSubmit={false}
                                                    numberOfLines={1}
                                                    secureTextEntry={this.state.hidePassword}
                                                    inputNormalStyle={{
                                                        paddingRight: Constants.PADDING_LARGE * 5
                                                    }}
                                                    isAsterisk={true}
                                                />
                                                <TouchableHighlight
                                                    onPress={this.managePasswordVisibility}
                                                    style={[commonStyles.shadowOffset, {
                                                        position: 'absolute', right: Constants.PADDING_LARGE
                                                    }]}
                                                    underlayColor='transparent'
                                                >
                                                    <Image style={{ resizeMode: 'contain', opacity: Constants.SHADOW_OPACITY_BUTTON }}
                                                        source={(this.state.hidePassword) ? ic_eye_slash_black : ic_eye_black} />
                                                </TouchableHighlight>
                                            </View>
                                            {/* Confirm password */}
                                            <View style={{ justifyContent: 'center', position: 'relative' }}>
                                                <TextInputCustom
                                                    title={"Nhập lại mật khẩu"}
                                                    refInput={input => {
                                                        this.confirmPassword = input
                                                    }}
                                                    fault={this.state.faultConfirmPass}
                                                    styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                                    isInputAction={true}
                                                    placeholder={localizes('register.confirmPass')}
                                                    value={this.state.repeatPassword}
                                                    onChangeText={repeatPassword => this.setState(
                                                        { repeatPassword, faultConfirmPass: false }
                                                    )}
                                                    onSubmitEditing={Keyboard.dismiss}
                                                    returnKeyType={"next"}
                                                    blurOnSubmit={false}
                                                    numberOfLines={1}
                                                    secureTextEntry={this.state.hidePasswordConfirm}
                                                    inputNormalStyle={{
                                                        paddingRight: Constants.PADDING_LARGE * 5
                                                    }}
                                                    isAsterisk={true}
                                                />
                                                <TouchableHighlight
                                                    onPress={this.manageConfirmPasswordVisibility}
                                                    style={[commonStyles.shadowOffset, {
                                                        position: 'absolute', right: Constants.PADDING_LARGE
                                                    }]}
                                                    underlayColor='transparent'
                                                >
                                                    <Image style={{ resizeMode: 'contain', opacity: Constants.SHADOW_OPACITY_BUTTON }}
                                                        source={(this.state.hidePasswordConfirm) ? ic_eye_slash_black : ic_eye_black} />
                                                </TouchableHighlight>
                                            </View>
                                        </Form>
                                    }
                                />
                                {/* Register */}
                                <View style={[{ flexDirection: 'row', marginHorizontal: Constants.MARGIN_X_LARGE, marginTop: Constants.MARGIN_XX_LARGE }]}>
                                    {
                                        this.renderCommonButton(
                                            localizes('register.register_button'),
                                            { color: Colors.COLOR_WHITE },
                                            {
                                                flex: 1,
                                                marginTop: Constants.MARGIN_X_LARGE,
                                                paddingHorizontal: Constants.PADDING_X_LARGE
                                            },
                                            () => { this.onPressCommonButton() }
                                        )
                                    }
                                </View>
                            </View>
                            <View style={{ justifyContent: 'flex-end', alignItems: 'center', }}>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <TouchableOpacity
                                        activeOpacity={Constants.ACTIVE_OPACITY}
                                        style={{ marginBottom: Constants.MARGIN_X_LARGE }}
                                        onPress={() => {
                                            this.props.navigation.navigate('Login')
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[commonStyles.text, {
                                                textAlign: 'right',
                                                fontSize: Fonts.FONT_SIZE_MEDIUM,
                                                margin: 0
                                            }]}>{localizes('login.accountYet')}</Text>
                                            <Text style={[commonStyles.textBold, {
                                                textAlign: 'right', color: Colors.COLOR_TEXT, marginTop: 0
                                            }]}>{'Đăng nhập'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Content>
                        <CalendarScreen
                            maximumDate={new Date(new Date().setDate(DateUtil.now().getDate() - 1))}
                            dateCurrent={this.today}
                            chooseDate={this.chooseDate.bind(this)}
                            ref={ref => this.showCalendar = ref} />
                        {this.showLoadingBar(this.props.isLoading)}
                    </Root>
                </ImageBackground>
            </Container>
        )
    }

    /**
     * Show calendar date
     */
    showCalendarDate() {
        this.showCalendar.showDateTimePicker()
    }

    /**
     * Date press
     */
    chooseDate(day) {
        this.setState({
            dayOfBirth: DateUtil.convertFromFormatToFormat(day, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)
        })
    }

    /**
     * Manage Password Visibility
     */
    managePasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.password
        this.setState({ hidePassword: !this.state.hidePassword, password: "" });
        setTimeout(() => {
            this.setState({ password: last })
        }, 0)
    }

    /**
     * Manage Confirm Password Visibility
     */
    manageConfirmPasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.confirmPassword
        this.setState({ hidePasswordConfirm: !this.state.hidePasswordConfirm, confirmPassword: "" });
        setTimeout(() => {
            this.setState({ confirmPassword: last })
        }, 0)
    }

    /**
     * Register
     */
    onPressCommonButton() {
        this.validateAndSignUp()
    }
}

const styless = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        fontSize: 12,
        textAlign: 'center',
        color: '#888',
        marginTop: 5,
        backgroundColor: 'transparent'
    },
    data: {
        padding: 15,
        marginTop: 10,
        backgroundColor: '#000',
        borderColor: '#888',
        borderWidth: 1 / PixelRatio.get(),
        color: '#777'
    }
})

const mapStateToProps = state => ({
    data: state.signUp.data,
    isLoading: state.signUp.isLoading,
    error: state.signUp.error,
    errorCode: state.signUp.errorCode,
    action: state.signUp.action
});

export default connect(mapStateToProps, actions)(RegisterView);