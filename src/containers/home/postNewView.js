import React, { Component } from 'react';
import { View, Text, RefreshControl } from 'react-native';
import BaseView from 'containers/base/baseView';
import styles from './styles';
import { Container, Root } from 'native-base';
import FlatListCustom from 'components/flatListCustom';
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { connect } from 'react-redux';
import * as postActions from 'actions/postActions';
import * as commonActions from 'actions/commonActions';
import { ErrorCode } from "config/errorCode";
import Utils from "utils/utils";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { localizes } from 'locales/i18n';
import ItemPostNew from './itemPostNew';
import imageOrientationType from 'enum/imageOrientationType';
import ModalImageViewer from './modal/modalImageViewer';
import DateUtil from 'utils/dateUtil';

class PostNewView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            isLoadingMore: false
        };
        this.postNews = [];
        this.showNoData = false;
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            }
        };
    }

    componentDidMount() {
        this.getSourceUrlPath();
        this.handleRequest();
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
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_POSTS)) {
                    this.state.refreshing = false;
                    this.state.isLoadingMore = false;
                    if (!Utils.isNull(data)) {
                        if (data.paging.page == 0) {
                            this.postNews = [];
                        }
                        if (data.data.length > 0) {
                            this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                            data.data.forEach(item => {
                                this.postNews.push({ ...item, isShowDate: true });
                            });
                            this.handleDatePost(this.postNews);
                        }
                        console.log("DATA_POST", this.postNews)
                    }
                    this.showNoData = true;
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    /**
     * Handle date post
     */
    handleDatePost(posts) {
        this.nextIndex = 0;
        this.nextElement = null;
        for (let index = 0; index < posts.length; index++) {
            const element = posts[index]
            if (index + 1 > posts.length - 1) {
                break;
            } else {
                this.nextIndex = index + 1
            }
            this.nextElement = posts[this.nextIndex];
            if (
                new Date(Number(this.getTimestamp(element.createdAt))).getMonth() + 1 === new Date(Number(this.getTimestamp(this.nextElement.createdAt))).getMonth() + 1
                && new Date(Number(this.getTimestamp(element.createdAt))).getDate() === new Date(Number(this.getTimestamp(this.nextElement.createdAt))).getDate()
                && new Date(Number(this.getTimestamp(element.createdAt))).getFullYear() === new Date(Number(this.getTimestamp(this.nextElement.createdAt))).getFullYear()
            ) {
                this.nextElement.isShowDate = false;
            }
        }
    }

    /**
     * GetT timestamp
     */
    getTimestamp(createdAt) {
        return DateUtil.getTimestamp(DateUtil.convertFromFormatToFormat(createdAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_TIME_ZONE_T)) * 1000;
    }

    render() {
        return (
            <View>
                <FlatListCustom
                    contentContainerStyle={{}}
                    style={[{
                        backgroundColor: Colors.COLOR_BACKGROUND
                    }]}
                    keyExtractor={item => item.code}
                    data={this.postNews}
                    renderItem={this.renderItem}
                    enableRefresh={this.state.enableRefresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                    enableLoadMore={this.state.enableLoadMore}
                    onLoadMore={() => {
                        this.loadMore()
                    }}
                    showsVerticalScrollIndicator={false}
                    isShowEmpty={this.showNoData}
                    textForEmpty={localizes("noData")}
                    styleEmpty={{ marginTop: Constants.MARGIN_XX_LARGE * 5 }}
                />
                <ModalImageViewer
                    ref={'modalImageViewer'}
                // parentView={this}
                />
            </View>
        );
    }

    /**
     * Render item
     */
    renderItem = (item, index, parentIndex, indexInParent) => {
        let pathResize = !Utils.isNull(this.resourceUrlPathResize) ? this.resourceUrlPathResize.textValue : '';
        let path = !Utils.isNull(this.resourceUrlPath) ? this.resourceUrlPath.textValue : '';
        return (
            <ItemPostNew
                data={this.postNews}
                item={item}
                index={index}
                resourceUrlPathResize={pathResize}
                resourceUrlPath={path}
                onPressImage={this.onPressImage}
            />
        )
    }

    /**
     * On press image
     */
    onPressImage = (images, index) => {
        this.refs.modalImageViewer.showModal(images, index);
    }

    /**
     * Handle refresh
     */
    handleRefresh = () => {
        this.state.refreshing = true;
        this.state.enableLoadMore = false;
        this.filter.paging.page = 0;
        this.handleRequest();
    }

    /**
     * Get more post
     */
    loadMore = () => {
        this.state.isLoadingMore = true;
        this.filter.paging.page += 1;
        this.handleRequest();
    }

    /**
     * Handle request
     */
    handleRequest = () => {
        this.props.getPosts(this.filter);
    }
}

const mapStateToProps = state => ({
    data: state.post.data,
    isLoading: state.post.isLoading,
    error: state.post.error,
    errorCode: state.post.errorCode,
    action: state.post.action
})

const mapDispatchToProps = {
    ...postActions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(PostNewView)
