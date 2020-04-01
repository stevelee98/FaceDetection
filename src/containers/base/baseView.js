import React, {Component} from "react";
import {
    BackHandler, ImageBackground, View, StatusBar,
    DeviceEventManager, Image, ActivityIndicator,
    TouchableOpacity, Dimensions, Platform, Alert,
    Linking, DeviceEventEmitter, Keyboard,
    NativeModules, PermissionsAndroid, TouchableHighlight
} from "react-native";
import {
    Root, Form, Textarea, Container, Header, Title, Left, Icon, Right,
    Button, Body, Content, Text, Card, CardItem,
    Fab, Footer, Input, Item, ActionSheet, Spinner,
} from "native-base";
import NetInfo from "@react-native-community/netinfo";
import {StackActions, NavigationActions} from 'react-navigation';
import {Constants} from "values/constants";
import HeaderView from "containers/common/headerView";
import commonStyles from 'styles/commonStyles';
import {Colors} from "values/colors";
import {ErrorCode} from "config/errorCode";
import {localizes} from "locales/i18n";
import StorageUtil from "utils/storageUtil";
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
import ExamQuestionSectionType from "enum/examQuestionSectionType"
import formalType from "enum/formalType";
import DateUtil from "utils/dateUtil";
import Utils from 'utils/utils'
import Toast from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import statusType from "enum/statusType";
import rescueAndTransferType from "enum/rescueAndTransferType";
import {AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginButton} from 'react-native-fbsdk';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import StringUtil from "utils/stringUtil";
import {async} from "rxjs/internal/scheduler/async";
import {Fonts} from "values/fonts";
import Modal from 'react-native-modalbox';
import imageRatio from "enum/imageRatio";
import userType from 'enum/userType';
import MapCustomView from "containers/map/mapCustomView";
import LinearGradient from "react-native-linear-gradient";

const screen = Dimensions.get("window");

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'Home'})],
});

const resetActionLogin = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'CreatePersonGroup'})],
});

const CHANNEL_ID = 'aaChannelId'
const CHANNEL_NAME = 'Thông báo chung'

/** 
 * Base view class
 */
class BaseView extends Component {

    constructor(props) {
        super(props)
        this.handlerBackButton = this.handlerBackButton.bind(this)
        this.className = this.constructor.name
        this.onBack = this.onBack.bind(this)
        this.onChangedOrientation = this.onChangedOrientation.bind(this)
        this.resourceUrlPath = {}
        this.resourceUrlPathResize = {}
        this.hotline = {}
        this.baseView = this
        this.countNewNotification = this.countNewNotification.bind(this)
        this.quantityCart = 0
    }

    goto () {

    }

    render () {
        return (
            <View></View>
        );
    }

