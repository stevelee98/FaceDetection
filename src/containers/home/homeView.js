import React, { Component } from "react";
import {
    ImageBackground, View, Image, TouchableOpacity,
    BackHandler, Alert, Linking, ScrollView, NativeEventEmitter,
    DeviceEventEmitter, Platform, RefreshControl, Dimensions, SafeAreaView, NativeModules
} from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Root, Header, Col } from "native-base";
import styles from "./styles";
import img_vehicle_transfer from 'images/img_vehicle_transfer.png';
import img_consultation from 'images/img_consultation.png';
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import { Colors } from "values/colors";
import ic_google_map from 'images/ic_google_map.png';
import { Constants } from "values/constants";
import Utils from 'utils/utils';
import ic_back_white from 'images/ic_back_white.png';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import { connect } from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import { localizes } from "locales/i18n";
import firebase from 'react-native-firebase';
import { Fonts } from "values/fonts";
import statusType from "enum/statusType";
import GeoLocationView from "containers/location/geoLocationView";
import bannerType from "enum/bannerType";
import ModalBanner from "./modal/modalBanner";
import SliderBanner from "./slider/sliderBanner";
import DialogCustom from "components/dialogCustom";
import userType from "enum/userType";
import ic_scan_code from 'images/ic_scan_code.png'
import onClickType from "enum/onClickType";
import { configConstants } from "values/configConstants";
import img_bg_gradient from 'images/img_bg_gradient.png';
import FlatListCustom from "components/flatListCustom";
import BackgroundShadow from "components/backgroundShadow";
import shadow_black_163 from "images/shadow_black_163.png";
import shadow_black_32 from "images/shadow_black_32.png";
import listType from "enum/listType";
import DateUtil from "utils/dateUtil";
import appointmentDateType from "enum/appointmentDateType";
import VersionNumber from 'react-native-version-number';
import ChatUnseenIcon from "containers/main/tabIcon/chatUnseenIcon";
import screenType from "enum/screenType";
import ic_chat_white from 'images/ic_chat_white.png';
import shadow_blue_163 from 'images/shadow_blue_163.png';
import bg_concave_white from "images/bg_concave_white.png";
import LinearGradient from 'react-native-linear-gradient';
import img_calender from 'images/img_calender.png';
import img_member from 'images/img_member.png';
import img_repair_green from 'images/img_repair_green.png';
import img_recent_h2_green from 'images/img_recent_h2_green.png';
import img_contact_green from 'images/img_contact_green.png';
import HeaderGradient from 'containers/common/headerGradient.js';
import ic_notification_white from 'images/ic_notification_white.png';
import ic_feedback_white from 'images/ic_feedback_white.png';
import ic_user_white from 'images/ic_user_white.png';
import ic_bg_red from 'images/ic_bg_red.png';
import ic_bg_green from 'images/ic_bg_green.png';
import ic_bg_blue from 'images/ic_bg_blue.png';
import ic_list_white from 'images/ic_list_white.png';
import ic_default_user from 'images/ic_default_user.png';
import ViewPager from '@react-native-community/viewpager';
import PostNewView from "./postNewView";
import PhotoLibraryView from "./photoLibraryView";
// import ChatUnseenIcon from 'containers/main/tabIcon/chatUnseenIcon';

const { ModuleWithEmitter } = NativeModules;
const screen = Dimensions.get("window");
const eventEmitter = new NativeEventEmitter(ModuleWithEmitter);
const ITEM_PER_ROW = 3;
const WIDTH_NOTIFY_MESS = global.unReadMess < 100 ? 14 : 28;
console.disableYellowBox = true;

