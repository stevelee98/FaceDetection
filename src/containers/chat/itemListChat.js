import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, BackHandler, ScrollView } from 'react-native';
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
import ic_user_large_red from 'images/ic_user_large_red.png';
import * as actions from 'actions/userActions';
import { ErrorCode } from 'config/errorCode';
import { getActionSuccess, ActionEvent } from 'actions/actionEvent';
import { connect } from 'react-redux';
import ImageLoader from 'components/imageLoader';
import ic_trash_white from 'images/ic_trash_white.png';
import BackgroundShadow from 'components/backgroundShadow';
import shadow_black_42 from 'images/shadow_black_42.png';
import LinearGradient from "react-native-linear-gradient";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const PADDING_BUTTON = Constants.PADDING_X_LARGE - 4;
const WIDTH_HEIGHT_AVATAR = 48;

class ItemListChat extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            if (nextProps.isPressDelete) {
                this.scrollView.scrollTo({ x: 50 });
            } else {
                this.scrollView.scrollTo({ x: 0 });
            }
        }
    }

    render() {
        const { data, item, index, onPressItemChat, onPressDeleteItem, resourcePath } = this.props;
        let parseItem = {
            lastMessage: !Utils.isNull(item.lastMessage) ? item.lastMessage.content : "",
            updatedAt: !Utils.isNull(item.lastMessage) ? item.lastMessage.timestamp : DateUtil.getTimestamp(),
            nameUserChat: item.name,
            avatar: !Utils.isNull(item.avatarPath) ? data.avatarPath : "",
            unseen: item.unseen,
        };
        const HEIGHT_NOT_SEEN = 20;
        const WIDTH__NOT_SEEN = Utils.getLength(parseInt(parseItem.unseen)) < 2 ? 20 : 28;
        this.avatarMemberChat = !Utils.isNull(parseItem.avatar) && parseItem.avatar.indexOf('http') != -1 ? parseItem.avatar : resourcePath + "/" + parseItem.avatar;
        const date = new Date(parseInt(parseItem.updatedAt));
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
        this.time = this.day + "/" + this.month + "/" + this.year + " " + this.hours + ":" + this.minutes + ":" + this.seconds;
        let marginBottom = Constants.MARGIN_LARGE;
        if (index == data.length - 1) {
            marginBottom = Constants.MARGIN_X_LARGE;
        };
        const styleText = parseItem.unseen == 0 ? commonStyles.text : commonStyles.textBold;
        return (
            <ScrollView
                onScroll={event => {
                    global.positionX = event.nativeEvent.contentOffset.x
                }}
                ref={ref => this.scrollView = ref}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[{
                    marginVertical: Constants.MARGIN_LARGE,
                    justifyContent: "center",
                    alignItems: "center",
                }]}
                horizontal={true}
                style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ flex: 1, width: width }}
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={() => onPressItemChat()} >
                    <View style={[commonStyles.viewHorizontal, {
                        marginHorizontal: Constants.MARGIN_X_LARGE,
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                    }]}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View>
                                <ImageLoader
                                    style={{
                                        width: WIDTH_HEIGHT_AVATAR,
                                        height: WIDTH_HEIGHT_AVATAR,
                                        borderRadius: WIDTH_HEIGHT_AVATAR / 2
                                    }}
                                    resizeModeType={"cover"}
                                    path={this.avatarMemberChat}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: Constants.MARGIN_X_LARGE }}>
                                    <View style={commonStyles.viewSpaceBetween}>
                                        <Text numberOfLines={1} style={[commonStyles.textBold, {
                                            fontSize: Fonts.FONT_SIZE_XX_SMALL,
                                            margin: 0
                                        }]}>{parseItem.nameUserChat}</Text>
                                        <Text style={[commonStyles.text, {
                                            alignSelf: 'flex-start',
                                            flexDirection: 'column',
                                            margin: 0,
                                            fontSize: Fonts.FONT_SIZE_XX_SMALL,
                                            opacity: 0.6
                                        }]}>
                                            {DateUtil.timeAgo(DateUtil.convertFromFormatToFormat(
                                                this.time, DateUtil.FORMAT_DATE_TIME_SQL,
                                                DateUtil.FORMAT_DATE_TIME_ZONE_T
                                            ))}
                                        </Text>
                                    </View>

                                    <Text numberOfLines={2} style={[styleText, {
                                        fontSize: Fonts.FONT_SIZE_XX_SMALL,
                                        margin: 0,
                                    }]}>{parseItem.lastMessage}</Text>
                                </View>
                                {
                                    parseItem.unseen > 0 ?
                                        <View style={{
                                            height: HEIGHT_NOT_SEEN,
                                            width: WIDTH__NOT_SEEN,
                                            backgroundColor: "#F36258",
                                            borderRadius: Constants.CORNER_RADIUS,
                                            ...commonStyles.viewCenter
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: Fonts.FONT_SIZE_X_SMALL,
                                                padding: Constants.PADDING
                                            }}>
                                                {parseItem.unseen}
                                            </Text>
                                        </View> : null
                                }
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginRight: 0 }}
                    onPress={() => { onPressDeleteItem() }}
                    activeOpacity={Constants.ACTIVE_OPACITY}>
                    <LinearGradient colors={['#000000', '#545454']}

                        style={[commonStyles.shadowOffset, {
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: width * 0.15,
                            margin: 0,

                        }]} >
                        <Image source={ic_trash_white} />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    name: {
        borderRadius: Constants.CORNER_RADIUS,
        margin: 0,
        padding: Constants.PADDING_LARGE,
        backgroundColor: Colors.COLOR_WHITE
    },
    image: {
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.CORNER_RADIUS,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: Constants.PADDING_X_LARGE
    },
    buttonSpecial: {
        paddingHorizontal: Constants.PADDING_X_LARGE,
        paddingVertical: Constants.PADDING_LARGE,
    }
});

export default ItemListChat;