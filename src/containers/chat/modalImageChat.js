import React, { Component } from "react";
import {
    ImageBackground, Text, View, Image, TouchableOpacity,
    StyleSheet, Dimensions, Platform, ScrollView, SafeAreaView,
    Modal, PermissionsAndroid, CameraRoll
} from "react-native";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import commonStyles from "styles/commonStyles";
import Utils from "utils/utils";
import { localizes } from "locales/i18n";
import ImageViewer from 'react-native-image-zoom-viewer';
import BaseView from "containers/base/baseView";
import { Header } from "native-base";
import ic_download_white from 'images/ic_download_white.png';
import ic_pen_edit_white from 'images/ic_pen_edit_white.png';
import RNFetchBlob from 'rn-fetch-blob';
import img_background_gradient from 'images/img_background_gradient.png';
import { Fonts } from "values/fonts";
import ImageZoom from 'react-native-image-pan-zoom';
import ic_success_green from 'images/ic_success_green.png';
import styles from "./styles";

const screen = Dimensions.get("window");

export default class ModalImageChat extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            indexZoom: 0,
            images: [],
            data: [],
            heightImage: null,
            disabledEdit: false,
            isMessageSuccess: false,
        };
        this.imagePath = '';
    }

    componentDidMount() {
        this.getSourceUrlPath();
    }


    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
        }
    }

    /**
     * Show modal
     */
    showModal(images, indexZoom) {
        if (images != null) {
            Image.getSize(images[0].path, (width, height) => {
                this.setState({
                    heightImage: height,
                })
            });
        }
        this.setState({
            isVisible: true,
            images,
            indexZoom,
        }, () => {
            Utils.writeFile(images[0].path,
                // write file SUCCESS 
                (path) => {
                    this.imagePath = path;
                },
                // write file ERROR
                (err) => {
                    console.log(`=== ERROR ===`);
                    console.log(err);
                })
        })
    }

    /**
     * Hide modal
     */
    hideModal() {
        this.setState({
            isVisible: false
        })
    }

    render() {
        const { images, indexZoom, isVisible, heightImage } = this.state;
        const { data } = this.props;
        let path = "";
        if (!Utils.isNull(images)) {
            this.imageUrls = [];
            path = !Utils.isNull(images[0].path) && images[0].path.indexOf('http') != -1
                ? images[0].path : this.resourceUrlPathResize.textValue + "=" + images[0].path;
        }
        console.log("HEIGH IMAGE: ", heightImage);
        return (
            <SafeAreaView>
                <Modal
                    ref={ref => {
                        this.modalImageViewer = ref
                    }}
                    onRequestClose={() => this.setState({ isVisible: false })}
                    visible={isVisible}
                    style={{ backgroundColor: Colors.COLOR_BLACK }}
                    useNativeDriver={true}
                >
                    <View style={{ backgroundColor: Colors.COLOR_BLACK, alignItems: 'center', justifyContent: 'center', height: screen.height, }}>
                        <ImageZoom
                            style={{ backgroundColor: Colors.COLOR_BLACK, alignItems: 'center', justifyContent: 'center' }}
                            cropWidth={screen.width}
                            cropHeight={heightImage}
                            imageWidth={screen.width}
                            imageHeight={heightImage}
                        >
                            <Image
                                resizeMode="contain"
                                style={{ width: screen.width, height: heightImage, alignSelf: 'center' }}
                                source={{ uri: path }} />
                        </ImageZoom>
                    </View>

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
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                                padding: Constants.PADDING_X_LARGE,
                            }}
                        >
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={[[commonStyles.text, {
                                    color: Colors.COLOR_WHITE
                                }]]}>{data && data.length > 0 ? data[indexZoom] != null && data[indexZoom].code != null ? data[indexZoom].code : '' : ''}</Text>
                                <Text style={[[commonStyles.text, {
                                    color: Colors.COLOR_WHITE, opacity: 0.7, fontSize: Fonts.FONT_SIZE_XX_SMALL
                                }]]}>{data && data.length > 0 ? data[indexZoom] != null && data[indexZoom].imageCategory != null ? data[indexZoom].imageCategory : '' : ''}</Text>
                            </View>
                            {this.renderButtonEdit()}
                            {this.renderButtonDownload()}
                        </View>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: screen.width - 60
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
                                onBack: () => this.hideModal(),
                                bgBack: Colors.COLOR_TRANSPARENT
                            })}
                        </Header>
                    </View>
                    {this.renderMessageSuccess()}
                </Modal>
            </SafeAreaView >
        );
    }

    /**
    * Render message download image success
    */
    renderMessageSuccess() {
        const { contentMessageText, styleContentText, styleContainerText, onTouchOutside } = this.props;
        return (
            <Modal
                transparent={true}
                visible={this.state.isMessageSuccess} >
                <View style={{ flex: 1, alignSelf: 'center' }}>
                    <View style={{ flex: 1, width: '100%' }} />
                    <View style={[styles.borderMessage, { flexDirection: 'row', justifyContent: 'center' ,}]} >
                        <Image source={ic_success_green} style={{ marginHorizontal: Constants.MARGIN_LARGE }} />
                        <Text style={[styles.text, { marginRight: Constants.MARGIN_LARGE }]} >
                            {localizes('downloadImageSuccess')}
                        </Text>
                    </View>
                    <View style={{ flex: 0, width: '100%', height: '15%' }} />
                </View>
            </Modal>
        );
    }

    renderButtonEdit = () =>
        <TouchableOpacity
            disabled={this.state.disabledEdit}
            style={{
                justifyContent: 'flex-end',
                marginRight: Constants.MARGIN_XX_LARGE
            }}
            onPress={this.onEditImage}>
            <Image source={ic_pen_edit_white} />
        </TouchableOpacity>

    renderButtonDownload = () =>
        <TouchableOpacity style={{ justifyContent: 'flex-end', marginRight: Constants.MARGIN_LARGE }}
            onPress={this.onSaveImage}>
            <Image source={ic_download_white} />
        </TouchableOpacity>

    /** 
     * On edit image 
     */
    onEditImage = () => {
        this.setState({
            disabledEdit: true
        }, () => {
            let timeout;
            timeout = setTimeout(() => {
                this.setState({
                    disabledEdit: false
                });
                clearTimeout(timeout);
            }, 1000);
        })

        // this.props.editPhoto(this.state.images[0].path);
        console.log("MODAL : " + this.state.images[0].path);
        console.log("MODAL PATH : " + this.imagePath);

        this.props.editPhoto(this.imagePath);
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
        // alert(image_URL);
        console.log("IMAGE URL SAVE: ", image_URL);
        var date = new Date();
        var ext = this.getExtension(image_URL);
        ext = "." + ext[0];
        console.log("EXTENSION FILE NAME: ", ext);
        const { config, fs } = RNFetchBlob;
        let PictureDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
        let options;
        if (Platform.OS === 'android') {
            options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: PictureDir + "/image_" + Math.floor(date.getTime()
                        + date.getSeconds() / 2) + ext,
                    description: 'Image'
                }
            }
        } else {
            options = {
                fileCache: true,
                IOSBackgroundTask: true,
                IOSDownloadTask: true,
                path: PictureDir + "/image_" + Math.floor(date.getTime()
                    + date.getSeconds() / 2) + ext
            }
        }
        config(options).fetch('GET', image_URL).then((res) => {
            if (Platform.OS === 'ios') {
                CameraRoll.saveToCameraRoll(res.path())
                    .then(this.handleShowModalSuccess())
                    .catch(err => console.log('err:', err))
            } else {
                this.handleShowModalSuccess();
            }
        }).catch(err => {
            // alert('error');
        });
    }

    /**
    * Handle show modal success
    */
    handleShowModalSuccess() {
        this.setState({ isMessageSuccess: true });
        setTimeout(() => {
            this.setState({ isMessageSuccess: false });
        }, 1500);
    }

    getExtension = (filename) => {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }
}