class HomeView extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            userName: null,
            userType: null,
            avatar: "",
            appVersion: null,
            enableRefresh: true,
            refreshing: false,
            isAlertSwitchboard: false,
            isAlertVersion: false,
            tabSelected: 0,
            animationsAreEnabled: true
        }
        this.bannerAfterLogin = null;
        this.dataVersion = null;
        this.handleRefresh = this.handleRefresh.bind(this);
        this.tabs = [
            {
                "name": "Bài viết",
                "viewTab": <PostNewView />
            },
            {
                "name": "Thư viện ảnh",
                "viewTab": <PhotoLibraryView />
            }
        ]
        this.viewPager = React.createRef();
        global.openModalBanner = this.openModalBanner.bind(this);
        global.badgeCount = 0;
        global.unReadMess = 0;
        this.firebaseRef = firebase.database();
        this.onceQuery = 10;
    }

    /**
     * Press back exit app
     */
    onExitApp() {
        this.setState({ isAlertExitApp: true })
    }

    /**
     * Get profile user
     */
    getProfile() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                console.log('User Storage - Home', user);
                this.user = user;
                this.props.getUserProfile(user.id);
                // try {
                //     this.firebaseRef.ref(`chats_by_user/u${user.id}/number_of_unseen_messages`)
                //         .on('value', (messageSnap) => {
                //             console.log("number_of_unseen_messages in home view: ", messageSnap.val());
                //             global.unReadMess = messageSnap.val();
                //         });
                // } catch (error) {
                //     this.saveException(error, 'readFirebaseDatabase')
                // }
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            this.saveException(error, 'getProfile')
        });
    }

    // handle get profile
    handleGetProfile(user) {
        console.log("USER DATA: ", user);
        this.setState({
            user: user,
            avatar: !Utils.isNull(user.avatarPath) && user.avatarPath.indexOf('http') != -1
                ? user.avatarPath
                : this.resourceUrlPathResize.textValue + "=" + user.avatarPath,
            userName: user.name,
            userType: user.userType
        });

    }

    componentWillMount() {
        super.componentWillMount();

    }

    /**
     * Handler back button
     */
    handlerBackButton() {
        const { navigation } = this.props;
        console.log(this.className, 'back pressed')
        if (navigation) {
            this.onExitApp();
        } else {
            return false;
        }
        return true;
    }

    async componentDidMount() {
        super.componentDidMount();
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        StorageUtil.retrieveItem(StorageUtil.VERSION).then((version) => {
            console.log('Version', version)
            this.setState({
                appVersion: version
            })
        }).catch((error) => {
            this.saveException(error, 'componentWillMount');
        });
        this.props.getUpdateVersion();
        this.handleRequest();
        this.getSourceUrlPath();
    }

    /**
     * Go to Login
     */
    gotoLogin = () => {
        if (this.state.user == null) {
            this.showLoginView({
                routeName: "Home",
                params: {}
            })
        } else {
            this.props.navigation.navigate('Profile');
        }
    }

    /**
     * Go to Notification
     */
    gotoNotification = () => {
        if (this.state.user == null) {
            this.showLoginView({
                routeName: "Notification",
                params: {}
            })
        } else {
            this.props.navigation.navigate('Notification');
        }
    }

    /**
     * Open modal Banner
     */
    openModalBanner(banner) {
        this.refs.modalBanner.showModal(banner);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
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
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_UPDATE_VERSION)) {
                    this.checkUpdateVersion(data, this.state.appVersion)
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_CONFIG)) {
                    this.configList = data;
                    StorageUtil.storeItem(StorageUtil.MOBILE_CONFIG, this.configList);
                    this.getSourceUrlPath();
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    if (!Utils.isNull(data)) {
                        if (data.status == statusType.ACTIVE) {
                            StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
                            this.handleGetProfile(data);
                        } else {
                            this.logout();
                            this.goLoginScreen();
                        }
                    } else {
                        this.logout();
                        this.goLoginScreen();
                    }
                } else if (this.props.action == ActionEvent.NOTIFY_LOGIN_SUCCESS) {
                    this.getProfile();
                } else if (this.props.action == getActionSuccess(ActionEvent.COUNT_NEW_NOTIFICATION)) {
                    firebase.notifications().setBadge(data);
                    global.badgeCount = data;
                }
                this.isLoading = false;
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    render() {
        const { user, userName, avatar, tabSelected } = this.state;
        console.log("RENDER HOME VIEW")
        return (
            // <MyApp 
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        visibleStage={false}
                        visibleBack={false}
                        visibleAccount={true}
                        visibleNotification={true}
                        visibleLogo={true}
                        gotoLogin={this.gotoLogin}
                        gotoNotification={this.gotoNotification}
                        title=""
                        source={avatar}
                        userName={Utils.isNull(userName) ? "-" : userName.trim().split(" ").pop()}
                        editable={false}>
                    </HeaderGradient>
                    <LinearGradient
                        colors={[Colors.COLOR_PRIMARY_HIGH, Colors.COLOR_PRIMARY_LOW]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[styles.tabs]}>
                        {this.renderTabs()}
                    </LinearGradient>
                    <ViewPager
                        style={styles.viewPager}
                        initialPage={tabSelected}
                        // scrollEnabled={this.state.scrollEnabled}
                        // onPageScroll={this.onPageScroll}
                        onPageSelected={this.onPageSelected}
                        // onPageScrollStateChanged={this.onPageScrollStateChanged}
                        pageMargin={10}
                        // Lib does not support dynamically orientation change
                        orientation="horizontal"
                        // Lib does not support dynamically transitionStyle change
                        transitionStyle="scroll"
                        // showPageIndicator={dotsVisible}
                        ref={this.viewPager}>
                        {this.tabs.map((p, i) => this.renderPage(p, i))}
                    </ViewPager>
                    <ModalBanner ref={'modalBanner'} parentView={this} navigation={this.props.navigation} />
                    {this.renderIconChat()}
                    {this.showLoadingBar(this.props.isLoading)}
                    {/* Render Alert */}
                    {this.renderAlertSwitchboard()}
                    {this.renderAlertExitApp()}
                    {this.renderAlertVersion()}
                </Root>
            </Container>
        );
    }

    /**
     * Render icon chat
     */
    renderIconChat = () => {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={styles.iconChat}
                onPress={() => {
                    this.props.navigation.navigate("Chat")
                    // global.unReadMess = 0
                }}>
                <LinearGradient
                    colors={[Colors.COLOR_PRIMARY_LOW, Colors.COLOR_PRIMARY_HIGH]}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.8 }}
                    style={[commonStyles.shadowOffset, commonStyles.viewCenter, {
                        width: 52,
                        height: 52,
                        borderRadius: 52 / 2
                    }]}>
                    <View >
                        <Image source={ic_chat_white} />
                    </View>
                    {/* {global.unReadMess != 0 ?
                        <View
                            style={{
                                position: 'absolute',
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: -Constants.MARGIN_LARGE + 2,
                                right: -Constants.MARGIN_LARGE + 2,
                                backgroundColor: Colors.COLOR_SKY_BLUE,
                                padding: Constants.PADDING,
                                width: global.unReadMess < 100 ? 22 : 28,
                                borderRadius: 50
                            }}>
                            <Text style={{ color: Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_X_SMALL }}>{global.unReadMess}</Text>
                        </View>
                        : null} */}
                   { Platform.OS === 'android' ? <ChatUnseenIcon onClick={() => { this.props.navigation.navigate("Chat") }} /> : null}
                </LinearGradient>
                { Platform.OS === 'ios' ? <ChatUnseenIcon onClick={() => { this.props.navigation.navigate("Chat") }} /> : null}
            </TouchableOpacity>
        )
    }

    /**
     * Render tabs
     */
    renderTabs = () => {
        const { tabSelected } = this.state;
        return (
            this.tabs.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index.toString()}
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={styles.tab}
                        onPress={() => this.onChangeTab(index)}>
                        <Text style={styles.labelTab}>{item.name}</Text>
                        <View style={[styles.lineStyle, {
                            opacity: index == tabSelected ? 1 : 0
                        }]} />
                    </TouchableOpacity>
                )
            })
        )
    }

    /**
     * Render page
     */
    renderPage = (page, index) => {
        return (
            <View key={index.toString()}>
                {page.viewTab}
            </View>

        );
    }

    /**
     * Go to page
     */
    goPage = (page) => {
        if (this.state.animationsAreEnabled) {
            this.viewPager.current.setPage(page);
        } else {
            this.viewPager.current.setPageWithoutAnimation(page);
        }
    };

    /**
     * On change tab
     */
    onChangeTab = (index) => {
        this.setState({ tabSelected: index });
        this.goPage(index);
    }

    onPageSelected = (e) => {
        this.setState({ tabSelected: e.nativeEvent.position });
    };

    //onRefreshing
    handleRefresh() {
        this.handleRequest();
    }

    // handle request
    handleRequest() {
        let timeout = 1000;
        this.props.getConfig();
        let timeOutRequestOne = setTimeout(() => {
            this.countNewNotification();
            clearTimeout(timeOutRequestOne)
        }, timeout);
        this.getProfile();
    }

    /**
     * Render alert call the switchboard
     */
    renderAlertSwitchboard() {
        return (
            <DialogCustom
                visible={this.state.isAlertSwitchboard}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={"Liên hệ"}
                textBtnOne={"Chat"}
                textBtnTwo={"Gọi"}
                contentText={"Bạn muốn gọi trực tiếp (" + this.hotline.textValue + ") hay chat với admin?"}
                onTouchOutside={() => { this.setState({ isAlertSwitchboard: false }) }}
                onPressX={() => { this.setState({ isAlertSwitchboard: false }) }}
                onPressBtnOne={() => {
                    this.setState({ isAlertSwitchboard: false })
                    this.chatWithAdmin()
                }}
                onPressBtnPositive={() => {
                    this.renderCall(this.hotline.textValue)
                    this.setState({ isAlertSwitchboard: false })
                }}
            />
        )
    }

    /**
     * Render alert Exit App
     */
    renderAlertExitApp() {
        return (
            <DialogCustom
                styleItemBtnTwo={{ backgroundColor: Colors.COLOR_PRIMARY }}
                visible={this.state.isAlertExitApp}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={"Thông báo"}
                textBtnOne={"Hủy"}
                textBtnTwo={"Thoát"}
                contentText={"Bạn muốn thoát ứng dụng?"}
                onTouchOutside={() => { this.setState({ isAlertExitApp: false }) }}
                onPressX={() => {
                    this.setState({ isAlertExitApp: false })
                }}
                onPressBtnPositive={() => {
                    BackHandler.exitApp()
                }}
            />
        )
    }

    /**
     * Render alert Version
     */
    renderAlertVersion() {
        if (!Utils.isNull(this.dataVersion)) {
            return (
                <DialogCustom
                    visible={this.state.isAlertVersion}
                    isVisibleTitle={true}
                    isVisibleContentText={true}
                    isVisibleTwoButton={true}
                    contentTitle={localizes('notification')}
                    disableOne={this.dataVersion.force === 1}
                    textBtnOne={localizes('no')}
                    textBtnTwo={localizes('yes')}
                    contentText={this.dataVersion.description}
                    onTouchOutside={() => { this.setState({ isAlertVersion: false }) }}
                    onPressX={this.dataVersion.force === 0 ? () => {
                        this.setState({ isAlertVersion: false })
                        saveStorage(this.dataVersion)
                    } : null}
                    onPressBtnPositive={() => {
                        renderWebView(this.dataVersion.link)
                        this.setState({ isAlertVersion: false })
                        saveStorage(this.dataVersion)
                    }}
                />
            )
        }
    }

    /**
     * Check update version
     */
    checkUpdateVersion = (data, appVersion) => {
        this.dataVersion = data
        if (data != null) {
            if (data.version.toString() > VersionNumber.appVersion) {
                if (data.force === 0) {
                    if (appVersion != null || appVersion != undefined) {
                        if (appVersion.version !== data.version) {
                            this.setState({ isAlertVersion: true })
                        }
                    } else {
                        this.setState({ isAlertVersion: true })
                    }
                } else {
                    this.setState({ isAlertVersion: true })
                }
            }
        } else {
            StorageUtil.deleteItem(StorageUtil.VERSION);
        }
    }
}

saveStorage = (data) => {
    StorageUtil.storeItem(StorageUtil.VERSION, data)
}

renderWebView = (link) => {
    Linking.openURL(link);
}

const mapStateToProps = state => ({
    data: state.home.data,
    isLoading: state.home.isLoading,
    error: state.home.error,
    errorCode: state.home.errorCode,
    action: state.home.action
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
