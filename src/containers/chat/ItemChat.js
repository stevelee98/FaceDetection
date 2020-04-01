import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, BackHandler } from 'react-native';
import ic_minus_primary from 'images/ic_minus_primary.png';
import ic_plus_primary from 'images/ic_plus_primary.png';
import { Constants } from 'values/constants';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import { Colors } from 'values/colors';
import ic_check_white from 'images/ic_check_white.png';
import StringUtil from 'utils/stringUtil';
import I18n from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import StorageUtil from 'utils/storageUtil';
import Utils from 'utils/utils';
import statusType from 'enum/statusType';
import FlatListCustom from 'components/flatListCustom';
import GridView from 'components/gridView';
import ImageViewer from 'react-native-image-zoom-viewer';
import DateUtil from 'utils/dateUtil';
import moment from 'moment';
import ic_cancel_white from 'images/ic_cancel_white.png';
import firebase from 'react-native-firebase';
import ImageLoader from 'components/imageLoader';
import ic_default_user from 'images/ic_default_user.png';
import BackgroundShadow from 'components/backgroundShadow';
import white_blur_shadow from 'images/white_blur_shadow.png';
import ic_admin_chat from 'images/ic_admin_chat.png';
import ModalImageChat from './modalImageChat';
import ic_download_white from 'images/ic_download_white.png';
import RNFetchBlob from 'rn-fetch-blob';
import img_background_gradient from 'images/img_background_gradient.png';
import { Header } from "native-base";
import { RNPhotoEditor } from 'lib/react-native-photo-editor'
var RNFS = require('react-native-fs');

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const PADDING_BUTTON = Constants.PADDING_X_LARGE - 4;
const messageType = {
    NORMAL_MESSAGE: 1,
    IMAGE_MESSAGE: 2
};

let context;
class ItemChat extends BaseView {

    static defautlProps = {
        blurPhoto: false
    }

