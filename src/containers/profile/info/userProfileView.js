import React, { Component } from "react";
import { Root, Header, Title, Content, Container, Tabs, Tab, TabHeading, List, Col } from "native-base";
import {
    Image, ScrollView, Text,TouchableOpacity, View, TextInput, Dimensions, RefreshControl, processColor,
    Item, Input,Modal, TouchableHighlight, ToastAndroid, BackHandler, Picker,
    SafeAreaView, DeviceEventEmitter, NativeModules, ImageBackground, Platform,
    PermissionsAndroid
} from "react-native";
import ImagePicker from "react-native-image-picker";
import commonStyles from "styles/commonStyles";
import { Constants } from "values/constants"
import { Colors } from "values/colors";
import { localizes } from "locales/i18n";
import BaseView from "containers/base/baseView";
import ic_back_white from "images/ic_back_white.png";
import ic_menu_white from 'images/ic_menu_white.png';
import Dialog, { DIALOG_WIDTH } from 'components/dialog'
import FlatListCustom from "components/flatListCustom";
import GenderType from "enum/genderType";
import * as actions from "actions/userActions";
import * as commonActions from "actions/commonActions";
import * as productActions from "actions/productActions";
import { connect } from "react-redux";
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import Utils from 'utils/utils';
import StringUtil from 'utils/stringUtil';
import StorageUtil from "utils/storageUtil";
import DateUtil from "utils/dateUtil";
import styles from "./styles";
import moment from 'moment';
import { ServerPath } from "config/Server";
import Upload from 'react-native-background-upload'
import ImageLoader from "components/imageLoader"
import { Fonts } from "values/fonts";
import { CalendarScreen } from 'components/calendarScreen';
import { StackActions, NavigationActions } from 'react-navigation';
import DialogCustom from "components/dialogCustom";
import loginType from "enum/loginType";
import * as actionsVehicles from "actions/vehicleAction";
import firebase from 'react-native-firebase';
import BackgroundShadow from "components/backgroundShadow";
import appointmentDateType from "enum/appointmentDateType";
import screenType from "enum/screenType";
import { configConstants } from "values/configConstants";
import HeaderGradient from 'containers/common/headerGradient.js';
import TextInputCustom from "components/textInputCustom";
import itemSellingVehicleType from 'enum/itemSellingVehicleType';
import ModalMenuProfile from "../modal/modalMenuProfile";
import menuProfileType from "enum/menuProfileType";
import ImageResizer from 'react-native-image-resizer';
import EditProfileView from "../editprofile/editProfileView";

