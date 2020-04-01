
import React, {Component} from 'react';
import {View, TextInput, Image, StyleSheet, Text, ImageBackground, TouchableOpacity, TouchableHighlight, Keyboard, SafeAreaView, BackHandler, Dimensions, NativeModules, NativeEventEmitter, Alert} from 'react-native';
import {Container, Form, Content, Item, Input, Button, Right, Icon, Header, Root, Left, Body, Title, Toast} from 'native-base';
import StringUtil from 'utils/stringUtil';
import styles from '../login/styles';
import {localizes} from 'locales/i18n';
import BaseView from "containers/base/baseView";
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
import {StackActions, NavigationActions} from 'react-navigation'
import {ActionEvent, getActionSuccess} from 'actions/actionEvent';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import {AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginButton} from 'react-native-fbsdk';
import GenderType from 'enum/genderType';
import statusType from 'enum/statusType';
import screenType from 'enum/screenType';
import firebase from 'react-native-firebase';
import bannerType from 'enum/bannerType';
import TextInputCustom from 'components/textInputCustom';
import {configConstants} from 'values/configConstants';
import {colors} from 'containers/demo/styles/index.style';
import DialogCustom from 'components/dialogCustom';
import DateUtil from 'utils/dateUtil';
import Upload from 'react-native-background-upload'
import ImagePicker from "react-native-image-picker";
import moment from 'moment';
import Server from 'config/Server';

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default class CreatePersonGroup extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            loading: false
        }
        this.firebaseRef = firebase.database();
        this.personGroup = "";
        this.personId = null;
    }

    componentDidMount () {
        // super.componentDidMount();

    }

    render () {
        return (
            <Root>
                <View style={[styles.container]}>
                    <Text style={{marginBottom: 50, color: Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_X_MEDIUM, }}>Nhập id group của bạn - hoặc tạo mới</Text>
                    <TextInput
                        placeholder={"Nhập tên group"}
                        placeholderTextColor={Colors.COLOR_BACKGROUND}
                        returnKeyType={"done"}
                        style={[commonStyles.textBold, {
                            color: Colors.COLOR_WHITE,
                            elevation: 0,
                            paddingHorizontal: Constants.PADDING_X_LARGE,
                            margin: 0,
                            marginHorizontal: Constants.MARGIN_X_LARGE,
                            // height: Constants.HEIGHT_INPUT * 2,
                            width: deviceWidth - Constants.MARGIN_XX_LARGE * 3.5,
                            fontSize: Fonts.FONT_SIZE_XX_LARGE,
                            textAlign: "center",
                            paddingVertical: Constants.PADDING_LARGE,
                        }]}
                        value={this.state.name}
                        onChangeText={
                            name => {
                                this.setState({
                                    name: name,
                                })
                            }
                        }
                        autoCapitalize={"none"}
                        underlineColorAndroid={Colors.COLOR_BACKGROUND}
                    />
                </View>
                {this.state.name != null ?
                    <TouchableOpacity
                        onPress={() => {
                            this.createGroup();
                            this.setState({
                                loading: true
                            })
                        }}
                        style={{
                            position: 'absolute',
                            alignItems: 'center',
                            backgroundColor: Colors.COLOR_WHITE,
                            paddingVertical: Constants.PADDING_LARGE,
                            paddingHorizontal: Constants.PADDING_X_LARGE + 8,
                            borderRadius: Constants.CORNER_RADIUS / 2,
                            bottom: Constants.MARGIN_XX_LARGE + 16, right: Constants.MARGIN_XX_LARGE + 16
                        }}>
                        <Text style={[commonStyles.textBold, {fontSize: Fonts.FONT_SIZE_XX_LARGE}]}> > </Text>
                    </TouchableOpacity> : null}
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("InputGroupForRecognize", {type: 0})
                    }}
                    style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        // backgroundColor: Colors.COLOR_WHITE,
                        paddingVertical: Constants.PADDING_LARGE,
                        paddingHorizontal: Constants.PADDING_X_LARGE + 8,
                        // borderRadius: Constants.CORNER_RADIUS / 2,
                        bottom: Constants.MARGIN_XX_LARGE + 32,
                    }}>
                    <Text style={[commonStyles.textBold, {fontSize: Fonts.FONT_SIZE_MEDIUM}]}> nhận diện bạn </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("InputGroupForRecognize", {type: 1})
                    }}
                    style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        // backgroundColor: Colors.COLOR_WHITE,
                        paddingVertical: Constants.PADDING_LARGE,
                        paddingHorizontal: Constants.PADDING_X_LARGE + 8,
                        // borderRadius: Constants.CORNER_RADIUS / 2,
                        bottom: Constants.MARGIN_X_LARGE,
                    }}>
                    <Text style={[commonStyles.textBold, {fontSize: Fonts.FONT_SIZE_MEDIUM}]}>training API</Text>
                </TouchableOpacity>
                {this.showLoadingBar(this.state.loading)}
            </Root>
        );
    }

    createGroup = () => {
        let body = {
            "name": this.state.name,
            "userData": "boot data",
            "recognitionModel": "recognition_02"
        }
        console.log("BODY REQUEST FACE API: ", body)
        fetch(Server.FACE_API + `persongroups/${this.state.name.replace(/ /g, "_")}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Ocp-Apim-Subscription-Key': configConstants.KEY_FACE_API,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            console.log("Response after create persongroup: ", response);
            if (response.status == 200) {
                let data = {
                    [`${this.state.name}`]: {
                        "groupName": this.state.name
                    },
                }
                this.firebaseRef.ref().update(data).then(() => {
                    console.log("Data saved successfully.");
                    this.setState({
                        loading: false
                    }, () => {
                        this.props.navigation.navigate("AddPerson", {group: this.state.name.replace(/ /g, "_")})
                    })
                    Keyboard.dismiss();
                }).catch((error) => {
                    this.setState({
                        loading: false
                    }, () => {
                        Alert.alert(
                            "OOPPP",
                            "Có cái gì đó không đúng rồi ",
                            [
                                {
                                    text: 'OK', onPress: () => {
                                    }
                                }
                            ],
                            {cancelable: false},
                        );
                    });
                    console.log("Data could not be saved.", error);
                });


            } else {
                if (response.status == 409) {
                    this.setState({
                        loading: false
                    }, () => {
                        this.props.navigation.navigate("AddPerson", {group: this.state.name.replace(/ /g, "_")})
                    })
                } else {
                    this.setState({
                        loading: false
                    }, () => {
                        Alert.alert(
                            "OOPPP",
                            "Có cái gì đó không đúng rồi ",
                            [
                                {
                                    text: 'OK', onPress: () => {
                                    }
                                }
                            ],
                            {cancelable: false},
                        );
                    });
                }
            }
        })
            .catch((error) => {
                console.error(error);
            });
    }
}

