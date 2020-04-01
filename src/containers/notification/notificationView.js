import React, { Component } from "react";
import {
    ListView, View, Alert, Image, RefreshControl, Dimensions,
    FlatList, ScrollView, TouchableOpacity, BackHandler,
    TextInput, ImageBackground
} from "react-native";
import {
    Container, Header, Content, Button, Icon, List, Tabs,
    Tab, TabHeading, ListItem, Text, SwipeRow, Body,
    Thumbnail, Root, Left, Title, Right,
} from "native-base";
import { localizes } from 'locales/i18n';
import FlatListCustom from "components/flatListCustom";
import I18n from 'react-native-i18n';
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import styles from "./styles";
import { Constants } from "values/constants";
import BaseView from "containers/base/baseView";
import { Fonts } from "values/fonts";
import { connect } from 'react-redux';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import { ErrorCode } from "config/errorCode";
import Utils from "utils/utils";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import ItemNotification from "./itemNotification";
import ic_back_white from 'images/ic_back_white.png'
import StorageUtil from "utils/storageUtil";
import statusType from "enum/statusType";
import ModalContent from "./modalContent";
import firebase from 'react-native-firebase';
import notificationType from "enum/notificationType";
import img_bg_gradient from 'images/img_bg_gradient.png';
import HeaderGradient from 'containers/common/headerGradient.js';
import ic_delete_white from 'images/ic_delete_white.png';
import ic_cancel from 'images/ic_cancel.png';
import DialogCustom from "components/dialogCustom";
import { CheckBox } from 'react-native-elements';

