import React, {Component} from "react";
import {
    ImageBackground, View, StatusBar, Image, TouchableOpacity,
    Alert, WebView, Linking, StyleSheet, RefreshControl,
    TextInput, Dimensions, ScrollView, Keyboard, Platform, ActivityIndicator,
    FlatList, NetInfo, BackHandler
} from "react-native";
import {
    Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text,
    Card, CardItem, Item, Input, Toast, Root, Col, Form, Spinner
} from "native-base";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import {Colors} from "values/colors";
import {Constants} from "values/constants";
import Utils from 'utils/utils';
import {connect} from 'react-redux';
import {StackActions, NavigationActions} from 'react-navigation'
import {ActionEvent, getActionSuccess} from "actions/actionEvent";
import {ErrorCode} from "config/errorCode";
import DateUtil from "utils/dateUtil";
import I18n, {localizes} from "locales/i18n";
import {Fonts} from "values/fonts";
import FlatListCustom from 'components/flatListCustom';
import StringUtil from "utils/stringUtil";
import {filter} from "rxjs/operators";
import moment from 'moment';
import StorageUtil from 'utils/storageUtil';
import {CalendarScreen} from "components/calendarScreen";
import statusType from "enum/statusType";
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-crop-picker';
import {async} from "rxjs/internal/scheduler/async";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import {RNCamera} from 'react-native-camera';
import {Overlay} from 'react-native-elements';
import {configConstants} from 'values/configConstants';
import Server from 'config/Server';