    constructor(props) {
        super(props);
        context = this;
        this.state = {
            // isModalOpened: false,
            currentImageIndex: 0,
            indexZoom: 0,
            isVisible: false,
            images: []
        };
        this.imageUrls = [];
        this.W_H_SPECIAL = 24;
        this.actionValue = {
            WAITING_FOR_USER_ACTION: 0,
            ACCEPTED: 1,
            DENIED: 2
        };
        this.onPressItemImage = this.onPressItemImage.bind(this);
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props != nextProps) {
            this.props = nextProps
        }
    }

    /**
     * Open modal display images
     */
    toggleModal() {
        this.setState({
            isModalOpened: !this.state.isModalOpened,
        })
    }

    /** 
     * on press item image
     */
    onPressItemImage = (imageUrls, index) => {
        try {
            setTimeout(() => {
                this.modalImageViewer.showModal(imageUrls, index);
            }, 100);
            this.setState({
                currentImageIndex: index
            })
            return;
        } catch (err) {
            console.log(err);

        }
        // try {
        //     setTimeout(() => {
        //         context.refs.modalImageViewer.showModal(imageUrls, index);
        //     }, 100);
        //     context.setState({
        //         currentImageIndex: index
        //     })
        // } catch (err) {
        //     console.log(err);
        // }
    }

    /** 
     * on press image => show photo editor 
     */
    onPressImage = (photoPath) => {
        this.editPhoto(photoPath)
    }

    /**
     * On click item
     */
    onClickItem = (images, index) => {
        // this.refs.modalImageViewer.showModal(this.dataImages, index);
        this.editPhoto(this.dataImages, index);
    }

    /** 
     * open image to edit 
     */
    editPhoto = (photoPath) => {
        RNPhotoEditor.Edit({
            path: photoPath,
            //   hiddenControls: ['clear', 'crop', 'draw', 'save', 'share', 'sticker', 'text'],
            hiddenControls: ['save'],
            onDone: () => {
                let newPath = 'file://' + photoPath;
                this.modalImageViewer.hideModal();
                this.props.changeBlurStatusOnPhoto(false);
                this.props.onPressSaveEditedPhoto(newPath);
            },
            onCancel: () => {
                this.props.changeBlurStatusOnPhoto(false);
            },
        });
    }

    render() {
        const { data, index, userAdminId, onPressSendAction, pathToResource, resource, userAvartarPath } = this.props;
        console.log("ITEM CHAT: ", data);
        let parseItem = {
            conversationId: data.conversationId,
            key: data.key,
            from: data.fromUserId,
            content: data.message,
            createdAt: data.timestamp,
            isShowAvatar: data.isShowAvatar,
            isShowDate: data.isShowDate,
            avatar: !Utils.isNull(userAvartarPath) ? userAvartarPath : "",
            messageType: data.messageType,
            receiverResourceAction: data.receiverResourceAction,
            tokenImage: data.tokenImage,
            sending: data.sending
        }

        console.log("ITEM chat poarse: ", parseItem)
        console.log("ITEM chat poarse: ", parseItem.from)
        console.log("ITEM chat poarse: ", parseItem.isShowAvatar)
        let imagePath = !Utils.isNull(userAvartarPath) && userAvartarPath.indexOf('http') != -1
            ? userAvartarPath : !Utils.isNull(pathToResource) ? pathToResource + "=" + userAvartarPath : '';
        const date = new Date(parseInt(parseItem.createdAt))
        this.hours = date.getHours()
        this.minutes = date.getMinutes()
        this.year = date.getFullYear()
        this.month = date.getMonth() + 1
        this.day = date.getDate()
        this.imageUrls = []
        if (parseItem.messageType == messageType.IMAGE_MESSAGE) {
            String(parseItem.content).split(',').forEach(pathImage => {
                this.imageUrls.push({ url: resource + "/sr/display?" + "op=resize&w=" + Math.ceil(width * 1.5) + '&token=' + parseItem.tokenImage + "&path=" + pathImage })
            });
        }
        return (
            <View style={{}} >
                {
                    parseItem.isShowDate ?
                        <View style={{ alignItems: 'center', marginVertical: Constants.MARGIN_LARGE }} >
                            <Text style={[commonStyles.textSmall]} >
                                {this.day < 10 ? `0${this.day}` : this.day}/{this.month < 10 ? `0${this.month}` : this.month}/{this.year}
                            </Text>
                        </View>
                        : null
                }
                {
                    parseItem.messageType == messageType.NORMAL_MESSAGE
                        ? <View style={[commonStyles.viewHorizontal, {
                            flex: 0,
                            marginBottom: Constants.MARGIN_LARGE,
                            justifyContent: parseItem.from !== this.props.userId ? 'flex-start' : 'flex-end',
                            alignItems: 'center'
                        }]} >
                            {
                                parseItem.sending == 0
                                    ? <Text style={[commonStyles.textSmall, { color: Colors.COLOR_DRK_GREY }]} >Sending...</Text>
                                    : null
                            }
                            <View style={[commonStyles.viewHorizontal, { flex: 0, alignItems: "flex-end" }]} >
                                {
                                    parseItem.from !== this.props.userId && parseItem.isShowAvatar ?
                                        <View style={{
                                            width: this.W_H_SPECIAL,
                                            height: this.W_H_SPECIAL,
                                            borderRadius: this.W_H_SPECIAL / 2,
                                            overflow: 'hidden',
                                            marginRight: Constants.MARGIN_LARGE,
                                        }} >
                                            <Image
                                                style={{
                                                    width: this.W_H_SPECIAL,
                                                    height: this.W_H_SPECIAL,
                                                }}
                                                resizeMode='contain'
                                                source={ic_admin_chat}
                                            />
                                        </View>
                                        : null

                                }
                                {
                                    !parseItem.isShowAvatar ?
                                        <View style={{
                                            width: this.W_H_SPECIAL,
                                            height: this.W_H_SPECIAL,
                                            marginRight: Constants.MARGIN_LARGE
                                        }} >
                                            <Text style={{ color: 'transparent' }} >a</Text>
                                        </View> : null
                                }
                                <View style={parseItem.from == this.props.userId ?
                                    [styles.user, {
                                        borderBottomRightRadius: parseItem.isShowAvatar ? null : Constants.CORNER_RADIUS / 2,
                                        borderTopRightRadius: !parseItem.isShowAvatar ? null : Constants.CORNER_RADIUS / 2
                                    }] :
                                    [styles.member, {
                                        borderBottomLeftRadius: parseItem.isShowAvatar ? null : Constants.CORNER_RADIUS / 2,
                                        borderTopLeftRadius: !parseItem.isShowAvatar ? null : Constants.CORNER_RADIUS / 2
                                    }]} >
                                    <Text style={[commonStyles.text, { maxWidth: width * 0.65, color: parseItem.from !== this.props.userId ? Colors.COLOR_TEXT : Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_XX_SMALL }]}>
                                        {parseItem.content}
                                    </Text>
                                    <Text style={[commonStyles.textSmall, { color: parseItem.from !== this.props.userId ? Colors.COLOR_GRAY : Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_X_SMALL }]}>
                                        {this.hours < 10 ? `0${this.hours}` : this.hours}:{this.minutes < 10 ? `0${this.minutes}` : this.minutes}
                                    </Text>
                                </View>
                                {parseItem.from == this.props.userId && parseItem.isShowAvatar ?
                                    <View style={{
                                        width: this.W_H_SPECIAL,
                                        height: this.W_H_SPECIAL,
                                        borderRadius: this.W_H_SPECIAL / 2,
                                        overflow: 'hidden',
                                        marginLeft: Constants.MARGIN_LARGE
                                    }} >
                                        <ImageLoader
                                            style={{
                                                width: this.W_H_SPECIAL,
                                                height: this.W_H_SPECIAL,
                                                borderRadius: this.W_H_SPECIAL / 2
                                            }}
                                            resizeAtt={{ type: 'resize', width: this.W_H_SPECIAL }}
                                            resizeModeType={"cover"}
                                            path={imagePath}
                                        />
                                    </View> : null
                                }
                                {
                                    !parseItem.isShowAvatar ?
                                        <View style={{
                                            width: this.W_H_SPECIAL,
                                            height: this.W_H_SPECIAL,
                                            marginRight: Constants.MARGIN_LARGE
                                        }} >
                                            <Text style={{ color: 'transparent' }} >a</Text>
                                        </View> : null
                                }
                            </View>
                        </View>
                        : <View style={[commonStyles.viewHorizontal, {
                            flex: 0,
                            marginBottom: Constants.MARGIN_LARGE,
                            justifyContent: parseItem.from !== this.props.userId ? 'flex-start' : 'flex-end',
                            alignItems: 'center'
                        }]} >
                            <View style={[commonStyles.viewHorizontal, { flex: 0 }]} >
                                <View>
                                    <View style={{ flex: 1, alignItems: parseItem.from !== this.props.userId ? 'flex-start' : 'flex-end' }}>
                                        {this.imageUrls.map((item, index, array) => {
                                            let imageUrls = [];
                                            imageUrls.push({ path: item.url });
                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'flex-end',
                                                        marginBottom: Constants.MARGIN_LARGE
                                                    }}  >
                                                    {
                                                        parseItem.from != this.props.userId && parseItem.isShowAvatar ?
                                                            <View style={{ width: this.W_H_SPECIAL, height: this.W_H_SPECIAL, borderRadius: this.W_H_SPECIAL / 2, overflow: 'hidden', marginRight: Constants.MARGIN_LARGE }} >
                                                                <Image
                                                                    style={{
                                                                        width: this.W_H_SPECIAL,
                                                                        height: this.W_H_SPECIAL,
                                                                        // borderRadius: this.W_H_SPECIAL / 2
                                                                    }}
                                                                    resizeMode='contain'
                                                                    source={ic_admin_chat}
                                                                />
                                                            </View> : null
                                                    }
                                                    {
                                                        !parseItem.isShowAvatar ?
                                                            <View style={{ width: this.W_H_SPECIAL, height: this.W_H_SPECIAL, marginRight: Constants.MARGIN_LARGE }} ><Text style={{ color: 'transparent' }} >a</Text></View> : null
                                                    }
                                                    <View style={{ borderWidth: 0.5, borderColor: Colors.COLOR_DRK_GREY, borderRadius: Constants.CORNER_RADIUS / 2 }}>
                                                        <TouchableOpacity
                                                            disabled={this.props.blurPhoto}
                                                            onPress={() => this.onPressItemImage(imageUrls, 0)}
                                                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <ImageLoader
                                                                path={item.url}
                                                                resizeModeType={"cover"}
                                                                resizeAtt={{ type: 'resize', width: width * 40 / 100 }}
                                                                style={{
                                                                    height: (width * 0.4) * 18 / 12,
                                                                    width: width * 40 / 100,
                                                                    borderRadius: Constants.CORNER_RADIUS / 2,
                                                                    // marginRight: Constants.MARGIN,
                                                                    // marginBottom: Constants.MARGIN
                                                                }} />
                                                        </TouchableOpacity>
                                                        <ModalImageChat
                                                            // data={imageUrls}
                                                            ref={ref => {
                                                                this.modalImageViewer = ref
                                                            }}
                                                            editPhoto={this.editPhoto}
                                                        // parentView={this}
                                                        />
                                                    </View>
                                                    {parseItem.from == this.props.userId && parseItem.isShowAvatar ?
                                                        <View style={{
                                                            width: this.W_H_SPECIAL,
                                                            height: this.W_H_SPECIAL,
                                                            borderRadius: this.W_H_SPECIAL / 2,
                                                            overflow: 'hidden',
                                                            marginLeft: Constants.MARGIN_LARGE
                                                        }} >
                                                            <ImageLoader
                                                                style={{
                                                                    width: this.W_H_SPECIAL,
                                                                    height: this.W_H_SPECIAL,
                                                                    borderRadius: this.W_H_SPECIAL / 2
                                                                }}
                                                                resizeAtt={{ type: 'resize', width: this.W_H_SPECIAL }}
                                                                resizeModeType={"cover"}
                                                                path={imagePath}
                                                            />
                                                        </View> : null
                                                    }
                                                    {
                                                        !parseItem.isShowAvatar ?
                                                            <View style={{
                                                                width: this.W_H_SPECIAL,
                                                                height: this.W_H_SPECIAL,
                                                                marginRight: Constants.MARGIN_LARGE
                                                            }} >
                                                                <Text style={{ color: 'transparent' }} >a</Text>
                                                            </View> : null
                                                    }
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            </View>
                        </View>
                }
            </View>
        );
    }

    renderModal = () => {
        const { isVisible, images } = this.state;
        console.log("THISS. VISSIBAL MODAL: ", isVisible);
        let imageUrlsModal = [];
        if (!Utils.isNull(images)) {
            images.forEach(item => {
                let image = !Utils.isNull(item.path) && item.path.indexOf('http') != -1
                    ? item.path : this.resourceUrlPathResize.textValue + "=" + item.path;
                imageUrlsModal.push({ url: image });
            })
        }
        <Modal
            ref={"modalImageViewer"}
            // onRequestClose={() => this.setState({ isVisible: false })}
            visible={isVisible}
            transparent={true}
            useNativeDriver={true}
        >
            <ImageViewer
                enableSwipeDown={true}
                saveToLocalByLongPress={false}
                // onCancel={() => this.setState({
                //     isVisible: false
                // })}
                imageUrls={imageUrlsModal}
                renderIndicator={
                    (number) => {
                        return (
                            <Text ></Text>
                        );
                    }
                }
            />
            <Image style={{
                height: 150,
                position: 'absolute',
                alignSelf: "flex-end",
                bottom: 0
            }} source={img_background_gradient}>
            </Image>

            <View style={{
                position: 'absolute',
                bottom: Constants.MARGIN_X_LARGE,
                right: 0, left: 0
            }}>
                <View
                    style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: Constants.PADDING_X_LARGE
                    }}
                >
                    <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => this.onSaveImage()}>
                        <Image source={ic_download_white} />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: width - 60
                }}>
                <Header
                    noShadow
                    style={[commonStyles.header, {
                        backgroundColor: Colors.COLOR_TEXT_OPACITY_30
                    }]}>
                    {this.renderHeaderView({
                        visibleStage: false,
                        visibleBack: true,
                        title: "",
                        onBack: () => {
                            this.setState({
                                isVisible: false
                            })
                        },
                        bgBack: Colors.COLOR_TRANSPARENT
                    })}
                </Header>
            </View>
        </Modal>
    }

    /**
    * On save image
    */
    onSaveImage = async () => {
        const hasLocationPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

        if (!hasLocationPermission) return;

        const { indexZoom, images } = this.state;
        var image_URL = !Utils.isNull(images[indexZoom].path) && images[indexZoom].path.indexOf('http') != -1
            ? images[indexZoom].path : this.resourceUrlPath.textValue + "/" + images[indexZoom].path;
        console.log("IMAGE URL SAVE: ", image_URL);
        var date = new Date();
        var ext = this.getExtension(image_URL);
        ext = "." + ext[0];
        console.log("EXTENSION FILE NAME: ", ext);
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: PictureDir + "/image_" + Math.floor(date.getTime()
                    + date.getSeconds() / 2) + ext,
                description: 'Image'
            }
        }
        config(options).fetch('GET', image_URL).then((res) => {
            Alert.alert("Image Downloaded Successfully.");
        });
    }

    getExtension = (filename) => {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }
}

const styles = StyleSheet.create({
    user: {
        margin: 0,
        padding: Constants.PADDING_LARGE,
        backgroundColor: "#e10000",
        borderBottomLeftRadius: Constants.CORNER_RADIUS / 2,
        borderTopLeftRadius: Constants.CORNER_RADIUS / 2,
        // borderTopRightRadius: Constants.CORNER_RADIUS * 4
    },
    member: {
        margin: 0,
        padding: Constants.PADDING_LARGE,
        backgroundColor: "#E9E9E9",
        borderBottomRightRadius: Constants.CORNER_RADIUS / 2,
        borderTopLeftRadius: Constants.CORNER_RADIUS / 2,
        borderTopRightRadius: Constants.CORNER_RADIUS / 2
    },
    image: {
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.CORNER_RADIUS / 2,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: Constants.PADDING_X_LARGE
    },
    buttonSpecial: {
        paddingHorizontal: Constants.PADDING_X_LARGE,
        paddingVertical: Constants.PADDING_LARGE
    }
});

export default ItemChat;