    /**
     * Has permission
     */
    hasPermission = async (permissions) => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            permissions
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
            permissions
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            console.log("Permission denied by user.");
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            console.log("Permission revoked by user.");
        }

        return false;
    }

    /**
     * Show toast message
     * @param {*} message 
     * @param {*} duration 
     * @param {*} type 
     */
    showMessage (message, duration = 30000, type = 'warning') {
        try {
            if (!global.isShowMessageError) {
                global.isShowMessageError = true
                Toast.show(message, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.CENTER,
                });
            }
            setTimeout(() => {
                global.isShowMessageError = false
            }, 5000)
        } catch (e) {
            global.isShowMessageError = false
            console.log(e);
        }
    }

    //Show login view
    showLoginView (route) {
        if (!Utils.isNull(route)) {
            this.props.navigation.navigate('Login', {
                router: {
                    name: route.routeName,
                    params: route.params
                }
            })
        } else {
            this.props.navigation.navigate('Login');
        }
    }

    //Save exception
    saveException (error, func) {
        let filter = {
            className: this.props.navigation ? this.props.navigation.state.routeName : this.className,
            exception: error.message + " in " + func,
            osVersion: DeviceInfo.getSystemVersion(),
            appVersion: VersionNumber.appVersion
        }
        console.log(filter)
        this.props.saveException(filter)
    }

    componentWillUnmount () {
        Dimensions.removeEventListener('change', this.onChangedOrientation)
        // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange)
        if (this.messageListener != undefined) {
            this.messageListener();
        }
        if (this.notificationListener != undefined) {
            this.notificationListener();
        }
        if (this.notificationOpenedListener != undefined) {
            this.notificationOpenedListener();
        }
        if (this.notificationDisplayedListener != undefined) {
            this.notificationDisplayedListener();
        }
    }

    onChangedOrientation (e) {

    }

    /**
     * Sign out GG
     */
    signOutGG = async (data) => {
        try {
            if (!Utils.isNull(data)) {
                await GoogleSignin.signOut();
            }
        } catch (error) {
            this.saveException(error, "signOutGG")
        }
    };

    /**
     * Sign out FB
     */
    signOutFB = async (data) => {
        if (!Utils.isNull(data)) {
            LoginManager.logOut()
        }
    };

    /**
     * Sign out ZL
     */
    signOutZL = async (data) => {
        if (!Utils.isNull(data)) {
        }
    };

    /**
     * Handler back button
     */
    handlerBackButton () {
        console.log(this.className, 'back pressed')
        if (this.props.navigation) {
            this.onBack()
        } else {
            return false
        }
        return true
    }

    /**
     * Back pressed
     * True: not able go back
     * False: go back
     */
    onBackPressed () {
        return false
    }

    /**
     * On back
     */
    onBack () {
        if (this.props.navigation) {
            this.props.navigation.goBack()
        }
    }

    /**
     * Go to home screen
     */
    goHomeScreen () {
        this.props.navigation.dispatch(resetAction)
    }

    /**
     * Go to login screen
     */
    goLoginScreen () {
        this.props.navigation.dispatch(resetActionLogin)
    }

    /**
     * Show cart
     */
    showCart = () => {
        this.props.navigation.navigate("Cart")
    }

    /**
     * Go home
     */
    goHome = () => {
        this.props.navigation.navigate("Main")
    }

    /**
     * Render header view
     * default: visibleBack = true
     * onBack, stageSize, initialIndex
     *
     * @param {*} props 
     */
    renderHeaderView (props = {}) {
        const defaultProps = {
            visibleBack: true,
            onBack: this.onBack,
            shadowOffset: {height: 6, width: 3},
            shadowOpacity: 0.25,
            elevation: Constants.SHADOW,
        }
        const newProps = {...defaultProps, ...props}
        return <HeaderView {...newProps} />
    }

    renderRightHeader = () => {
        return (
            <View style={{padding: Constants.PADDING_X_LARGE + Constants.PADDING}} />
        )
    }

    /**
     * Render map view
     *
     * @param {*} props 
     */
    renderMapView (props = {}) {
        const defaultProps = {
            visibleMakerMyLocation: true,
            visibleLoadingBar: true,
            visibleButtonLocation: true
        }
        const newProps = {...defaultProps, ...props}
        return <MapCustomView onRef={(ref) => {this.map = ref}} {...newProps} />
    }

    /**
     * Common button have 100% width with opacity when clicked
     * @param {*} title 
     * @param {*} titleStyle 
     * @param {*} buttonStyle 
     */
    renderCommonButton (title = '', titleStyle = {}, buttonStyle = {}, onPress = null, icon, disableButton, viewStyle = {}) {
        let onPressItem = onPress ? onPress : this.onPressCommonButton.bind(this)
        return (
            <LinearGradient colors={[Colors.COLOR_PRIMARY_LOW, Colors.COLOR_PRIMARY_HIGH]}
                start={{x: 0, y: 0}} end={{x: 0, y: 1}}
                style={[commonStyles.shadowOffset,
                {flex: 1, borderRadius: Constants.MARGIN_24}]}>
                <TouchableHighlight
                    style={[{flex: 1, padding: Constants.MARGIN_12 / 2, borderRadius: Constants.MARGIN_24}, commonStyles.viewCenter,]}
                    disabled={disableButton}
                    onPress={onPress}
                    underlayColor={Colors.COLOR_BACKGROUND_COUNT_NOTIFY}>
                    <Text style={[commonStyles.textBold, commonStyles.text, titleStyle]}>{title}</Text>
                </TouchableHighlight>
            </LinearGradient>
        )
    }

    onPressCommonButton () {
    }

    /**
     * Go next screen
     * @param {*} className 
     * @param {*} params 
     * @param {*} isNavigate 
     */
    goNextScreen (className, params = this.props.navigation.state.params, isNavigate = true) {
        if (isNavigate)
            this.props.navigation.navigate(className, params)
        else
            this.props.navigation.push(className, params)
    }

    /**
     * get new notification
     */
    countNewNotification () {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (this.props.countNewNotification && !Utils.isNull(user) && user.status == statusType.ACTIVE) {
                this.props.countNewNotification()
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    /**
     * Logout
     */
    logout () {
        StorageUtil.deleteItem(StorageUtil.USER_PROFILE)
        StorageUtil.storeItem(StorageUtil.USER_PROFILE, null)
        StorageUtil.deleteItem(StorageUtil.USER_TOKEN)
        StorageUtil.storeItem(StorageUtil.USER_TOKEN, null)
        StorageUtil.deleteItem(StorageUtil.FIREBASE_TOKEN)
        StorageUtil.storeItem(StorageUtil.FIREBASE_TOKEN, null)
        global.token = "";
        global.firebaseToken = "";
        firebase.notifications().setBadge(0);
        global.badgeCount = 0;
    }

    /**
     * Authentication firebase
     */
    signInWithCustomToken (userId) {
        StorageUtil.retrieveItem(StorageUtil.FIREBASE_TOKEN).then((firebaseToken) => {
            //this callback is executed when your Promise is resolved
            console.log("FIREBASE TOKEN: ", firebaseToken)
            if (!Utils.isNull(firebaseToken) & !Utils.isNull(userId)) {
                if (Platform.OS === "android") {
                    firebase.auth().signInWithCustomToken(firebaseToken).catch(function (error) {
                        console.warn("Error auth: " + error.code + " - " + error.message);
                    });
                } else {
                    var view = NativeModules.AppDelegate
                    view.loginAuthenFirebase(firebaseToken)
                }
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
        });
    }

    /**
     * put info of user to firebase
     * @param {*} userId 
     * @param {*} userName 
     * @param {*} avatarPath 
     */
    putUserInfoToFirebase (userId, userName, avatarPath) {
        firebase.database().ref(`/users`)
            .child(userId)
            .set({
                name: userName,
                avatar: avatarPath,
                isOnline: true
            });
    }

    /**
     * Handle error
     * @param {} errorCode 
     */
    handleError (errorCode, error) {
        switch (errorCode) {
            case ErrorCode.ERROR_COMMON:
                this.showMessage(localizes("error_in_process"))
                break
            case ErrorCode.NO_CONNECTION:
                NetInfo.isConnected.fetch().done(
                    (isConnected) => {
                        if (isConnected) {
                            this.showMessage(localizes("error_connect_to_server"))
                        } else {
                            this.showMessage(localizes("error_network"))
                        }
                    })
                break
            case ErrorCode.UN_AUTHORIZE:
            case ErrorCode.AUTHENTICATE_REQUIRED:
                this.logout();
                if (!global.isShowMessageError) {
                    global.isShowMessageError = true
                    Alert.alert(
                        localizes('notification'),
                        localizes('baseView.authenticateRequired'),
                        [
                            {
                                text: 'Hủy', onPress: () => {
                                    global.isShowMessageError = false
                                }
                            },
                            {
                                text: 'OK', onPress: () => {
                                    this.showLoginView();
                                }
                            }
                        ],
                        {cancelable: false},
                    );
                }
                break
            default:
        }
    }

    /**
     * Handle connection change
     */
    handleConnectionChange = (isConnected) => {
        console.log(`is connected: ${isConnected}`)
    }

    /**
     * Open screen call
     * @param {*} phone 
     */
    renderCall (phone) {
        let url = `tel:${phone}`;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err =>
            this.saveException(err, "renderCall")
        );
    }

    /**
     * Show loading bar
     * @param {*} isShow 
     */
    showLoadingBar (isShow) {
        return isShow ?
            <View style={{
                position: 'absolute',
                flex: 1,
                width: screen.width,
                height: screen.height,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "transparent"
            }}>
                <View style={{
                    position: 'absolute',
                    flex: 1,
                    width: screen.width,
                    height: screen.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.COLOR_GRAY, opacity: 0.7
                }}>

                </View>
                <View style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: Constants.CORNER_RADIUS / 2,
                    backgroundColor: Colors.COLOR_WHITE, height: 200, width: screen.width - 100
                }}>
                    <Spinner style={{}} color={Colors.COLOR_SKY_BLUE} ></Spinner>
                    <Text style={{fontSize: Fonts.FONT_SIZE_X_MEDIUM}}>Chờ xíu nha</Text>
                </View>
            </View>
            : null
    }

    /**
     * Get source url path
     */
    getSourceUrlPath = () => {
        StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG).then((faq) => {
            if (!Utils.isNull(faq)) {
                console.log('faq', faq)
                this.resourceUrlPath = faq.find(x => x.name == 'resource_url_path')
                console.log('resource_url_path', this.resourceUrlPath)
                this.resourceUrlPathResize = faq.find(x => x.name == 'resource_url_path_resize')
                console.log('resource_url_path_resize', this.resourceUrlPathResize)
                this.hotline = faq.find(x => x.name == 'hotline')
                console.log('hotline', this.hotline)
            }
        }).catch((error) => {
            this.saveException(error, "getSourceUrlPath")
        });
    }

    /**
     * Get cart
     */
    getCart () {
        StorageUtil.retrieveItem(StorageUtil.CART).then((carts) => {
            if (!Utils.isNull(carts)) {
                this.quantityCart = carts.reduce(this.totalQuantity, 0)
                this.props.getAllCart({
                    carts: carts,
                    quantity: this.quantityCart
                })
            } else {
                this.quantityCart = 0
                this.props.getAllCart({
                    carts: [],
                    quantity: 0
                })
            }
        }).catch((error) => {
            this.saveException(error, 'getCart')
        })
    }

    /**
     * Total quantity
     * @param {*} accumulator 
     * @param {*} item 
     */
    totalQuantity (accumulator, item) {
        return accumulator + item.quantity
    }

    /**
     * Total price
     * @param {*} accumulator 
     * @param {*} item 
     */
    totalPriceCart (accumulator, item) {
        return accumulator + (item.price * item.quantity)
    }

    componentWillMount () {
        console.log("I am Base View", this.props);
        Dimensions.addEventListener('change', this.onChangedOrientation);
    }

    async componentDidMount () {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        this.checkPermission();
        this.createNotificationListeners(); //add this line 
    }

    //1
    async checkPermission () {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //2
    async requestPermission () {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
        }
    }

    //3
    async getToken () {
        let fcmToken = null;
        StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN).then((token) => {
            fcmToken = token
            if (!fcmToken) {
                // Get token
                firebase.messaging().getToken().then((token) => {
                    StorageUtil.storeItem(StorageUtil.FCM_TOKEN, token)
                    this.refreshToken()
                });
                if (fcmToken) {
                    // user has a device token
                    StorageUtil.storeItem(StorageUtil.FCM_TOKEN, fcmToken)
                }
            }
        })
        // Get token when referesh
        firebase.messaging().onTokenRefresh((token) => {
            StorageUtil.storeItem(StorageUtil.FCM_TOKEN, token)
            this.refreshToken()
        });
    }

    /**
     * Refresh token
     */
    refreshToken = () => {
        StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN).then((token) => {
            if (this.props.postUserDeviceInfo && !Utils.isNull(token)) {
                StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
                    if (!Utils.isNull(user) && user.status == statusType.ACTIVE) {
                        // const deviceId = DeviceInfo.getDeviceId();
                        let filter = {
                            deviceId: "",
                            deviceToken: token
                        }
                        this.props.postUserDeviceInfo(filter)
                    }
                }).catch((error) => {
                    //this callback is executed when your Promise is rejected
                    console.log('Promise is rejected with error roles: ' + error);
                });
            } else {
                console.log('token null')
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
        });
    }

    /**
     * Go to notification
     * @param {*} className 
     * @param {*} params 
     * @param {*} isNavigate 
     */
    goToScreen (data) {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user) && user.status == statusType.ACTIVE) {
                if (this, props.navigation) {
                    if (data && data.type && data.type == 10) {
                        this.props.navigation.navigate("Chat");
                    } else {
                        this.props.navigation.navigate("Notification");
                    }
                }
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error roles: ' + error);
        });
    }

    /**
     * Create notification listener
     */
    async createNotificationListeners () {
        /*
         * Triggered for data only payload in foreground
         * */
        this.messageListener = firebase.messaging().onMessage(async (message) => {
            // Process your message as required
            console.log("message base foreground", message);
        });

        /*
         * Triggered when a particular notification has been received in foreground
         * */
        this.notificationListener = firebase.notifications().onNotification(async (notification) => {
            console.log("Notification base foreground", notification);
            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true
            })
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setSubtitle(notification.subtitle)
                .setBody(notification.body)
                .setData(notification.data)
                .android.setSmallIcon('@drawable/ic_notification')
                .android.setPriority(firebase.notifications.Android.Priority.High);
            if (Platform.OS === 'android' && localNotification.android.channelId == null) {
                const channel = new firebase.notifications.Android.Channel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    firebase.notifications.Android.Importance.Max
                ).setDescription('In stock channel');
                // Create the channel
                firebase.notifications().android.createChannel(channel);
                localNotification.android.setChannelId(channel.channelId);
            }
            try {
                await firebase.notifications().displayNotification(localNotification);
                notification.android.setAutoCancel(true)
                this.countNewNotification() // count nti
            } catch (e) {
                console.log('catch', e)
            }
        });

        /*
         * Process your notification as required
         * */
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

        /*
         * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
         * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log("Notification base background", notificationOpen);
            firebase.notifications().removeAllDeliveredNotifications()
            this.countNewNotification() // count nti
            this.goToScreen(notificationOpen.notification.data);
        });

        /*
         * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
         * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            console.log("Notification base closed", notificationOpen);
            StorageUtil.retrieveItem(StorageUtil.NOTIFICATION_ID).then((id) => {
                if (id != notificationOpen.notification.notificationId) {
                    setTimeout(() => {
                        this.goToScreen(notificationOpen.notification.data);
                    }, 1000)
                }
            }).catch((error) => {
                console.log(error)
            })
            StorageUtil.storeItem(StorageUtil.NOTIFICATION_ID, notificationOpen.notification.notificationId);
        }
    }

    /**
     * Register keyboard event
     */
    registerKeyboardEvent () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    /**
     * Handle show keyboard 
     * @param {*} e 
     */
    keyboardWillShow (e) {
        this.setState({keyboardHeight: e.endCoordinates.height});
    }

    /**
     * Handle hide keyboard
     * @param {*} e 
     */
    keyboardWillHide (e) {
        this.setState({keyboardHeight: 0});
    }
}

export default BaseView;
