'use strict';
import React, {Component} from 'react';
import {View, TextInput, Image, StyleSheet, Text, ImageBackground, TouchableOpacity, TouchableHighlight, Keyboard, SafeAreaView, BackHandler, Dimensions, NativeModules, NativeEventEmitter} from 'react-native';
import {Container, Form, Content, Item, Input, Button, Right, Icon, Header, Root, Left, Body, Title, Toast} from 'native-base';
import ButtonComp from 'components/button';
import StringUtil from 'utils/stringUtil';
import cover from 'images/bg_launch.png';
import styles from './styles';
import {localizes} from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import {connect} from 'react-redux';
import commonStyles from 'styles/commonStyles';
import {Fonts} from 'values/fonts';
import {Constants} from 'values/constants';
import {Colors} from 'values/colors';
import {ErrorCode} from 'config/errorCode';
import Utils from 'utils/utils';
import StorageUtil from 'utils/storageUtil';
import {dispatch} from 'rxjs/internal/observable/pairs';
import {NavigationActions} from 'react-navigation'
import {ActionEvent, getActionSuccess} from 'actions/actionEvent';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import {AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginButton} from 'react-native-fbsdk';
import GenderType from 'enum/genderType';
import {StackActions} from 'react-navigation';
import ic_facebook_login from 'images/ic_facebook_login.png'
import ic_zalo_login from 'images/ic_zalo_login.png'
import statusType from 'enum/statusType';
import screenType from 'enum/screenType';
// import firebase from 'react-native-firebase';
import bannerType from 'enum/bannerType';
import TextInputCustom from 'components/textInputCustom';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import {configConstants} from 'values/configConstants';
import {colors} from 'containers/demo/styles/index.style';
import LinearGradient from "react-native-linear-gradient";
import BackgroundCustom from 'components/backgroundCustom';
import DialogCustom from 'components/dialogCustom';
import LoginDialogCustom from './loginDialogCustom';
// import RNZalo from 'rn-zalo';
import DateUtil from 'utils/dateUtil';
import Upload from 'react-native-background-upload'
import ImagePicker from "react-native-image-picker";
import moment from 'moment';
// import {RNZaloLogin, RNZBridgeEmitter} from 'react-native-zalo-login';


// var ImagePicker = require('react-native-image-picker');

// More info on all the options is below in the README...just some common use cases shown here

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

class LoginView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            filePath: null,
            nameRecog: "",
            groupName: null,
            idRecog: ""
        }
    }

    /*** */
    Splash () {
        this.props.navigation.navigate('Login')
    }

    async componentDidMount () {
        super.componentDidMount();

    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    componentWillUnmount () {
        super.componentWillUnmount();
    }

    /**
      * Handle data when request
      */
    handleData () {
        let data = this.props.data;

    }

    renderRightHeader = () => {
        return (
            <View style={{padding: Constants.PADDING_X_LARGE + Constants.PADDING}} />
        )
    }

    render () {
        console.log('Render login')
        const {user, groupName} = this.state;
        return (
            <View style={[styles.container]}>
                {groupName != null ? <Text>Group name: {groupName}</Text> : null}
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("FaceDetection", {type: 0})
                    }}
                    style={{
                        width: deviceWidth * 0.7,
                        alignItems: 'center',
                        marginVertical: Constants.MARGIN_X_LARGE, backgroundColor: Colors.COLOR_WHITE, paddingVertical: Constants.PADDING_LARGE, paddingHorizontal: Constants.PADDING_XX_LARGE, borderRadius: Constants.CORNER_RADIUS / 2
                    }}>
                    <Text>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.showDocumentPicker();
                    }}
                    style={{
                        width: deviceWidth * 0.7,
                        alignItems: 'center',
                        marginVertical: Constants.MARGIN_X_LARGE, backgroundColor: Colors.COLOR_WHITE, paddingVertical: Constants.PADDING_LARGE, paddingHorizontal: Constants.PADDING_XX_LARGE, borderRadius: Constants.CORNER_RADIUS / 2
                    }}>
                    <Text>Nhận diện khuôn mặt</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    onPress={() => {
                        this.showDocumentPicker();
                    }}
                    style={{
                        width: deviceWidth * 0.7,
                        alignItems: 'center',
                        marginVertical: Constants.MARGIN_X_LARGE, backgroundColor: Colors.COLOR_WHITE, paddingVertical: Constants.PADDING_LARGE, paddingHorizontal: Constants.PADDING_XX_LARGE, borderRadius: Constants.CORNER_RADIUS / 2
                    }}>
                    <Text>Tải hình ảnh lên</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("RegisterFace", {type: 0});
                    }}
                    style={{
                        width: deviceWidth * 0.7,
                        alignItems: 'center',
                        marginVertical: Constants.MARGIN_X_LARGE, backgroundColor: Colors.COLOR_WHITE, paddingVertical: Constants.PADDING_LARGE, paddingHorizontal: Constants.PADDING_XX_LARGE, borderRadius: Constants.CORNER_RADIUS / 2
                    }}>
                    <Text>Gia nhập nào</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("RegisterFace", {type: 1, callBack: this.onCreateGroup});
                    }}
                    style={{
                        width: deviceWidth * 0.7,
                        alignItems: 'center',
                        marginVertical: Constants.MARGIN_X_LARGE, backgroundColor: Colors.COLOR_WHITE, paddingVertical: Constants.PADDING_LARGE, paddingHorizontal: Constants.PADDING_XX_LARGE, borderRadius: Constants.CORNER_RADIUS / 2
                    }}>
                    <Text>Tạo group</Text>
                </TouchableOpacity>
            </View>

        )
    }

    onCreateGroup = (name) => {
        this.setState({
            groupName: name
        })
    }



    /**
   * Show document picker
   */
    showDocumentPicker = async fileType => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('You cancelled image picker 😟');
            } else if (response.error) {
                alert('And error occured: ', response.error);
            } else {
                const source = {uri: response.uri};
                console.log("URI IMAGE PICKER: ", response.uri)
                this.setState({
                    filePath: response.uri
                });
                // let uriArray = response.uri.split("/");
                // let url = uriArray[uriArray.length - 1];
                // let fr = FireBaseStorage.ref(`face${url}`);
                // fr.putFile(response.uri, { contentType: 'image/jpeg' }).on(
                //     storage.TaskEvent.STATE_CHANGED,
                //     snapshot => {
                //         console.log("FIRE BASE SNAPSHOT", snapshot)
                //         if (snapshot.state == "success") {
                //             fr.getDownloadURL().then((urls) => {
                //                 console.log(urls);
                //             });
                //         }
                //     },
                //     error => {
                //         setError(error);
                //     }
                // );

            }
        });

        // ImagePicker.launchImageLibrary(optionsCamera, response => {
        //     const { error, uri, originalRotation, didCancel } = response;
        //     this.hideDialog();
        //     if (uri && !error) {
        //         console.log("URI IMAGE PICKER: ", uri)
        //         this.setState({
        //             filePath: uri
        //         })
        //     } else if (error) {
        //         console.log("The photo picker errored. Check ImagePicker.launchCamera func")
        //         console.log(error)
        //     }
        // });
    };
}

const mapStateToProps = state => ({
    data: state.login.data,
    isLoading: state.login.isLoading,
    error: state.login.error,
    errorCode: state.login.errorCode,
    action: state.login.action
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
