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
import RNFetchBlob from 'rn-fetch-blob';
import img_background_gradient from 'images/img_background_gradient.png';
import { Fonts } from "values/fonts";
import ic_success_green from 'images/ic_success_green.png';
import styles from "./styles";

const screen = Dimensions.get("window");

export default class ModalImageViewer extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            indexZoom: 0,
            images: [],
            isMessageSuccess: false,
            data: [],
        };
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
        this.setState({
            isVisible: true,
            images,
            indexZoom,
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
        const { images, indexZoom, isVisible } = this.state;
        const { data } = this.props;
        if (!Utils.isNull(images)) {
            this.imageUrls = [];
            images.forEach(item => {
                let image = !Utils.isNull(item.path) && item.path.indexOf('http') != -1
                    ? item.path : this.resourceUrlPathResize.textValue + "=" + item.path;
                this.imageUrls.push({ url: image });
            })
        }
        return (
            <SafeAreaView>
                <Modal
                    ref={"modalImageViewer"}
                    onRequestClose={() => this.setState({ isVisible: false })}
                    visible={isVisible}
                    transparent={true}
                    useNativeDriver={true}
                >
                    <ImageViewer
                        enableSwipeDown={true}
                        saveToLocalByLongPress={false}
                        onCancel={() => this.hideModal()}
                        imageUrls={this.imageUrls}
                        index={indexZoom}
                        renderIndicator={
                            (number) => {
                                return (
                                    <Text></Text>
                                );
                            }
                        }
                        onChange={(indexZoom) => this.setState({ indexZoom })}
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
                            <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={this.onSaveImage}>
                                <Image source={ic_download_white} />
                            </TouchableOpacity>
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
     * On save image
     */
    onSaveImage = async () => {
        const hasLocationPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE) || Platform.OS === 'ios';

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
        let PictureDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
        // let options = {
        //     fileCache: true,
        //     addAndroidDownloads: {
        //         useDownloadManager: true,
        //         notification: true,
        //         description: 'Image'
        //     },
        //     IOSBackgroundTask: true,
        //     IOSDownloadTask: true,
        //     path: PictureDir + "/image_" + Math.floor(date.getTime()
        //         + date.getSeconds() / 2) + ext
        // }
        let options;
        if (Platform.OS === 'android')
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
        else
            options = {
                fileCache: true,
                IOSBackgroundTask: true,
                IOSDownloadTask: true,
                path: PictureDir + "/image_" + Math.floor(date.getTime()
                    + date.getSeconds() / 2) + ext
            }

        // alert(JSON.stringify(options));
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
                    <View style={[styles.borderMessage, { flexDirection: 'row', justifyContent: 'center' }]} >
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
}