const CANCEL_INDEX = 2;
const FILE_SELECTOR = [localizes('camera'), localizes("image"), localizes("cancel")];
const deviceWidth = Dimensions.get("window").width;
const deviceHeigth = Dimensions.get("window").height;
const optionsCamera = {
    title: 'Select avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
const HEIGHT_ADDRESS_ITEM = 180;

class UserProfileView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            visibleDialog: false,
            source: "",
            txtAccountName: '',
            txtDateOfBird: '',
            txtPhoneNumber: '',
            txtEmail: '',
            txtPersonalID: '',
            txtAddressUser: '',
            isEmptyPassword: false,
            user: null,
            enableRefresh: false,
            refreshing: false,
            isAlert: false,
            isAlertSocial: false,
            loginType: null,
            avatarTemp: null
        }
        this.userInfo = null;
        this.dataAccount = {};
    }

    componentWillMount() {
        super.componentWillMount();
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
    }

    async componentDidMount() {
        super.componentDidMount();
        this.getSourceUrlPath();
        this.getProfile()
        // in this example, there are line, bar, candle, scatter, bubble in this combined chart.
        // according to MpAndroidChart, the default data sequence is line, bar, scatter, candle, bubble.
        // so 4 should be used as dataIndex to highlight bubble data.
        // if there is only bar, bubble in this combined chart.
        // 1 should be used as dataIndex to highlight bubble data.

        this.setState({ ...this.state, highlights: [{ x: 1, y: 150, dataIndex: 1 }, { x: 2, y: 106, dataIndex: 1 }] })
        this.setState({ ...this.state, highlights2: [{ x: 1, y: 150, dataIndex: 1 }, { x: 2, y: 106, dataIndex: 1 }] })
        DeviceEventEmitter.addListener('RNUploaderProgress', (data) => {
            let bytesWritten = data.totalBytesWritten;
            let bytesTotal = data.totalBytesExpectedToWrite;
            let progress = data.progress;

            console.log("upload progress: " + progress + "%");
        });
        // await GoogleSignin.configure({
        //     iosClientId: configConstants.KEY_IOS_CLIENT_ID_GOOGLE
        // });
        this.handleRequest()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        BackHandler.removeEventListener(
            "hardwareBackPress",
            this.handlerBackButton
        );
    }

    /**
     * Get profile user
     */
    getProfile() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            if (!Utils.isNull(user)) {
                this.userInfo = user
                this.props.getUserProfile(user.id)
                this.handleGetProfile(user)
            }
        }).catch(error => {
            //this callback is executed when your Promise is rejected
            this.saveException(error, 'getProfile')
        });
    }

    // handle get profile
    handleGetProfile(user) {
        this.setState({
            user: user,
            txtEmail: user.email,
            txtPersonalID: user.personalID,
            txtAddressUser: user.address,
            txtAccountName: user.name,
            txtDateOfBird: !Utils.isNull(user.birthDate) ?
                DateUtil.convertFromFormatToFormat(user.birthDate, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE) : null,
            txtPhoneNumber: user.phone,
            //staff: user.staffType
            isEmptyPassword: user.password,
        })
    }

    /**
     * Show calendar date
     */
    showCalendarDate() {
        this.showCalendar.showDateTimePicker();
    }

    //onRefreshing
    handleRefresh = () => {
        this.setState({
            refreshing: false
        })
        this.props.getUserProfile(this.userInfo.id);
        this.handleRequest();
    }

    // Handle request
    handleRequest() {
        let timeout = 1000;
        //this.props.getStaffs();
        let timeOutRequestOne = setTimeout(() => {

            clearTimeout(timeOutRequestOne)
        }, timeout)
    }

    /**
     * Handle data
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    this.userInfo = data;
                    this.handleGetProfile(this.userInfo)
                    if (!Utils.isNull(data)) {
                        console.log("Avatar Path: ", !Utils.isNull(data.avatarPath))
                        // this.state.source = !Utils.isNull(data.avatarPath) && data.avatarPath.indexOf('http') != -1
                        //     ? data.avatarPath
                        //     : this.resourceUrlPathResize.textValue + "=" + data.avatarPath
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.CHANGE_PASS)) {
                    if (data) {
                        this.showMessage(localizes('setting.change_pass_success'));
                        this.getProfile();
                    } else {
                        this.showMessage(localizes('setting.oldPassFail'));
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    /**
     * show dialog logout
     */
    logoutDialog = () => (
        <DialogCustom
            styleItemBtnTwo={{backgroundColor:Colors.COLOR_PRIMARY}}
            visible={this.state.isAlert}
            isVisibleTitle={true}
            isVisibleContentText={true}
            isVisibleTwoButton={true}
            contentTitle={"Xác nhận"}
            textBtnOne={"Hủy"}
            textBtnTwo={"Đăng xuất"}
            contentText={localizes('slidingMenu.want_out')}
            onTouchOutside={() => { this.setState({ isAlert: false }) }}
            onPressX={() => { this.setState({ isAlert: false }) }}
            onPressBtnPositive={() => {
                StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN).then((token) => {
                    if (token != undefined) {
                        let filter = {
                            deviceId: "",
                            deviceToken: token
                        }
                        this.props.deleteUserDeviceInfo(filter) // delete device info
                    } else {
                        console.log('token null');
                    }
                }).catch((error) => {
                    //this callback is executed when your Promise is rejected
                    this.saveException(error, 'logoutDialog');
                });
                StorageUtil.deleteItem(StorageUtil.USER_PROFILE)
                    .then(user => {
                        console.log("user setting", user);
                        if (Utils.isNull(user)) {
                            this.showMessage(localizes('setting.logoutSuccess'))
                            this.setState({ isAlert: false });
                            this.logout();
                            this.signOutFB("Facebook");
                            this.signOutZL("Zalo");
                            this.goLoginScreen();
                        } else {
                            this.showMessage(localizes('setting.logoutFail'));
                        }
                    })
                    .catch(error => {
                        this.saveException(error, 'logoutDialog');
                    });
            }}
        />
    )

    /**
     * Render file selection dialog
     */
    renderFileSelectionDialog() {
        return (
            <DialogCustom
                visible={this.state.visibleDialog}
                isVisibleTitle={true}
                isVisibleContentForChooseImg={true}
                contentTitle={"Chọn hình ảnh"}
                contentText={localizes('slidingMenu.want_out')}
                onTouchOutside={() => { this.setState({ visibleDialog: false }) }}
                onPressX={() => { this.setState({ visibleDialog: false }) }}
                onPressCamera={() => { this.onSelectedType(0) }}
                onPressGallery={() => { this.onSelectedType(1) }}
            />
        );
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    justifyContent: "center",
                    paddingLeft: Constants.PADDING_LARGE,
                    paddingVertical: Constants.PADDING_LARGE
                }}
                onPress={() => this.refs.modalMenuProfile.showModal()}
            >
                <Image source={ic_menu_white} />
            </TouchableOpacity>
        )
    }

    /**
     * Render View
     */
    render() {
        const { user, txtAccountName, txtDateOfBird, txtPhoneNumber, txtAddressUser } = this.state
        let height = (Platform.OS === 'ios') ? Constants.STATUS_BAR_HEIGHT : 0;
        return (
            <Container style={[styles.container, { backgroundColor: Colors.COLOR_WHITE }]}>
                <Root>
                    <HeaderGradient
                        visibleStage={false}
                        onBack={this.onBack}
                        title={localizes("userProfileView.personalInformation")}
                        renderRightMenu={this.renderRightMenu}>
                    </HeaderGradient>
                    <Content
                        showsVerticalScrollIndicator={false}
                        ref={(e) => { this.fScroll = e }}
                        contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }>
                        {this.renderHeaderUser()}
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginVertical: Constants.MARGIN_X_LARGE,
                            marginHorizontal: Constants.MARGIN_X_LARGE,
                            alignItems: 'center',
                        }} >
                            <View style={styles.borderInfoUser}>
                                <TextInputCustom
                                    title="Họ tên "
                                    refInput={r => (this.txtAccountName = r)}
                                    isMultiLines={true}
                                    myBackgroundColor={Colors.COLOR_WHITE}
                                    styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                    placeholder={"-"}
                                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                                    onChangeText={(text) => { this.setState({ txtAccountName: text }) }}
                                    value={txtAccountName}
                                    textAlignInput="right"
                                    inputNormalStyle={styles.inputNormalStyle}
                                    styleInputGroup={styles.styleInputGroup}
                                    borderBottomWidth={Constants.BORDER_WIDTH}
                                    editable={false}
                                />
                                <TextInputCustom
                                    title="Điện thoại "
                                    refInput={r => (this.txtPhoneNumber = r)}
                                    isInputNormal={true}
                                    myBackgroundColor={Colors.COLOR_WHITE}
                                    styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                    placeholder={"-"}
                                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                                    onChangeText={(text) => { this.setState({ txtPhoneNumber: text }) }}
                                    value={txtPhoneNumber}
                                    textAlignInput='right'
                                    inputNormalStyle={styles.inputNormalStyle}
                                    styleInputGroup={styles.styleInputGroup}
                                    borderBottomWidth={Constants.BORDER_WIDTH}
                                    editable={false}
                                />
                                {/* Day Of Birth */}
                                <TextInputCustom
                                    title="Ngày sinh "
                                    refInput={r => (this.dayOfBirth = r)}
                                    isInputNormal={true}
                                    myBackgroundColor={Colors.COLOR_WHITE}
                                    styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                    placeholder={"--/--/----"}
                                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                                    onChangeText={txtDateOfBird => { this.setState({ txtDateOfBird }) }}
                                    value={txtDateOfBird}
                                    textAlignInput='right'
                                    inputNormalStyle={styles.inputNormalStyle}
                                    styleInputGroup={styles.styleInputGroup}
                                    borderBottomWidth={Constants.BORDER_WIDTH}
                                    keyboardType="phone-pad"
                                    onFocus={() => this.showCalendarDate()}
                                    editable={false}
                                />
                                <TextInputCustom
                                    title="Địa chỉ "
                                    refInput={r => (this.txtAddressUser = r)}
                                    isMultiLines={true}
                                    myBackgroundColor={Colors.COLOR_WHITE}
                                    styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                    placeholder={"-"}
                                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                                    onChangeText={(text) => { this.setState({ txtAddressUser: text }) }}
                                    value={txtAddressUser}
                                    textAlignInput='right'
                                    inputNormalStyle={styles.inputNormalStyle}
                                    styleInputGroup={styles.styleInputGroup}
                                    borderBottomWidth={Constants.BORDER_WIDTH}
                                    editable={false}
                                />
                            </View>
                        </View>
                    </Content>
                    <ModalMenuProfile
                        ref={'modalMenuProfile'}
                        onResult={this.onToggleMenu.bind(this)}
                        parentView={this}
                    />
                    <CalendarScreen
                        maximumDate={new Date(new Date().setDate(DateUtil.now().getDate() - 1))}
                        dateCurrent={!Utils.isNull(txtDateOfBird)
                            ? DateUtil.convertFromFormatToFormat(
                                txtDateOfBird,
                                DateUtil.FORMAT_DATE_TIME_ZONE,
                                DateUtil.FORMAT_DATE_TIME_ZONE_T
                            ) : DateUtil.now()}
                        chooseDate={this.chooseDate.bind(this)}
                        ref={ref => this.showCalendar = ref} />
                    {this.showLoadingBar(this.props.isLoading)}
                    {this.renderFileSelectionDialog()}
                    {this.logoutDialog()}
                </Root>
            </Container>
        );
    }

    /**
     * On close modal edit profile
     */
    onCloseModalEditProfile = () => {
        this.setState({ avatarTemp: null })
    }

    /**
     * Filter
     */
    onToggleMenu(type) {
        const { txtAccountName, txtEmail, source, txtPhoneNumber, txtPersonalID, txtAddressUser, isEmptyPassword } = this.state;
        const user = {
            name: txtAccountName,
            email: txtEmail,
            avatar: source,
            phone: txtPhoneNumber,
            personalID: txtPersonalID,
            address: txtAddressUser,
            //staffId: !Utils.isNull(staff) ? staff.id : undefined
        }
        if (type == menuProfileType.EDIT_PROFILE) {
            this.props.navigation.navigate('EditProfile');
        } else if (type == menuProfileType.CHANGE_PASSWORD) {
            this.props.navigation.navigate("ChangePassword", { isEmptyPassword: isEmptyPassword });
        } else if (type == menuProfileType.LOGOUT_USER) {
            this.setState({ isAlert: true });
        }
    }

    /**
     * Render header user
     */
    renderHeaderUser = () => {
        const { source, txtPhoneNumber, txtAccountName, txtAddressUser } = this.state
        return (
            <View style={{ flexDirection: 'column', marginHorizontal: Constants.MARGIN, marginVertical: Constants.MARGIN_X_LARGE }}>
                {/* Avatar */}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity activeOpacity={Constants.ACTIVE_OPACITY} disabled={true} onPress={this.attachFile} >
                        <View style={{ position: 'relative' }}>
                            {this.userInfo && !Utils.isNull(this.userInfo.avatarPath) && this.userInfo.avatarPath.indexOf('http') != -1 ?
                                <ImageLoader
                                    style={[
                                        styles.imageSize,
                                    ]}
                                    resizeModeType={"cover"}
                                    path={this.userInfo.avatarPath}
                                /> : <ImageLoader
                                    style={[
                                        styles.imageSize,
                                    ]}
                                    resizeAtt={{
                                        type: 'thumbnail', width: 112, height: 112
                                    }}
                                    resizeModeType={"cover"}
                                    path={this.userInfo ? this.resourceUrlPathResize.textValue + "=" + this.userInfo.avatarPath: ""}
                                />}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * Attach file
     */
    attachFile = () => {
        this.showDialog();
    };

    /**
     * show dialog
     */
    showDialog() {
        this.setState({
            visibleDialog: true
        });
    }

    /**
     * Called when selected type
     * @param {*} index
     */
    onSelectedType(index) {
        if (index !== CANCEL_INDEX) {
            if (index === 0) {
                this.takePhoto();
            } else if (index === 1) {
                this.showDocumentPicker();
            }
        } else {
            this.hideDialog()
        }
    }

    /**
     * hide dialog
     */
    hideDialog() {
        this.setState({
            visibleDialog: false
        });
    }

    /**
     * Show document picker
     */
    showDocumentPicker = async fileType => {
        const hasCameraPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.CAMERA);

        if (!hasCameraPermission) return;

        ImagePicker.launchImageLibrary(optionsCamera, response => {
            const { error, uri, originalRotation, didCancel } = response;
            this.hideDialog();
            if (uri && !error) {
                let rotation = 0;
                ImageResizer.createResizedImage(uri, 800, 600, "JPEG", 80, rotation).
                    then(({ uri }) => {
                        this.setState({
                            avatarTemp: uri
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            } else if (error) {
                console.log("The photo picker errored. Check ImagePicker.launchCamera func")
                console.log(error)
            }
        });
    };

    /**
     * Take a photo
     */
    takePhoto = async () => {
        const hasCameraPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.CAMERA);

        if (!hasCameraPermission) return;

        ImagePicker.launchCamera(optionsCamera, response => {
            const { error, uri, originalRotation, didCancel } = response;
            this.hideDialog();
            if (uri && !error) {
                let rotation = this.rotateImage(originalRotation);
                ImageResizer.createResizedImage(uri, 800, 600, "JPEG", 80, rotation).
                    then(({ uri }) => {
                        this.setState({
                            avatarTemp: uri
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            } else if (error) {
                console.log("The photo picker errored. Check ImagePicker.launchCamera func")
                console.log(error)
            }
        });
    };

    /**
     * Rotate image
     */
    rotateImage(orientation) {
        let degRotation;
        switch (orientation) {
            case 90:
                degRotation = 90
                break;
            case 270:
                degRotation = -90
                break;
            case 180:
                degRotation = 180
                break;
            default:
                degRotation = 0
        }
        return degRotation;
    }

    /**
     * Date press
     */
    chooseDate(day) {
        this.setState({
            dayOfBirth: DateUtil.convertFromFormatToFormat(day, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE)
        });
    }

    /**
     * Set file path into {state} when selected file successfully
     */
    setSourceFromFileSelector = source => {
        this.setState({
            source: source,
            visibleDialog: false
        });
    };

    /**
     * Get gender user
     * @param {*} gender
     */
    getGender(gender) {
        let genderText = localizes("userProfileView.other");
        if (gender === GenderType.MALE)
            genderText = localizes("userProfileView.male");
        else if (gender === GenderType.FEMALE)
            genderText = localizes("userProfileView.female");
        return genderText;
    }

    /**
     * Show calendar date
     */
    showCalendarDate() {
        console.log("USER BIRTH:", DateUtil.convertFromFormatToFormat(this.state.user.birthDate, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_TIME_ZONE_T))
        this.showCalendar.showDateTimePicker();
    }

    /**
     * Date press
     */
    chooseDate(day) {
        this.setState({
            txtDateOfBird: DateUtil.convertFromFormatToFormat(day, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)
        }, () => this.onEditData())
    }

    /**
     * On change pass
     */
    onChangePassWord = (oldPass, newPass) => {
        this.props.changePass(oldPass, newPass);
    }
}

const mapStateToProps = state => ({
    data: state.userProfile.data,
    action: state.userProfile.action,
    isLoading: state.userProfile.isLoading,
    error: state.userProfile.error,
    errorCode: state.userProfile.errorCode,
    screen: state.userProfile.screen
});

const mapDispatchToProps = {
    ...actions,
    ...actionsVehicles,
    ...productActions,
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView);