const width = Dimensions.get('window').width
const screen = Dimensions.get('window')
const height = Dimensions.get('window').height
const halfWidth = width / 2;
const halfHeight = height / 2;
const NUM_FACE = 3
export default class FaceDetectionView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            fd: true,
            height: 0,
            width: 0,
            x: 0, y: 0,
            isFinish: false,
            isLoading: false,
            personId: null,
            namePerson: "",
            identify: false,
            confidence: 0,
            userData: null,
        };
        const {type, group, personId, name, nameKey} = this.props.navigation.state.params;
        this.type = type;
        this.name = name;
        this.group = group;
        this.nameKey = nameKey;
        this.personId = personId;
        this.arrayFace = [];
        this.faceDetec = [];
        this.take = null;
        this.center = {
            x: 0,
            y: 0
        }
        this.numFace = 0
        this.firebaseRef = firebase.database();
        this.storage = firebase.storage();
        this.urlsFace = null;
        this.faceId = null;
    }

    componentDidMount () {
        if (this.type == 0) {

        } else {
            // StorageUtil.retrieveItem(StorageUtil.FACE_DETECTION).then((face) => {
            //     if (face != null) {
            //         this.arrayFace = [];
            //         this.arrayFace = face;
            //     }
            // })
        }
    }

    detectFace = (url) => {
        let body = {
            "url": url
        }
        fetch(Server.FACE_API + `detect?returnFaceId=true&recognitionModel=recognition_02&returnRecognitionModel=true&detectionModel=detection_02`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Ocp-Apim-Subscription-Key': configConstants.KEY_FACE_API,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0) {
                    if (responseJson[0].faceId != null) {
                        this.faceId = responseJson[0].faceId
                        console.log("Response after detectFace face zzzzz : ", this.faceId);
                        this.recognizeFace(this.faceId);
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    recognizeFace = (faceId) => {
        let body = {
            "personGroupId": this.group,
            "faceIds": [
                faceId
            ],
            "maxNumOfCandidatesReturned": 1,
            "confidenceThreshold": 0.7
        }
        fetch(Server.FACE_API + `identify`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Ocp-Apim-Subscription-Key': configConstants.KEY_FACE_API,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Response after identify face : ", responseJson);
                if (responseJson.error != null) {
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
                } else {
                    if (responseJson[0].candidates.length > 0) {
                        console.log("Response after identify face : ", responseJson[0].candidates[0]);
                        this.setState({
                            personId: responseJson[0].candidates[0].personId,
                            confidence: responseJson[0].candidates[0].confidence
                        })
                        this.getPersonInfo(responseJson[0].candidates[0].personId)
                    }
                }

            })
            .catch((error) => {
                console.error(error);
            });
    }

    getPersonInfo = (personId) => {
        console.log("getPersonInfo : ", Server.FACE_API + `persongroups/${this.group}/persons/${personId}`);
        fetch(Server.FACE_API + `persongroups/${this.group}/persons/${personId}`, {
            method: 'GET',
            headers: {
                // Accept: 'application/json',
                'Ocp-Apim-Subscription-Key': configConstants.KEY_FACE_API,
                // 'Content-Type': 'application/json',
            },
            // body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Respone after getPersonInfo face : ", responseJson);
                if (responseJson.error != null) {

                } else {
                    this.setState({
                        personId: responseJson.personId,
                        namePerson: responseJson.name,
                        userData: responseJson.userData,
                        identify: true
                    })
                }

            })
            .catch((error) => {
                console.error(error);
            });
    }


    /**
     * TODO: take a picture, then upload pic to FireStore, get url of pic
     * TODO: call api add face to person. Then 
     * 
     */
    /**
     * take a picture
     */
    takePicture = async () => {
        if (this.camera) {
            let option = {
                width: 480,
                height: 720,
                quality: 0.3,
                fixOrientation: true,
                orientation: "portrait"
            }
            this.camera.takePictureAsync(option).then((data) => {
                if (data != null) {
                    console.log(" data take picture react-native-camera zzzzz", data.uri);
                    this.uploadImage(data.uri)
                }

            })
        };
    };

    /**
     * Upload image
     */

    uploadImage = (uri) => {
        let uriArray = uri.split("/");
        let url = uriArray[uriArray.length - 1];
        let fr = this.storage.ref(`face${url}`);
        fr.putFile(uri, {contentType: 'image/jpeg'}).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {

                if (snapshot.state == "success") {
                    fr.getDownloadURL().then((urls) => {
                        console.log("upload image to firebase zzzzz", urls)
                        if (urls != null && urls != this.urlsFace) {
                            this.urlsFace = urls
                            if (this.type == 0) {
                                this.detectFace(urls)
                            } else {
                                this.addFaceToPerson(urls);
                            }
                        }

                    });
                }
            },
            error => {
                setError(error);
            }
        );
    };

    addFaceToPerson = (url) => {
        let body = {
            "url": url
        }
        fetch(Server.FACE_API + `persongroups/${this.group}/persons/${this.personId}/persistedFaces?userData=${this.name}&detectionModel=detection_02`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Ocp-Apim-Subscription-Key': configConstants.KEY_FACE_API,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Response after add face zzzzz : ", responseJson);
                if (Object.keys(responseJson)[0] === "error") {
                    this.showMessage(responseJson.error.message)
                    this.setState({
                        isLoading: false
                    })
                    console.log("Đăng kí khuôn mặt cho perso thât bại zzzzz", responseJson);

                }
                else {
                    console.log("Đăng kí khuôn mặt cho person thành công zzzzz", responseJson);
                    this.updatePersonFireBase(responseJson.persistedFaceId, url)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }


    updatePersonFireBase = (face, url) => {
        let key = this.name.replace(/ /g, "_");
        let data = {
            face: face,
            url: url
        }
        this.firebaseRef.ref(`${this.group}/${this.nameKey}/persistedFaceIds`).push(face).then(() => {
            console.log("Update face lên firebase thành công.");
            // this.showMessage("Update face lên firebase thành công")
            if (this.numFace < NUM_FACE) {
                this.numFace += 1;
                console.log("Upload thành công khuôn mặt thứ: ", this.numFace);
            } else {
                this.setState({
                    isFinish: true
                })
                // this.trainingAPI()
            }
            this.setState({
                isLoading: false
            })
        }).catch((error) => {
            console.log("Data could not be saved.", error);
        });
    }

    trainingAPI = () => {

    }

    handleFaceDetected = () => {

    }



    render () {
        return (
            <View style={{flex: 1}}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    type={RNCamera.Constants.Type.front}

                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}
                    mirrorImage={false}
                    faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
                    faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
                    faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                    onFacesDetected={(face) => {
                        if (this.type != 0) {
                            if (!this.state.isFinish) {
                                if (face.faces.length > 0) {
                                    if (face.faces[0].bounds.size.width > width / 3 && this.state.isLoading == false) {
                                        if (this.numFace < NUM_FACE) {
                                            console.log("FACE DETECTED react-native-camera zzzzz", face);
                                            this.setState({
                                                width: face.faces[0].bounds.size.width,
                                                height: face.faces[0].bounds.size.height,
                                                x: face.faces[0].bounds.origin.x,
                                                y: face.faces[0].bounds.origin.y,
                                                isLoading: true
                                            }, () => {
                                                this.takePicture()
                                            })
                                        } else {
                                            Alert.alert(
                                                localizes('notification'),
                                                "ĐĂng kí xong rồi",
                                                [
                                                    {
                                                        text: 'OK', onPress: () => {
                                                        }
                                                    }
                                                ],
                                                {cancelable: false},
                                            );
                                            this.onBack()
                                        }
                                    } else {
                                        this.setState({
                                            width: 0,
                                            height: 0,
                                            x: 0, y: 0
                                        })
                                    }
                                } else {
                                    this.setState({
                                        width: 0,
                                        height: 0
                                    })
                                }
                            } else {
                                this.onBack()
                                Alert.alert(
                                    localizes('notification'),
                                    "ĐĂng kí xong rồi",
                                    [
                                        {
                                            text: 'OK', onPress: () => {


                                            }
                                        }
                                    ],
                                    {cancelable: false},
                                );

                            }
                        } else {
                            if (face.faces.length > 0) {
                                if (face.faces[0].bounds.size.width > width / 3 && this.state.isLoading == false) {
                                    console.log("FACE DETECTED react-native-camera zzzzz", face);
                                    this.setState({
                                        width: face.faces[0].bounds.size.width,
                                        height: face.faces[0].bounds.size.height,
                                        x: face.faces[0].bounds.origin.x,
                                        y: face.faces[0].bounds.origin.y,
                                        isLoading: true
                                    }, () => {
                                        this.takePicture()
                                    })
                                } else {
                                    this.setState({
                                        width: 0,
                                        height: 0,
                                        x: 0, y: 0
                                    })
                                }
                            }
                        }
                    }}
                />
                {this.renderCircleFace()}
                {this.state.identify ? this.showInfo() : null}
                {/* <View style={{ flex: 0.5, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, left: 0 }}>
                    <TouchableOpacity style={{
                        flex: 0,
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        padding: 15,
                        paddingHorizontal: 20,
                        alignSelf: 'center',
                        margin: 20,
                    }} onPress={() => { this.takePicture() }}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        flex: 0,
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        padding: 15,
                        paddingHorizontal: 20,
                        alignSelf: 'center',
                        margin: 20,
                    }} onPress={() => { clearInterval(this.take) }}>
                        <Text style={{ fontSize: 14 }}> STOP </Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        );
    }

    showInfo () {
        return (
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
                    backgroundColor: Colors.COLOR_WHITE, height: 400, width: screen.width - 100
                }}>
                    <Text style={{fontSize: Fonts.FONT_SIZE_X_MEDIUM}}>Name: {this.state.namePerson}</Text>
                    <Text style={{fontSize: Fonts.FONT_SIZE_X_MEDIUM}}>Id: {this.state.personId}</Text>
                    <Text style={{fontSize: Fonts.FONT_SIZE_X_MEDIUM}}>userData: {this.state.userData}</Text>
                    <Text style={{fontSize: Fonts.FONT_SIZE_X_MEDIUM}}>Confidence: {this.state.confidence}</Text>
                </View>
            </View>
        );
    }

    renderBackground () {
        return (
            <View style={{
                flex: 1, flexDirection: 'row', position: 'absolute',
                backgroundColor: 'transparent', width: width, height: height
            }}>
                <View style={{
                    flex: 1, position: 'absolute',
                    bottom: height * 0.3, left: width * 0.2,
                    borderTopLeftRadius: width * 0.6,
                    borderTopRightRadius: width * 0.6,
                    borderBottomLeftRadius: width * 0.6,
                    borderBottomRightRadius: width * 0.6,
                    borderWidth: 5, borderColor: Colors.COLOR_ORANGE,
                    backgroundColor: 'transparent', width: width * 0.6, height: height * 0.4,
                }}>
                </View>
            </View>
        );
    }

    renderCircleFace () {
        return (
            <View style={{
                position: 'absolute',
                borderWidth: 5, borderColor: Colors.COLOR_SKY_BLUE,
                marginTop: this.state.y,
                left: this.state.x,
                backgroundColor: 'transparent', width: this.state.width, height: this.state.height,
            }}>
            </View>
        );
    }
}