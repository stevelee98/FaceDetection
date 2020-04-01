import React, { Component } from 'react';
import {
    ImageBackground, View, StatusBar, Image, TouchableWithoutFeedback, BackHandler, Alert, Linking, RefreshControl, StyleSheet,
    Slider, TextInput, Dimensions, FlatList, TouchableHighlight, TouchableOpacity, ScrollView, Platform, PermissionsAndroid, Keyboard
} from 'react-native';
import {
    Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Form, Picker, Root,
} from 'native-base';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ic_back_model from 'images/ic_back_model.png';
import ic_next_white from 'images/ic_next_white.png';
import commonStyles from 'styles/commonStyles';
import BaseView from 'containers/base/baseView';
import TextInputCustom from 'components/textInputCustom';
import ModalDropdown from 'components/dropdown';
import I18n, { localizes } from 'locales/i18n';
import StringUtil from 'utils/stringUtil';
import { Fonts } from 'values/fonts';
import moment from 'moment';
import FlatListCustom from 'components/flatListCustom';
import DateUtil from 'utils/dateUtil';
import ImageLoader from 'components/imageLoader';
import styles from '../info/styles';
import ic_camera_fill_grey from 'images/ic_camera_fill_grey.png';
import Utils from 'utils/utils';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import StorageUtil from 'utils/storageUtil';
import { ErrorCode } from 'config/errorCode';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { CalendarScreen } from 'components/calendarScreen';
import Dialog, { DIALOG_WIDTH } from 'components/dialog';
import DialogCustom from 'components/dialogCustom';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';
import Upload from 'react-native-background-upload';
import ic_calendar_black from '/images/ic_calendar_black.png';
import { ServerPath } from 'config/Server';
import HeaderGradient from 'containers/common/headerGradient.js';

const screen = Dimensions.get('window');
const SIZE_IMAGE = 112;
const CANCEL_INDEX = 2;
const FILE_SELECTOR = [
    localizes('camera'),
    localizes('image'),
    localizes('cancel'),
];
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
const optionsCamera = {
    title: 'Select avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
const minChooseDay = "01/01/1900";
var minDay = DateUtil.getTimestamp(DateUtil.convertFromFormatToFormat(
    moment(minChooseDay, 'DD-MM-YYYY'), DateUtil.FORMAT_DATE, DateUtil.FORMAT_DATE_TIME_ZONE_T));
var toDay = DateUtil.getTimestamp(DateUtil.convertFromFormatToFormat(
    moment(DateUtil.now(), 'DD-MM-YYYY').add(-1, 'days'), DateUtil.FORMAT_DATE, DateUtil.FORMAT_DATE_TIME_ZONE_T));


class EditProfileView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            visibleDialog: false,
            avatar: null,
            source: '',
            name: '',
            phone: '',
            email: '',
            personalID: '',
            address: '',
            dateOfBirth: '',
            user: null,
            avatarTemp: null,
        };
        this.userInfo = null;
    }
    componentDidUpdate = (prevProps, prevState) => { };

    componentWillMount = () => {
        this.getSourceUrlPath();
        this.getProfile();
    };

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        console.log('Data pass', data);
        if (data != null && this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    this.userInfo = data;
                    this.handleGetProfile(this.userInfo);
                    // if (!Utils.isNull(data)) {
                    //   console.log('Avatar Path: ', !Utils.isNull(data.avatarPath));
                    //   this.state.source =
                    //     !Utils.isNull(data.avatarPath) &&
                    //     data.avatarPath.indexOf('http') != -1
                    //       ? data.avatarPath
                    //       : this.resourceUrlPathResize.textValue + '=' + data.avatarPath;
                    // }
                } else if (this.props.action == getActionSuccess(ActionEvent.EDIT_PROFILE)) {
                    this.getSourceUrlPath();
                    this.getProfile();
                    this.showMessage(localizes('userProfileView.edit_infor_success'));
                    this.props.navigation.pop();
                }
            } else {
                this.showMessage("Số điện thoại này đã tồn tại");
            }
        } else {
            this.handleError(this.props.errorCode, this.props.error);
        }
    }

    /**
     * Get profile user
     */
    getProfile() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
            .then(user => {
                if (!Utils.isNull(user)) {
                    this.userInfo = user;
                    this.props.getUserProfile(user.id);
                    this.handleGetProfile(user);
                }
            })
            .catch(error => {
                //this callback is executed when your Promise is rejected
                this.saveException(error, 'getProfile');
            });
    }

    /**
     * Handle get profile
     */
    handleGetProfile(user) {
        this.setState({
            user: user,
            avatar: user.avatar,
            name: user.name,
            phone: user.phone,
            email: user.email,
            personalID: user.personalID,
            address: user.address,
            dateOfBirth: !Utils.isNull(user.birthDate)
                ? DateUtil.convertFromFormatToFormat(user.birthDate, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE) : null,
        });
    }

    /**
     * Render file selection dialog
     */
    renderFileSelectionDialog() {
        return (
            <DialogCustom
                visible={this.state.visibleDialog}
                isVisibleTitle={true}
                isVisibleContentForChooseImg={true}
                contentTitle={'Chọn hình ảnh'}
                contentText={localizes('slidingMenu.want_out')}
                onTouchOutside={() => {
                    this.setState({ visibleDialog: false });
                }}
                onPressX={() => {
                    this.setState({ visibleDialog: false });
                }}
                onPressCamera={() => {
                    this.onSelectedType(0);
                }}
                onPressGallery={() => {
                    this.onSelectedType(1);
                }}
            />
        );
    }

    /**
     * Show calendar date
     */
    showCalendarDate() {
        this.showCalendar.showDateTimePicker();
    }

    /**
     * Date press
     */
    chooseDate(day) {
        this.setState({
            dateOfBirth: DateUtil.convertFromFormatToFormat(
                day,
                DateUtil.FORMAT_DATE_TIME_ZONE_T,
                DateUtil.FORMAT_DATE,
            ),
        });
    }

    componentWillUpdate(nextProps, nextState) { }

    componentWillUnmount = () => { };

    render() {
        const { avatar, name, phone, email, personalID, dateOfBirth, address, user } = this.state;
        let height = Platform.OS === 'ios' ? Constants.STATUS_BAR_HEIGHT : 0;
        return (
            <Container
                style={[styles.container, { backgroundColor: Colors.COLOR_WHITE }]}>
                <Root>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}>
                        <HeaderGradient
                            visibleStage={false}
                            onBack={this.onBack}
                            title={localizes("userProfileView.editProfile")}
                            renderRightMenu={this.renderRightMenu}>
                        </HeaderGradient>
                        <Content contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                            <Form
                                style={{
                                    flex: 1,
                                    backgroundColor: Colors.COLOR_WHITE,
                                    borderRadius: Constants.CORNER_RADIUS,
                                    paddingTop: Constants.PADDING_X_LARGE,
                                }}>
                                {this.renderHeaderUser()}
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        marginTop: Constants.MARGIN_X_LARGE,
                                    }}>
                                    <TextInputCustom
                                        refInput={r => (this.name = r)}
                                        textAlignInput="left"
                                        isMultiLines={true}
                                        myBackgroundColor={Colors.COLOR_WHITE}
                                        styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                        placeholder={'Nhập họ tên của bạn'}
                                        placeholderTextColor={Colors.COLOR_DRK_GREY}
                                        onChangeText={text => {
                                            this.setState({ name: text });
                                        }}
                                        inputNormalStyle={styles.inputNormalStyle}
                                        styleInputGroup={styles.styleInputGroup}
                                        borderBottomWidth={Constants.BORDER_WIDTH}
                                        value={name}
                                        returnKeyType={'next'}
                                        autoCapitalize={'words'}
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                            //Utils.isNull(user.phone) ? this.phone.focus() : this.dateOfBirth.focus();
                                        }}
                                    />
                                    <TextInputCustom
                                        refInput={r => (this.phone = r)}
                                        textAlignInput="left"
                                        isInputNormal={true}
                                        myBackgroundColor={Colors.COLOR_WHITE}
                                        styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                        placeholder={'Nhập số điện thoại của bạn'}
                                        placeholderTextColor={Colors.COLOR_DRK_GREY}
                                        onChangeText={text => {
                                            this.setState({ phone: text });
                                        }}
                                        inputNormalStyle={styles.inputNormalStyle}
                                        styleInputGroup={styles.styleInputGroup}
                                        borderBottomWidth={Constants.BORDER_WIDTH}
                                        value={phone}
                                        returnKeyType={'next'}
                                        keyboardType={'phone-pad'}
                                        editable={Utils.isNull(user) ? false : Utils.isNull(user.phone) ? true : false}
                                        onSubmitEditing={() => {
                                            Utils.isNull(user.dateOfBirth) ? this.dateOfBirth.focus() : this.address.focus();
                                        }}
                                    />
                                    {/* Day Of Birth */}
                                    <View style={{ justifyContent: 'center', position: 'relative', marginVertical:Constants.MARGIN_X_LARGE }}>
                                        <TextInputCustom
                                            textAlignInput="left"
                                            refInput={r => (this.dateOfBirth = r)}
                                            isInputMask={true}
                                            myBackgroundColor={Colors.COLOR_WHITE}
                                            styleTextInput={{ marginTop: Constants.MARGIN_X_LARGE }}
                                            placeholder={'--/--/----'}
                                            placeholderTextColor={Colors.COLOR_DRK_GREY}
                                            onChangeText={dateOfBirth => {
                                                this.setState({ dateOfBirth });
                                            }}
                                            value={dateOfBirth}
                                            textAlignInput="left"
                                            inputNormalStyle={[styles.inputNormalStyle, { marginBottom: Constants.MARGIN_12 }]}
                                            borderBottomWidth={Constants.BORDER_WIDTH}
                                            keyboardType="phone-pad"
                                            onFocus={() => this.showCalendarDate()}
                                            typeFormat={'datetime'}
                                            options={{
                                                format: 'DD/MM/YYYY'
                                            }}
                                            returnKeyType={'next'}
                                            onSubmitEditing={() => {
                                                this.address.focus();
                                            }}
                                        />
                                        <TouchableHighlight
                                            onPress={() => { this.showCalendarDate() }}
                                            style={[commonStyles.shadowOffset,
                                            { position: 'absolute', right: Constants.PADDING_LARGE * 3, bottom: Constants.MARGIN_LARGE }
                                            ]}
                                            underlayColor='transparent'>
                                            <Image style={{ resizeMode: 'contain' }}
                                                source={ic_calendar_black} />
                                        </TouchableHighlight>
                                    </View>
                                    <TextInputCustom
                                        refInput={r => (this.address = r)}
                                        textAlignInput="left"
                                        isMultiLines={true}
                                        placeholder={'Nhập địa chỉ của bạn'}
                                        placeholderTextColor={Colors.COLOR_DRK_GREY}
                                        onChangeText={text => {
                                            this.setState({ address: text });
                                        }}
                                        inputNormalStyle={styles.inputNormalStyle}
                                        styleInputGroup={styles.styleInputGroup}
                                        borderBottomWidth={Constants.BORDER_WIDTH}
                                        value={address}
                                        returnKeyType={'next'}
                                    />
                                </View>
                                {/* Button save */}
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                    }}>
                                    {/* button change */}
                                    <View style={{ flexDirection: 'row', margin: Constants.MARGIN_X_LARGE }}>
                                        {this.renderCommonButton(
                                            'Thay đổi',
                                            { color: Colors.COLOR_WHITE },
                                            [
                                                commonStyles.shadowOffset,
                                                {
                                                    flex: 1,
                                                    marginHorizontal: Constants.MARGIN_X_LARGE,
                                                    marginTop: 2 * Constants.MARGIN_X_LARGE,
                                                    marginBottom: Constants.MARGIN_LARGE,
                                                },
                                            ],
                                            () => {
                                                this.onEditData({
                                                    name,
                                                    phone,
                                                    address,
                                                    dateOfBirth,
                                                });
                                            },
                                        )}
                                    </View>
                                    {/* button cancel */}
                                    <View style={{
                                        flexDirection: 'row',
                                        marginLeft: Constants.MARGIN_X_LARGE,
                                        marginRight: Constants.MARGIN_X_LARGE,
                                        marginBottom: Constants.MARGIN_XX_LARGE,
                                        borderRadius: Constants.MARGIN_24,
                                        borderWidth: Constants.DIVIDE_HEIGHT_SMALL,
                                        borderColor: Colors.COLOR_GRAY,
                                    }}>
                                        <TouchableHighlight
                                            onPress={() => {
                                                this.props.navigation.pop()
                                            }}
                                            style={[{
                                                flex: 1, padding: Constants.PADDING,
                                            }, commonStyles.viewCenter,]}
                                            underlayColor={Colors.COLOR_SHADOW}>
                                            <Text style={[commonStyles.textBold, commonStyles.text]}>Hủy</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </Form>
                        </Content>
                        <CalendarScreen
                            maximumDate={
                                new Date(new Date().setDate(DateUtil.now().getDate() - 1))
                            }
                            dateCurrent={
                                DateUtil.convertFromFormatToFormat(
                                    !Utils.isNull(dateOfBirth) ? this.userInfo.birthDate : DateUtil.now(),
                                    DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_TIME_ZONE_T)
                            }
                            chooseDate={this.chooseDate.bind(this)}
                            ref={ref => (this.showCalendar = ref)}
                        />
                    </View>
                    {this.renderFileSelectionDialog()}
                </Root>
            </Container>
        );
    }

    /**
     * edit data & validation
     */
    onEditData = userEdited => {
        const { avatar, name, phone, address, dateOfBirth, } = userEdited;
        let currentDay = DateUtil.getTimestamp(DateUtil.convertFromFormatToFormat(
            moment(dateOfBirth, 'DD-MM-YYYY'), DateUtil.FORMAT_DATE, DateUtil.FORMAT_DATE_TIME_ZONE_T));
        let differenceDay = currentDay - minDay;

        if (Utils.isNull(name) || name.trim().length == 0) {
            this.showMessage(localizes('register.vali_fill_fullname'));
        } else if (StringUtil.validSpecialCharacter(name)) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (name.length > 60) {
            this.showMessage(localizes('register.vali_fullname_length'));
        } else if (!Utils.validatePhone(phone) && !(Utils.isNull(phone))) {
            this.showMessage(localizes("register.errorPhone"));
        } else if (Utils.isNull(phone)) {
            this.showMessage(localizes("login.vali_phone"));
        } else if (Utils.isNull(dateOfBirth)) {
            this.showMessage(localizes('register.vali_fill_dayOfBirth'));
        } else if (!Utils.validateDate(dateOfBirth) || currentDay / 1 > toDay / 1 || !(differenceDay / -1 <= 0)) {
            this.showMessage(localizes('register.vali_dayOfBirth'));
        } else {
            let editData = {
                name: name.trim(),
                phone: phone,
                address: address,
                birthDate: DateUtil.convertFromFormatToFormat(
                    moment(dateOfBirth, 'DD-MM-YYYY').add(1, 'days'),
                    DateUtil.FORMAT_DATE,
                    DateUtil.FORMAT_DATE_TIME_ZONE,
                ),
            };
            this.uploadImage();
            this.props.editProfile(editData);
        }
    };

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
            visibleDialog: true,
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
            this.hideDialog();
        }
    }

    /**
     * hide dialog
     */
    hideDialog() {
        this.setState({
            visibleDialog: false,
        });
    }

    /**
     * Take a photo
     */
    takePhoto = async () => {
        const hasCameraPermission = await this.hasPermission(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (!hasCameraPermission) return;

        ImagePicker.launchCamera(optionsCamera, response => {
            const { error, uri, originalRotation, didCancel } = response;
            this.hideDialog();
            if (uri && !error) {
                let rotation = this.rotateImage(originalRotation);
                ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80, rotation)
                    .then(({uri}) => {
                        this.setState({
                            avatarTemp: uri,
                        });
                    })
                    .catch(err => {
                    console.log(err);
            });
            } else if (error) {
                console.log('The photo picker errored. Check ImagePicker.launchCamera func');
                console.log(error);
            }
        });
    };

    getExtension = (filename) => {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    /**
     * Show document picker
     */
    showDocumentPicker = async fileType => {
        const hasCameraPermission = await this.hasPermission(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (!hasCameraPermission) return;

        ImagePicker.launchImageLibrary(optionsCamera, response => {
            const { error, uri, originalRotation, didCancel } = response;
            this.hideDialog();
            if (uri && !error) {
                let rotation = 0;
                this.setState({
                    avatarTemp: uri,
                });
                // ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80, rotation)
                //     .then(({ uri }) => {
                //         this.setState({
                //             avatarTemp: uri,
                //         });
                //     })
                //     .catch(err => {
                //         console.log(err);
                //     });
            } else if (error) {
                console.log(
                    'The photo picker errored. Check ImagePicker.launchCamera func',
                );
                console.log(error);
            }
        });
    };

    /**
     * Upload image
     */
    uploadImage() {
        const { avatarTemp } = this.state;
        if (!Utils.isNull(avatarTemp)) {
            let uriReplace = avatarTemp;
            if (Platform.OS == 'android') {
                uriReplace = avatarTemp.replace('file://', '');
            }
            let file = {
                fileType: 'image/*',
                filePath: uriReplace,
            };
            console.log('URI: ', file.filePath);
            const options = {
                url: ServerPath.API_URL + 'user/upload/avatar',
                path: file.filePath,
                method: 'POST',
                field: 'file',
                type: 'multipart',
                headers: {
                    'Content-Type': 'application/json', // Customize content-type
                    'X-APITOKEN': global.token,
                },
            };
            Upload.startUpload(options)
                .then(uploadId => {
                    console.log('Upload started');
                    Upload.addListener('progress', uploadId, data => {
                        console.log(`Progress: ${data.progress}%`);
                    });
                    Upload.addListener('error', uploadId, data => {
                        console.log(`Error: ${data.error}%`);
                    });
                    Upload.addListener('cancelled', uploadId, data => {
                        console.log(`Cancelled!`);
                    });
                    Upload.addListener('completed', uploadId, data => {
                        // data includes responseCode: number and responseBody: Object
                        console.log('Completed!');
                        if (!Utils.isNull(data.responseBody)) {
                            let result = JSON.parse(data.responseBody);
                            console.log(
                                'Hello!' +
                                this.resourceUrlPathResize.textValue +
                                '=' +
                                result.data,
                            );
                            if (!Utils.isNull(result.data)) {
                                this.setState({
                                    source:
                                        this.resourceUrlPathResize.textValue + '=' + result.data,
                                });
                            }
                        }
                    });
                })
                .catch(error => {
                    this.saveException(error, 'uploadImage');
                });
        }
    }

    /**
     * Rotate image
     */
    rotateImage(orientation) {
        let degRotation;
        switch (orientation) {
            case 90:
                degRotation = 90;
                break;
            case 270:
                degRotation = -90;
                break;
            case 180:
                degRotation = 180;
                break;
            default:
                degRotation = 0;
        }
        return degRotation;
    }

    /**
     * Set file path into {state} when selected file successfully
     */
    setSourceFromFileSelector = avatar => {
        this.setState({
            source: avatar,
            visibleDialog: false,
        });
    };

    /**
      * Render right menu
      */
    renderRightMenu = () => {
        return (
            <View style={{ paddingHorizontal: Constants.MARGIN_X_LARGE }}></View>
        )
    }

    /**
     * Render header user
     */
    renderHeaderUser = () => {
        const { source, attachFile, avatarTemp } = this.state;
        return (
            <View
                style={{
                    flexDirection: 'column',
                    marginHorizontal: Constants.MARGIN,
                    marginBottom: Constants.MARGIN_X_LARGE,
                }}>
                {/* Avatar */}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={this.attachFile}>
                        <View style={{ position: 'relative' }}>
                            {Utils.isNull(avatarTemp) ? (
                                this.userInfo && !Utils.isNull(this.userInfo.avatarPath) && this.userInfo.avatarPath.indexOf('http') != -1 ?
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
                                        path={this.userInfo ? this.resourceUrlPathResize.textValue + "=" + this.userInfo.avatarPath : ""}
                                    />
                            ) : (
                                    <Image
                                        source={{ uri: avatarTemp }}
                                        style={[styles.imageSize]}
                                        resizeMode={'cover'}
                                    />
                                )}
                            <View
                                style={{
                                    ...commonStyles.viewCenter,
                                    ...commonStyles.position0,
                                    backgroundColor: Colors.COLOR_WHITE,
                                    width: SIZE_IMAGE / 4,
                                    height: SIZE_IMAGE / 4,
                                    borderRadius: SIZE_IMAGE / 8,
                                    marginTop: SIZE_IMAGE - Constants.MARGIN_XX_LARGE,
                                    marginLeft: SIZE_IMAGE / 2 + Constants.MARGIN_XX_LARGE,
                                }}>
                                <Image
                                    source={ic_camera_fill_grey}
                                    style={{ width: 24, height: 24 }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}

const mapStateToProps = state => ({
    data: state.userProfile.data,
    action: state.userProfile.action,
    isLoading: state.userProfile.isLoading,
    error: state.userProfile.error,
    errorCode: state.userProfile.errorCode,
    screen: state.userProfile.screen,
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileView);