class NotificationView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            enableDelete: false,
            deleteAll: false,
            isLoadingMore: false,
            isAlertDelete: false
        };
        this.typeIsSeen = {
            ONE_ITEM: 1,
            ALL_ITEM: 0
        }
        this.filter = {
            userId: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            }
        };

        this.listNotifications = [];
        this.listNotificationTemps = [];
        this.itemWatching = null;
        this.showNoData = false;
        this.listDelete = [];
    }

    componentWillMount() {
        super.componentWillMount();
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
    }

    /**
     * Open modal Week
     */
    openModal(content, title) {
        this.refs.modalContent.showModal(content, title);
    }

    /**
     * Get information user profile
     */
    getUserProfile = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                this.setState({
                    userId: user.id
                })
                this.filter = {
                    userId: user.id,
                    paging: {
                        pageSize: Constants.PAGE_SIZE,
                        page: 0
                    }
                }
                this.props.getUserProfile(user.id);
                this.requestNotification();
            }
        }).catch((error) => {
            this.saveException(error, "getUserProfile");
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        const { deleteAll } = this.state;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.refreshing = false;
                this.state.isLoadingMore = false;
                if (this.props.action == getActionSuccess(ActionEvent.GET_NOTIFICATIONS)) {
                    console.log("GET NOTIFICATION DATA: ", data)
                    if (!Utils.isNull(data)) {
                        if (data.data.length > 0) {
                            this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                            data.data.forEach(item => {
                                this.listNotificationTemps.push({ ...item, isCheck: deleteAll });
                                if (deleteAll) {
                                    this.listDelete.push(item.id)
                                }
                            });
                            this.listNotifications = this.listNotificationTemps;
                        } else {
                            this.listNotifications = [];
                        }
                    }
                    this.showNoData = true;
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_NOTIFICATIONS_VIEW)) {
                    let index2 = -1
                    for (let index = 0, size = this.listNotifications.length; index < size; index++) {
                        const element = this.listNotifications[index];
                        if (element.id == this.itemWatching.id) {
                            index2 = index;
                            this.itemWatching.seen = true;
                            break;
                        }
                    }
                    this.listNotifications.splice(index2, 1, this.itemWatching);
                    this.countNewNotification();
                } else if (this.props.action == getActionSuccess(ActionEvent.SEARCH_NOTIFICATION)) {
                    if (data.length > 0) {
                        data.forEach(item => {
                            this.listNotificationTemps.push({ ...item });
                        });
                        this.listNotifications = this.listNotificationTemps;
                    } else {
                        this.listNotifications = [];
                        this.setState({ txtNotNotify: localizes("notificationView.searchNull") });
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.READ_ALL_NOTIFICATION)) {
                    if (data) {
                        for (let index = 0, size = this.listNotifications.length; index < size; index++) {
                            const element = this.listNotifications[index]
                            element.seen = true
                        }
                        this.countNewNotification();
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.DELETE_NOTIFICATIONS)) {
                    this.listNotificationTemps = this.listNotificationTemps.filter((item) => !this.listDelete.includes(item.id));
                    this.listNotifications = this.listNotificationTemps;
                    this.listDelete = [];
                    this.countNewNotification();
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.languageDevice = I18n.locale;
        this.getUserProfile();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        BackHandler.removeEventListener(
            "hardwareBackPress",
            this.handlerBackButton
        );
    }

    //onRefreshing
    handleRefresh = () => {
        this.listDelete = [];
        this.state.deleteAll = false;
        this.state.refreshing = true;
        this.state.enableLoadMore = false;
        this.listNotificationTemps = [];
        this.filter.paging.page = 0;
        this.props.getUserProfile(this.state.userId);
        this.requestNotification();
    }

    /**
     * get notification and update count
     */
    requestNotification() {
        let timeout = 1000;
        this.props.getNotificationsRequest(this.filter);
        let timeOutRequestOne = setTimeout(() => {
            this.countNewNotification();
            clearTimeout(timeOutRequestOne)
        }, timeout);
    }

    /**
     * Get more notification
     */
    getMoreNotifications = () => {
        this.state.isLoadingMore = true;
        this.filter.paging.page += 1;
        this.requestNotification();
    }

    /**
     * Update number notification seen
     * @param {*} type 
     * @param {*} itemNotificationId  // id of item notification when on click item notification
     */
    updateNumberIsSeen(type, itemNotificationId) {
        if (!Utils.isNull(this.state.userId)) {
            this.filterNotificationIsSeen = {
                notificationIds: []
            };
            if (type == this.typeIsSeen.ALL_ITEM) {
                if (this.listNotifications.length > 0) {
                    this.props.readAllNotification();
                }
            } else if (type == this.typeIsSeen.ONE_ITEM) {
                this.filterNotificationIsSeen.notificationIds.push(itemNotificationId);
                this.props.postNotificationsView(this.filterNotificationIsSeen);
            }
        }
    }

    render() {
        var { data } = this.props;
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        visibleStage={false}
                        onBack={this.onBack}
                        title={localizes("notificationView.notification")}
                        renderRightMenu={this.renderRightMenu}>
                    </HeaderGradient>
                    <FlatListCustom
                        ListHeaderComponent={this.renderHeaderFlatList}
                        stickyHeaderIndices={[0]}
                        contentContainerStyle={{}}
                        style={[{
                            backgroundColor: Colors.COLOR_BACKGROUND
                        }]}
                        keyExtractor={item => item.code}
                        data={this.listNotifications}
                        renderItem={this.renderItemRow}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        enableLoadMore={this.state.enableLoadMore}
                        onLoadMore={() => {
                            this.getMoreNotifications()
                        }}
                        showsVerticalScrollIndicator={false}
                        isShowEmpty={this.showNoData}
                        textForEmpty={localizes("notificationView.noNotification")}
                        styleEmpty={{ marginTop: Constants.MARGIN_XX_LARGE * 5 }}
                    />
                    <ModalContent
                        ref={'modalContent'}
                        parentView={this}
                    />
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                    {this.renderAlertDelete()}
                </Root>
            </Container>
        );
    }

    /**
     * Render header flat list
     */
    renderHeaderFlatList = () => {
        return (
            this.state.enableDelete ?
                <View style={[commonStyles.viewHorizontal, {
                    flex: 0,
                    justifyContent: 'space-between', marginHorizontal: Constants.MARGIN_LARGE,
                    backgroundColor: Colors.COLOR_WHITE
                }]}>
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={{
                            padding: Constants.PADDING_LARGE
                        }}
                        onPress={() => {
                            this.listDelete = [];
                            this.setState({ enableDelete: false, deleteAll: false });
                            this.listNotifications.forEach(item => {
                                item.isCheck = false;
                            });
                        }}>
                        <Text style={[commonStyles.text]}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={{
                            padding: Constants.PADDING_LARGE
                        }}
                        onPress={() => {
                            if (!this.state.deleteAll) {
                                this.listNotifications.forEach(item => {
                                    item.isCheck = true;
                                    var itemUnCheck = this.listDelete.indexOf(item.id);
                                    if (itemUnCheck == -1) {
                                        this.listDelete.push(item.id)
                                    }
                                });
                            } else {
                                this.listNotifications.forEach(item => {
                                    item.isCheck = false;
                                });
                                this.listDelete = [];
                            }
                            this.setState({ deleteAll: !this.state.deleteAll })
                        }}>
                        <Text style={[commonStyles.text]}>{!this.state.deleteAll ? "Chọn tất cả" : "Bỏ chọn"}</Text>
                    </TouchableOpacity>
                </View>
                : null
        )
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        const { enableDelete } = this.state;
        return (
            this.listNotifications != null && this.listNotifications.length > 0 ?
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={{
                        padding: Constants.PADDING_LARGE
                    }}
                    onPress={() => {
                        if (this.state.enableDelete) {
                            if (this.listDelete != null && this.listDelete.length > 0) {
                                this.setState({ isAlertDelete: true });
                            }
                        } else {
                            this.setState({ enableDelete: true, deleteAll: false })
                        }
                    }}>
                    <Image source={ic_delete_white} />
                </TouchableOpacity>
                : <View style={{ paddingHorizontal: Constants.PADDING_X_LARGE + Constants.PADDING }}></View>
        )
    }

    /**
     * Render item
     */
    renderItemRow = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemNotification
                item={item}
                index={index}
                parentIndex={parentIndex}
                indexInParent={indexInParent}
                onChecked={this.onChecked}
                onPressItem={() => this.onPressedItem(item, index)}
                deleteObj={{
                    enable: this.state.enableDelete,
                    deleteAll: this.state.deleteAll,
                }}
            />
        )
    }

    onChecked = (itemPress) => {
        this.listNotifications.forEach(item => {
            if (item.id == itemPress.id) {
                item.isCheck = itemPress.isCheck;
                var itemUnCheck = this.listDelete.indexOf(item.id);
                if (itemPress.isCheck) {
                    if (itemUnCheck == -1) {
                        this.listDelete.push(item.id)
                    }
                } else {
                    if (itemUnCheck != -1) {
                        this.listDelete.splice(itemUnCheck, 1);
                    }
                }
            }
        });
        if (this.listDelete.length == this.listNotifications.length) {
            this.setState({ deleteAll: true });
        } else {
            this.setState({ deleteAll: false });
        }
        console.log("AAAAAAAAAAAAAAAAAAA", this.listDelete)
    }

    /**
     * set title and content for model item 
     * @param {*} title
     * @param {*} content
     */
    onPressedItem(item, index) {
        this.itemWatching = item;
        this.openModal(item.content, item.title);
        if (!item.seen) {
            this.updateNumberIsSeen(this.typeIsSeen.ONE_ITEM, item.id);
        }
    }

    /**
     * Render alert delete
     */
    renderAlertDelete() {
        return (
            <DialogCustom
                visible={this.state.isAlertDelete}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={localizes('notification')}
                textBtnOne={"Không"}
                textBtnTwo={"Xóa"}
                contentText={"Bạn có muốn xóa không?"}
                onTouchOutside={() => { this.setState({ isAlertDelete: false }) }}
                onPressX={() => {
                    this.setState({ isAlertDelete: false });
                }}
                onPressBtnPositive={() => {
                    this.setState({ isAlertDelete: false });
                    let filter = {
                        userId: this.state.userId,
                        paging: {
                            pageSize: Constants.PAGE_SIZE,
                            page: 0
                        },
                        notificationsDelete: this.listDelete
                    };
                    this.setState({
                        enableDelete: false,
                        deleteAll: false
                    });
                    this.props.deleteNotifications(filter);
                }}
            />
        )
    }
}

const mapStateToProps = state => ({
    data: state.notifications.data,
    isLoading: state.notifications.isLoading,
    errorCode: state.notifications.errorCode,
    action: state.notifications.action
})

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView)