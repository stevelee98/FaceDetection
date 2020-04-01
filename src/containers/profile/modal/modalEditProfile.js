import React, { Component } from "react";
import {
    ImageBackground, View, StatusBar,
    Image, TouchableWithoutFeedback,
    BackHandler, Alert, Linking,
    RefreshControl, StyleSheet, Slider,
    TextInput, Dimensions, FlatList,
    TouchableHighlight, TouchableOpacity,
    ScrollView, Platform
} from "react-native";
import {
    Container, Header, Title, Left, Icon, Right,
    Button, Body, Content, Text, Card, CardItem, Form,
    Picker
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
import ImageLoader from "components/imageLoader";
import styles from "./styles";
import ic_camera_black from 'images/ic_camera_black.png';
import Utils from "utils/utils";
import KeyboardSpacer from 'react-native-keyboard-spacer';

const screen = Dimensions.get("window");
const SIZE_IMAGE = 112;

export default class ModalEditProfile extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            avatar: null,
            name: null,
            phone: null,
            email: null,
            staffId: undefined
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
    showModal(user) {
        this.setState({
            avatar: user.avatar,
            name: user.name,
            phone: user.phone,
            email: user.email,
            staffId: user.staffId
        })
        this.refs.modalEditProfile.open();
    }

    /**
     * hide Modal Week
     */
    hideModal() {
        this.refs.modalEditProfile.close();
        this.props.onClose();
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentWillUnmount = () => {
    }

    render() {
        const { avatar, name, phone, email, staffId } = this.state;
        return (
            <Modal
                ref={"modalEditProfile"}
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
                    title={"Chỉnh sửa thông tin"}
                    viewChild={
                        <Form style={{ padding: Constants.PADDING_X_LARGE }}>
                            {this.renderHeaderUser()}
                            <View style={{ flexDirection: 'column' }}>
                                <TextInputCustom
                                    refInput={r => (this.name = r)}
                                    isInputNormal={true}
                                    myBackgroundColor={Colors.COLOR_WHITE}
                                    styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                    placeholder={"Nhập họ tên của bạn"}
                                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                                    onChangeText={(text) => { this.setState({ name: text }) }}
                                    value={name}
                                    returnKeyType = { "next" }
                                    onSubmitEditing={() => { this.email.focus(); }}
                                    autoCapitalize={"words"}
                                />
                                {/* <TextInputCustom
                                    refInput={r => (this.txtPhoneNumber = r)}
                                    isInputNormal={true}
                                    myBackgroundColor={Colors.COLOR_WHITE}
                                    styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                    placeholder={"Nhập số điện thoại của bạn"}
                                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                                    onChangeText={(text) => { this.setState({ txtPhoneNumber: text }) }}
                                    value={txtPhoneNumber}
                                /> */}
                                <TextInputCustom
                                    refInput={r => (this.email = r)}
                                    isInputNormal={true}
                                    myBackgroundColor={Colors.COLOR_WHITE}
                                    styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                    placeholder={"Nhập email của bạn"}
                                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                                    onChangeText={(text) => { this.setState({ email: text }) }}
                                    value={email}
                                />
                                {/* Account type */}
                                <View style={{
                                    alignItems: 'center',
                                    borderWidth: Constants.BORDER_WIDTH,
                                    borderColor: Colors.COLOR_BORDER,
                                    borderRadius: Constants.CORNER_RADIUS,
                                    marginHorizontal: Constants.MARGIN_X_LARGE,
                                    marginVertical: Constants.MARGIN_LARGE
                                }}>
                                    <Picker
                                        mode="dropdown"
                                        iosHeader = "Nhóm người dùng"
                                        selectedValue={this.state.staffId}
                                        style={{
                                            color: Utils.isNull(this.state.staffId)
                                                ? Colors.COLOR_TEXT_PLACEHOLDER
                                                : Colors.COLOR_TEXT,
                                            height: 46,
                                            width: "96%"
                                        }}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({
                                                staffId: itemValue
                                            })
                                        }
                                        placeholder="Nhóm người dùng"
                                        placeholderStyle={{ color: Colors.COLOR_TEXT_PLACEHOLDER }}
                                        textStyle={commonStyles.text}
                                        itemTextStyle={commonStyles.text}
                                    >
                                        {this.props.staffs.map((item, index) => {
                                            return (
                                                <Picker.Item
                                                    key={index.toString()}
                                                    label={item.name}
                                                    value={item.id}
                                                />
                                            )
                                        })}
                                    </Picker>
                                </View>
                            </View>
                            <View style={[commonStyles.viewCenter, { flexDirection: 'row', marginTop: Constants.MARGIN_LARGE }]}>
                                {
                                    this.renderCommonButton(
                                        "Cập nhập",
                                        {
                                            color: Colors.COLOR_WHITE
                                        },
                                        {
                                            alignSelf: 'stretch',
                                            marginRight: Constants.MARGIN_LARGE
                                        },
                                        () => this.props.onEditData({
                                            name, phone, email, staffId
                                        }),
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

    /**
     * Render header user
     */
    renderHeaderUser = () => {
        const { avatar } = this.state;
        const { attachFile, avatarTemp } = this.props;
        return (
            <View style={{ flexDirection: 'column', marginHorizontal: Constants.MARGIN, marginBottom: Constants.MARGIN_X_LARGE }}>
                {/* Avatar */}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity activeOpacity={Constants.ACTIVE_OPACITY} onPress={attachFile} >
                        <View style={{ position: 'relative' }}>
                            {Utils.isNull(avatarTemp) ?
                                <ImageLoader
                                    style={[
                                        styles.imageSize,
                                    ]}
                                    resizeAtt={{
                                        type: 'thumbnail', width: SIZE_IMAGE, height: SIZE_IMAGE
                                    }}
                                    resizeModeType={"cover"}
                                    path={avatar}
                                />
                                : <Image source={{ uri: avatarTemp }}
                                    style={[styles.imageSize]}
                                    resizeMode={"cover"} />
                            }
                            <View style={{
                                ...commonStyles.viewCenter,
                                ...commonStyles.position0,
                                backgroundColor: Colors.COLOR_WHITE_OPACITY_50,
                                width: SIZE_IMAGE,
                                height: SIZE_IMAGE,
                                borderRadius: SIZE_IMAGE / 2
                            }}>
                                <Image
                                    source={ic_camera_black}
                                    style={{ width: 36, height: 36 }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}