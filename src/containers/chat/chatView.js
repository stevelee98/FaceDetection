import React, { Component } from "react";
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
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import Utils from 'utils/utils';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation'
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import DateUtil from "utils/dateUtil";
import styles from "./styles";
import I18n, { localizes } from "locales/i18n";
import { Fonts } from "values/fonts";
import FlatListCustom from 'components/flatListCustom';
import StringUtil from "utils/stringUtil";
import { filter } from "rxjs/operators";
import moment from 'moment';
import ic_send_image from 'images/ic_send_image.png';
import StorageUtil from 'utils/storageUtil';
import { CalendarScreen } from "components/calendarScreen";
import statusType from "enum/statusType";
import ItemChat from "./ItemChat";
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-crop-picker';
import { async } from "rxjs/internal/scheduler/async";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import ServerPath from "config/Server";
import Upload from 'react-native-background-upload'
import conversationStatus from "enum/conversationStatus";
import RNGRP from 'react-native-get-real-path';
import HeaderGradient from "containers/common/headerGradient";
import LinearGradient from 'react-native-linear-gradient';
import ic_cancel_white from "images/ic_cancel_white.png";
import { RNPhotoEditor } from 'lib/react-native-photo-editor'
var RNFS = require('react-native-fs');

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const messageType = {
    NORMAL_MESSAGE: 1,
    IMAGE_MESSAGE: 2
}

class ChatView extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            messageText: null,
            messages: [],
            images: [],
            isShowLoading: true,
            userId: null,
            onEndReachedCalledDuringMomentum: true,
            keyboardHeight: 0,
            isLoadOldMessage: false,
            isLoadImage: false,
            blurPhoto: false,
            enableLoadMore: false
        }
        // const { userMember, conversationId } = this.props.navigation.state.params;
        this.onceQuery = Constants.PAGE_SIZE;
        this.isScrollEnd = true;
        this.isSending = false;
        this.isLoadingMore = false;
        this.userMember = null;
        this.conversationId = null;
        this.userMemberId = "";
        this.userMemberName = "";
        this.avatar = "";
        this.imagesMessage = [];
        this.indexImagesMessage = 0;
        this.objectImages = '';
        this.actionValue = {
            WAITING_FOR_USER_ACTION: 0,
            ACCEPTED: 1,
            DENIED: 2
        };
        this.onceScrollToEnd = true;
        this.otherUserIdsInConversation = [];
        this.deleted = false;
        this.messageDraft = {
            fromUserId: "",
            message: "",
            timestamp: "",
            isShowDate: "",
            messageType: "",
            receiverResourceAction: 0
        };
        this.firebaseRef = firebase.database();
        this.userAdminId = null;
        this.listSendImages = [];
        this.isDissableBtn = false;
    }

    /**
     * Follow status deleted conversation
     */
    watchDeletedConversation() {
        if (!Utils.isNull(this.conversationId)) {
            this.deletedConversation = this.firebaseRef.ref(`conversation/c${this.conversationId}/deleted`)
            this.deletedConversation.on('value', (memberSnap) => {
                return this.deleted = memberSnap.val()
            })
        }
        return this.deleted = false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.getSourceUrlPath();
        StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG).then((faq) => {
            if (!Utils.isNull(faq)) {
                let userAdmin = faq.find(x => x.name == 'user_admin_id');
                this.userAdminId = userAdmin.numericValue;
            }
            console.log("userAdminId", this.userAdminId);
        }).catch(e => {
            this.saveException(e, 'componentDidMount')
        });
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            //this callback is executed when your Promise is resolved
            console.log("user", user);
            if (!Utils.isNull(user) && user.status == statusType.ACTIVE) {
                this.userInfo = user;
                this.setState({
                    userId: user.id
                })
                if (!Utils.isNull(this.userAdminId)) {
                    this.otherUserIdsInConversation = [this.userAdminId, user.id]
                }
                // conversation is between user and admin (sold)
                // this.watchDeletedConversation()
                console.log("checkExistConversation");
                this.props.checkExistConversation();
            }
        }).catch(e => {
            this.saveException(e, 'componentDidMount')
        });
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        // if (Utils.isNull(this.conversationId) || Utils.isNull(this.userMember)) { // when conversationId is null
        //     // case: From HomeView to Chat (chat with admin)
        //     // now, this.userMemberId = admin user id (this.userAdminId)
        //     // this.props.getProfileUserChat(this.userMemberId)
        //     console.log("readFirebaseDatabase componentDidMount");
        // this.readFirebaseDatabase();
        // } else {

        // }
    }

    // ************************** Captur and Save Image *************************
    saveImage = async filePath => {
        try {
            // set new image name and filepath
            const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
            const newFilepath = `${dirPicutures}/${newImageName}`;
            // move and save image to new filepath
            const imageMoved = await moveAttachment(filePath, newFilepath);
            console.log('image moved', imageMoved);
        } catch (error) {
            console.log(error);
        }
    };

    /** 
     * open image to edit 
     */
    editPhoto = (photoPath) => {
        Utils.writeFile(photoPath,
            // write file SUCCESS 
            (path) => {
                RNPhotoEditor.Edit({
                    path: path,
                    //   hiddenControls: ['clear', 'crop', 'draw', 'save', 'share', 'sticker', 'text'],
                    hiddenControls: ['save'],
                    onDone: () => {
                        path = 'file://' + path;
                        this.indexImagesMessage = 0;
                        this.listSendImages.push(path)
                        this.setState({
                            isLoadImage: true
                        })
                    },
                    onCancel: () => {
                    },
                });
            },
            // write file ERROR
            (err) => {
                console.log(`=== ERROR ===`);
                console.log(err);
            })
    }

    /**
     * Get all member in this conversation current
     */
    getOtherUserIdsInConversation() {
        this.firebaseRef.ref(`members/c${this.conversationId}`).on('value', (snapshot) => {
            if (!Utils.isNull(snapshot.val())) {
                console.log("napshot get member conversation: ", snapshot.val());
                this.otherUserIdsInConversation = []

                snapshot.forEach(element => {
                    let deleted = element.toJSON().deleted_conversation;
                    console.log("DELETED get member ", deleted);
                    if (parseInt(StringUtil.getNumberInString(element.key)) != this.userInfo.id && deleted == false) {
                        this.otherUserIdsInConversation.push(parseInt(StringUtil.getNumberInString(element.key)))
                    }
                });
                console.log("OTHER USER: get member ", this.otherUserIdsInConversation);
            }
        })
    }

    /**
     * Handle show keyboard 
     * @param {*} e 
     */
    keyboardWillShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    }

    /**
     * Handle hide keyboard
     * @param {*} e 
     */
    keyboardWillHide(e) {
        this.setState({ keyboardHeight: 0 });
    }

    /**
     * Keyboard did show
     */
    keyboardDidShow() {
        // setTimeout(() => {
        //     this.isScrollEnd = true
        //     this.scrollToEnd()
        // }, 200);
    }

    /**
     * scroll to end flatlist
     */
    scrollToEnd() {
        if (this.isScrollEnd) {
            setTimeout(() => {
                !Utils.isNull(this.flatListRef) ? this.flatListRef.scrollToOffset({
                    offset: 0,
                    animated: false
                }) : null;
            }, 0);
            if (!Utils.isNull(this.conversationId)) {
                this.firebaseRef.ref(`members/c${this.conversationId}/u${this.state.userId}/number_of_unseen_messages`)
                    .transaction(function (value) {
                        return 0;
                    });
                this.firebaseRef.ref(`chats_by_user/u${this.state.userId}/number_of_unseen_messages`)
                    .transaction(function (value) {
                        return 0;
                    })
            }
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
        if (!Utils.isNull(this.realTimeMessages)) {
            this.realTimeMessages.off()
        }
        this.keyboardDidShowListener.remove();
    }

    /** 
     * Handle when press save edited photo 
     */
    onPressSaveEditedPhoto = (imagePath) => {
        this.indexImagesMessage = 0;
        this.listSendImages.push(imagePath);
        this.setState({
            isLoadImage: true
        })
    }

    /**
     * Get all messages
     * @param {*} isLoadMore ~ true: load more is active
     */
    readFirebaseDatabase = async (isLoadMore) => {
        if (isLoadMore) {
            this.setState({
                isLoadOldMessage: true
            })
            this.isLoadingMore = true
            this.onceQuery += this.onceQuery
            this.isScrollEnd = false
        }
        try {
            this.firebaseRef.ref(`messages_by_conversation/c${this.conversationId}`)
                .limitToLast(this.onceQuery)
                .on('value', (messageSnap) => {
                    let messages = [];
                    console.log("messagesSnap: ", messageSnap.val());
                    if (!Utils.isNull(messageSnap.val())) {
                        let lengthMessage = messageSnap._childKeys.length;
                        this.state.enableLoadMore = lengthMessage > this.state.messages.length && lengthMessage >= Constants.PAGE_SIZE && lengthMessage % Constants.PAGE_SIZE == 0;
                        messageSnap.forEach(itemMessage => {
                            let item = {
                                "conversationId": this.conversationId,
                                "key": itemMessage.key,
                                "fromUserId": itemMessage.toJSON().from_user_id,
                                "message": itemMessage.toJSON().content,
                                "receiverSeen": itemMessage.toJSON().receiver_seen,
                                "timestamp": itemMessage.toJSON().timestamp,
                                "isShowAvatar": true,
                                "isShowDate": true,
                                "avatar": this.avatar,
                                "messageType": itemMessage.toJSON().message_type,
                                "receiverResourceAction": itemMessage.toJSON().receiver_resource_action
                            }
                            messages.push(item)
                        });
                    }
                    this.nextIndex = 0
                    this.nextElement = null
                    this.lastIndex = 0
                    this.lastElement = null
                    for (let index = 0; index < messages.length; index++) {
                        const element = messages[index]
                        if (index + 1 > messages.length - 1) {
                            break
                        } else {
                            this.nextIndex = index + 1
                        }
                        this.nextElement = messages[this.nextIndex]
                        // if (element.fromUserId !== this.state.userId) {
                        if (element.fromUserId === this.nextElement.fromUserId) {
                            // console.log(this.nextElement.from, "   ", this.nextIndex)
                            this.nextElement.isShowAvatar = false
                        }
                        if (
                            new Date(Number(element.timestamp)).getMonth() + 1 === new Date(Number(this.nextElement.timestamp)).getMonth() + 1
                            && new Date(Number(element.timestamp)).getDate() === new Date(Number(this.nextElement.timestamp)).getDate()
                        ) {
                            this.nextElement.isShowDate = false
                        }
                    }
                    this.setState({
                        messages: messages.reverse(),
                        isShowLoading: false,
                        isLoadOldMessage: false
                    }, () => {
                        this.scrollToEnd()
                    })
                })
        } catch (error) {
            this.saveException(error, 'readFirebaseDatabase')
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.CREATE_CONVERSATION)) {
                    if (!Utils.isNull(data)) {
                        if (!Utils.isNull(data.conversationId)) {
                            this.conversationId = data.conversationId;
                            this.otherUserIdsInConversation = [this.userAdminId];
                            this.setState({ messageText: null });
                            if (this.listSendImages.length > 0) {
                                this.uploadImageStepByStep();
                            } else {
                                setTimeout(() => { this.readFirebaseDatabase(); }, 1000)
                            }
                        }
                    }
                }
                if (this.props.action == getActionSuccess(ActionEvent.CHECK_EXIST_CONVERSATION)) {
                    if (data != null) {
                        this.conversationId = data;
                        this.getOtherUserIdsInConversation()
                        this.readFirebaseDatabase();
                    } else {
                        this.state.isShowLoading = false
                    }
                }
                this.state.isShowLoading = false
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    /** 
     * set blur khi mở photo editor ( click vào image ) và tắt blur khi tắt photo edit
     * @param isBlur 
     */
    changeBlurStatusOnPhoto = (blurPhoto) => {
        this.setState({
            blurPhoto: blurPhoto
        })
    }

    /**
     * Render item
     * @param {*} item 
     * @param {*} index 
     * @param {*} parentIndex 
     * @param {*} indexInParent 
     */
    renderItemChat(item, index, parentIndex, indexInParent) {
        let resourceUrlPath = !Utils.isNull(this.resourceUrlPathResize) ? this.resourceUrlPathResize.textValue : null
        let resource = !Utils.isNull(this.resourceUrlPath) ? this.resourceUrlPath.textValue : null

        return (
            <ItemChat
                data={item}
                key={index}
                index={index}
                userId={this.state.userId}
                roomId={this.roomId}
                userAdminId={this.state.userId}
                onPressSendAction={(actionValue, conversationId, keyMessage) => {
                    this.firebaseRef.ref().update({
                        [`messages_by_conversation/c${conversationId}/${keyMessage}/receiver_resource_action`]: this.receiverResourceAction(actionValue)
                    }).then(() => {
                        this.isScrollEnd = false
                        this.readFirebaseDatabase();
                    });
                }}
                onPressSaveEditedPhoto={this.onPressSaveEditedPhoto}
                resource={resource}
                userAvartarPath={this.userInfo.avatarPath}
                pathToResource={resourceUrlPath}
                changeBlurStatusOnPhoto={this.changeBlurStatusOnPhoto}
                blurPhoto={this.state.blurPhoto}

            />
        )
    }

    /**
     * Receiver resource action
     * @param {*} actionValue 
     */
    receiverResourceAction(actionValue) {
        if (actionValue == this.actionValue.DENIED) { // DENIED
            return this.actionValue.DENIED
        } else if (actionValue == this.actionValue.ACCEPTED) {
            return this.actionValue.ACCEPTED
        }
    }

    /**
     * Send message
     * @param {*} contentMessages 
     * @param {*} contentImages // when send image. contentImages = 'path 1, path 2, ...'
     */
    onPressSendMessages = async (contentMessages, contentImages) => {
        let timestamp = DateUtil.getTimestamp();
        let typeMessage = messageType.NORMAL_MESSAGE;
        if (!Utils.isNull(contentMessages) || !Utils.isNull(this.state.messageText) || !Utils.isNull(contentImages)) {
            let content = ""
            if (!Utils.isNull(contentMessages)) {
                content = contentMessages
            } else if (!Utils.isNull(this.state.messageText)) {
                content = this.state.messageText.trim();
                // if (Utils.isNull(contentImages)) {

                // }
            } else {
                content = contentImages;
                typeMessage = messageType.IMAGE_MESSAGE;
            }
            this.messageDraft = {
                conversationId: this.conversationId,
                fromUserId: this.state.userId,
                message: content,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                isShowDate: false,
                messageType: typeMessage,
                receiverResourceAction: 0,
                sending: 0
            }
            var joined = [...this.state.messages, this.messageDraft];

            this.setState({ messages: joined })
            if (!Utils.isNull(this.conversationId)) {
                if (this.deleted) {
                    this.readFirebaseDatabase();
                } else {
                    try {
                        this.otherUserIdsInConversation.forEach(userId => {
                            let updateData = {
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/deleted`]: false,
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/last_updated_at`]: firebase.database.ServerValue.TIMESTAMP,
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/deleted__last_updated_at`]: `1_${timestamp}`,
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/last_messages`]: {
                                    content: content,
                                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                                    message_type: typeMessage
                                },
                                [`chats_by_user/u${userId}/_all_conversation`]: {
                                    conversation_id: this.conversationId,
                                    from_user_id: this.state.userId,
                                    last_updated_at: firebase.database.ServerValue.TIMESTAMP,
                                    last_messages: {
                                        content: content,
                                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                                        message_type: typeMessage
                                    }
                                }
                            };
                            this.firebaseRef.ref().update(updateData);
                        })
                        this.otherUserIdsInConversation.forEach(userId => {
                            if (userId === this.state.userId) {
                                return;
                            }
                            this.firebaseRef.ref(`members/c${this.conversationId}/u${userId}/number_of_unseen_messages`).transaction(function (value) {
                                return value + 1;
                            });
                            this.firebaseRef.ref(`chats_by_user/u${userId}/number_of_unseen_messages`).transaction(function (value) {
                                return value + 1;
                            });
                        });
                        // push new message:
                        let newMessageKey = this.firebaseRef.ref(`messages_by_conversation/c${this.conversationId}`).push().key;
                        this.firebaseRef.ref().update({
                            [`messages_by_conversation/c${this.conversationId}/${newMessageKey}`]: {
                                from_user_id: this.state.userId,
                                content: content.trim(),
                                timestamp: firebase.database.ServerValue.TIMESTAMP,
                                message_type: typeMessage,
                                receiver_seen: true,
                                receiver_resource_action: 0
                            }
                        });
                        this.setState({ messageText: null });
                        this.imagesMessage = [];
                        this.isScrollEnd = true;
                        this.readFirebaseDatabase();
                        this.objectImages = '';
                    } catch (error) {
                        this.saveException(error, 'onPressSendMessages');
                    }
                }
            } else {
                this.props.createConversation({
                    userMemberChatId: this.userAdminId,
                    typeMessage: typeMessage,
                    content: content
                })
            }
        }
        this.isDissableBtn = false
    }

    /**
     * Format bytes
     * @param {*} bytes 
     * @param {*} decimals 
     */
    formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return console.log(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i])
    }

    /**
     * Choose image car
     */
    onChooseImage = () => {
        ImagePicker.openPicker({
            width: width * 25 / 100,
            height: width * 25 / 100,
            multiple: true,
            cropping: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            mediaType: 'photo',
            compressImageQuality: 0.8
        }).then((images) => {
            if (images.length > 1) {

                let count = 0
                let maxSizeUpload = 10240
                // let maxSizeUpload = this.maxFileSizeUpload.numericValue
                this.objectImages = ''
                this.indexImagesMessage = 0
                images.forEach(element => {
                    // console.log("element.size: ", element.size)
                    // console.log(images);

                    this.formatBytes(element.size);
                    if (element.size / this.oneMB > maxSizeUpload) {
                        count++
                    } else {
                        // this.imagesMessage.push({
                        //     "image": element.path
                        // })
                        this.listSendImages.push(element.path)
                        this.setState({
                            isLoadImage: true
                        })
                    }
                });
                console.log("LIST SEND IMAGES: ", this.listSendImages);
                if (count > 0) {
                    this.showMessage("Có " + count + " ảnh lớn hơn " + maxSizeUpload + " MB")
                }
                count = 0
                if (this.imagesMessage.length > 0) {
                    this.setState({
                        isShowLoading: true
                    })
                    if (this.conversationId != null) {
                        console.log("UPLOAD ẢNH:");
                        this.uploadImageStepByStep();
                    } else {
                        console.log("UPLOAD ẢNH KHI CHƯA CÓ CONVERSATION:");
                        this.props.createConversation({
                            userMemberChatId: this.userAdminId,
                            typeMessage: 2,
                            content: "gửi ảnh"
                        })
                    }

                }
            } else {
                let path = images[0].path;
                this.editPhoto(path);
            }
            // console.log(`=== IMAGES ===`);
            // console.log(path);

        }).catch(e => this.saveException(e, 'onChooseImage'));
    }

    /**
     * Upload image to server and get return path
     */
    uploadImageStepByStep() {
        this.setState({
            isShowLoading: true
        })
        if (Platform.OS === 'android') {
            try {
                RNGRP.getRealPathFromURI(this.listSendImages[this.indexImagesMessage]).then(filePathUrl => {
                    console.log("Chat View image path: ", filePathUrl)
                    const options = {
                        url: ServerPath.API_URL + `user/conversation/${this.conversationId}/media/upload`,
                        path: filePathUrl,
                        method: 'POST',
                        field: 'file',
                        type: 'multipart',
                        headers: {
                            'Content-Type': 'application/json', // Customize content-type
                            'X-APITOKEN': global.token
                        }
                    }
                    this.processUploadImage(options)
                });
            } catch (error) {
                this.saveException(error, 'uploadImageStepByStep')
            }
        } else {
            const options = {
                url: ServerPath.API_URL + `user/conversation/${this.conversationId}/media/upload`,
                path: this.listSendImages[this.indexImagesMessage],
                method: 'POST',
                field: 'file',
                type: 'multipart',
                headers: {
                    'Content-Type': 'application/json', // Customize content-type
                    'X-APITOKEN': global.token
                }
            }
            this.processUploadImage(options)
        }
    }

    /**
     * Process Upload Image
     */
    processUploadImage(options) {
        Upload.startUpload(options).then((uploadId) => {
            console.log('Upload started')
            Upload.addListener('progress', uploadId, (data) => {
                console.log(`Progress: ${data.progress}%`)
            })
            Upload.addListener('error', uploadId, (data) => {
                console.log(`Error: ${data.error} %`)
                this.showMessage(localizes('uploadImageError'))
                this.setState({
                    isShowLoading: false
                })
            })
            Upload.addListener('cancelled', uploadId, (data) => {
                console.log(`Cancelled!`)
            })
            Upload.addListener('completed', uploadId, (data) => {
                console.log('Completed!: ', this.indexImagesMessage, " - ", data)
                if (!Utils.isNull(data.responseBody)) {
                    let result = JSON.parse(data.responseBody)
                    let pathImage = result.data
                    console.log('Hello in chat view ', JSON.stringify(this.objectImages))
                    this.objectImages += pathImage + (this.indexImagesMessage == this.listSendImages.length - 1 ? '' : ',')
                }
                if (this.indexImagesMessage < this.listSendImages.length - 1) {
                    this.indexImagesMessage++
                    const timeOut = setTimeout(() => {
                        this.uploadImageStepByStep()
                    }, 200);
                } else {
                    console.log("this.objectImages: ", this.objectImages)
                    // upload images done!
                    this.listSendImages = []
                    // this.onPressSendMessages(null, this.objectImages)
                    // this.onPressSendMessages()

                    if (!Utils.isNull(this.state.messageText)) {
                        let messageTemp = this.state.messageText;
                        this.setState({
                            messageText: null,
                        }, () => { this.onPressSendMessages("", this.objectImages) });

                        setTimeout(() => { this.onPressSendMessages(messageTemp); }, 1000);
                    } else {
                        this.onPressSendMessages("", this.objectImages)
                    }
                }
            })
        }).catch((err) => {
            this.saveException(err, 'processUploadImage')
        })
    }

    /**
     * Render show load old messages
     */
    renderShowLoadOldMessages = () => {
        return (
            this.state.isLoadOldMessage
                ? <ActivityIndicator
                    color={Colors.COLOR_PRIMARY}
                    size="small"
                />
                : <View></View>
        )
    }

    /**
     * Delete image
     */
    deleteImage = (index) => {
        this.listSendImages.splice(index, 1);
        this.setState({
            isLoadImage: true
        })
    }

    /**
     * Render item send image
     */
    renderItemSendImages(item, index, parentIndex, indexInParent) {
        return (
            <View style={styles.itemImageContainer}>
                <Image
                    key={index}
                    style={{ width: 120, height: 180, borderRadius: Constants.CORNER_RADIUS / 2 }}
                    source={{ uri: item }}
                />
                <TouchableOpacity
                    disabled={this.isDissableBtn}
                    onPress={() => { this.deleteImage(index) }}
                    style={styles.btnDeleteImage}>
                    <Image style={{ width: 20, height: 20 }} source={ic_cancel_white} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleStage={false}
                        visibleSearchBar={false}
                        title="Tin nhắn"
                        onRef={ref => {
                            this.inputSearchRef = ref
                        }}
                        renderRightMenu={this.renderRightHeader}>
                    </HeaderGradient>
                    <FlatListCustom
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={this.renderShowLoadOldMessages}
                        onScroll={(event) => {
                            // const offsetY = event.nativeEvent.contentOffset.y
                            // if (offsetY == 0) {
                            //     let isLoadMore = true
                            //     this.readFirebaseDatabase(isLoadMore)
                            // }
                        }}
                        enableLoadMore={this.state.enableLoadMore}
                        onLoadMore={() => {
                            this.readFirebaseDatabase(true)
                        }}
                        inverted={true}
                        onContentSizeChange={() => {
                            // this.scrollToEnd()
                        }}
                        onRef={(ref) => { this.flatListRef = ref; }}
                        style={{ flexGrow: 1, flex: 1, paddingHorizontal: Constants.PADDING_LARGE }}
                        horizontal={false}
                        data={this.state.messages}
                        renderItem={this.renderItemChat.bind(this)}
                    />
                    <View
                        style={[styles.dockSendMess]}>
                        {this.listSendImages.length != 0 ?
                            <FlatListCustom
                                style={[styles.flatListSendImages]}
                                horizontal={true}
                                keyExtractor={item => item.id}
                                data={this.listSendImages}
                                itemPerCol={1}
                                renderItem={this.renderItemSendImages.bind(this)}
                                showsVerticalScrollIndicator={true}
                            /> : null}

                        <View style={[commonStyles.viewCenter, {
                            borderTopWidth: 0.7,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: this.state.keyboardHeight,
                            backgroundColor: Colors.COLOR_GREY,
                            borderTopColor: Colors.COLOR_GREY_LIGHT,
                            paddingHorizontal: Constants.PADDING_X_LARGE,
                            paddingVertical: Constants.PADDING_LARGE
                        }]}>
                            <TextInput
                                style={[commonStyles.text]}
                                editable={!this.state.isShowLoading}
                                selectTextOnFocus={!this.state.isShowLoading}
                                placeholder={"Viết tin nhắn..."}
                                placeholderTextColor={Colors.COLOR_DRK_GREY}
                                ref={r => (this.messageInput = r)}
                                value={this.state.messageText}
                                onChangeText={(text) => {
                                    this.setState({ messageText: text })
                                }}
                                onSubmitEditing={() => {
                                }}
                                style={{
                                    flex: 1
                                }}
                                keyboardType="default"
                                underlineColorAndroid='transparent'
                                multiline={true}
                            />
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                style={{ marginHorizontal: Constants.MARGIN_X_LARGE }}
                                onPress={() => this.onChooseImage()}>
                                <Image
                                    aspectRatio={0.7}
                                    source={ic_send_image}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                            <LinearGradient
                                colors={[Colors.COLOR_PRIMARY_LOW, Colors.COLOR_PRIMARY_HIGH]}
                                start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.8 }}
                                style={{
                                    paddingHorizontal: Constants.PADDING_LARGE,
                                    borderRadius: Constants.CORNER_RADIUS / 2
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={Constants.ACTIVE_OPACITY}
                                    style={{ paddingVertical: Constants.PADDING }}
                                    onPress={() => {
                                        if (this.listSendImages.length > 0) {
                                            this.isDissableBtn = true;
                                            if (this.conversationId != null) {
                                                this.uploadImageStepByStep();
                                            } else {
                                                this.setState({
                                                    isShowLoading: true
                                                })
                                                this.props.createConversation({
                                                    userMemberChatId: this.userAdminId,
                                                    typeMessage: 2,
                                                    content: "gửi ảnh"
                                                })
                                            }
                                        } else {
                                            !this.props.isLoading
                                                && !Utils.isNull(this.state.messageText)
                                                && this.state.messageText.trim() !== ""
                                                && this.onPressSendMessages()
                                        }
                                    }} >
                                    <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_XX_SMALL, color: Colors.COLOR_WHITE }]}>Gửi</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                    {this.showLoadingBar(this.state.isShowLoading)}
                </Root>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    data: state.chat.data,
    isLoading: state.chat.isLoading,
    error: state.chat.error,
    errorCode: state.chat.errorCode,
    action: state.chat.action
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatView);