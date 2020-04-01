import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, Image, Modal, RefreshControl,
    BackHandler, Animated, Dimensions
} from 'react-native';
import BaseView from 'containers/base/baseView';
import { Container, Root, Header, Content } from 'native-base';
import styles from './styles';
import commonStyles from 'styles/commonStyles';
import { localizes } from 'locales/i18n';
import { Constants } from 'values/constants';
import FlatListCustom from 'components/flatListCustom';
import ImageViewer from 'react-native-image-zoom-viewer';
import ic_cancel_white from 'images/ic_cancel_white.png';
import Utils from 'utils/utils';
import * as commonActions from 'actions/commonActions';
import * as photoLibraryActions from 'actions/photoLibraryActions';
import { connect } from 'react-redux';
import { Colors } from "values/colors";
import StorageUtil from 'utils/storageUtil';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import ItemPhotoLib from './itemPhotoLib';
import categoryType from 'enum/categoryType';
import ItemImageCategory from './itemImageCategory'
import ModalImageViewer from './modal/modalImageViewer';

const screen = Dimensions.get("window");

class PhotoLibraryView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            isLoadingMore: false,
            itemSelected: 0
        };
        this.filterCategories = {
            type: categoryType.PHOTO_LIBRARY
        }
        this.filter = {
            paging: {
                page: 0,
                pageSize: Constants.PAGE_SIZE
            },
            imageTypeId: null
        }
        this.dataCategory = [];
        this.showNoDataCategory = false
        this.data = [];
        this.dataImages = [];
        this.showNoData = false;
    }
    componentDidMount() {
        this.getSourceUrlPath();
        this.handleRequest();
    }

    // Handle request
    handleRequest() {
        this.props.getImageCategories(this.filterCategories);
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
        console.log("HANLE DATA PHOTO LIB: ", this.props.action);
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_IMAGE_CATEGORIES)) {
                    this.dataCategory = [{ name: "Tất cả" }];
                    if (!Utils.isNull(data)) {
                        data.forEach(item => {
                            if (this.dataCategory.indexOf(item) == -1) {
                                this.dataCategory.push(item);
                            }
                        })
                        this.dataImages = []
                        this.props.getImages(this.filter);
                    } else {
                        this.showNoDataCategory = true;
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_IMAGES)) {
                    this.state.refreshing = false;
                    this.state.isLoadingMore = false;
                    if (!Utils.isNull(data)) {
                        if (data.paging.page == 0) {
                            this.data = [];
                            this.dataImages = [];
                        }
                        if (data.data.length > 0) {
                            this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                            data.data.forEach(item => {
                                this.data.push({ ...item });
                                let image = !Utils.isNull(item.path) && item.path.indexOf('http') != -1
                                    ? item.path : !Utils.isNull(this.resourceUrlPath) ? this.resourceUrlPath.textValue + "/sr/display?" + "op=resize&w=" + Math.ceil(screen.width) + "&path=" + item.path : '';
                                this.dataImages.push({ path: image })
                            });
                        } else {
                            this.data = [];
                            this.dataImages = [];
                        }
                    }
                    this.showNoData = true;
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    render() {
        const { enableRefresh, refreshing, enableLoadMore } = this.state;
        return (
            <View>
                <FlatListCustom
                    ListHeaderComponent={
                        <FlatListCustom
                            contentContainerStyle={{}}
                            style={[{
                                padding: Constants.PADDING_LARGE
                            }]}
                            horizontal={true}
                            keyExtractor={item => item.code}
                            data={this.dataCategory}
                            renderItem={this.renderItemCategory.bind(this)}
                            showsHorizontalScrollIndicator={false}
                            isShowEmpty={this.showNoDataCategory}
                            textForEmpty={localizes("noData")}
                            styleEmpty={{ marginTop: Constants.MARGIN_XX_LARGE }}
                        />
                    }
                    contentContainerStyle={{
                        paddingVertical: Constants.PADDING_LARGE
                    }}
                    style={[{
                        backgroundColor: Colors.COLOR_WHITE
                    }]}
                    horizontal={false}
                    keyExtractor={item => item.id}
                    data={this.data}
                    itemPerRow={2}
                    renderItem={this.renderItem.bind(this)}
                    enableRefresh={enableRefresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                    enableLoadMore={enableLoadMore}
                    onLoadMore={() => {
                        this.loadMore()
                    }}
                    showsVerticalScrollIndicator={false}
                    isShowEmpty={this.showNoData}
                    textForEmpty={localizes("noData")}
                    styleEmpty={{ marginTop: Constants.MARGIN_XX_LARGE * 5 }}
                />
                <ModalImageViewer
                    data={this.data}
                    ref={'modalImageViewer'}
                // parentView={this}
                />
            </View>
        );
    }

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.state.enableLoadMore = false;
        this.filter.paging.page = 0;
        this.handleRequest();
    }


    /**
     * Load more
     */
    loadMore = async () => {
        this.state.isLoadingMore = true;
        this.filter.paging.page += 1;
        this.dataImages = []
        this.props.getImages(this.filter);
    }

    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItem(item, index, parentIndex, indexInParent) {
        return (
            <ItemPhotoLib
                key={item.id}
                data={this.data}
                item={item}
                index={index}
                onPress={this.onClickItem}
                resourceUrlPathResize={this.resourceUrlPathResize}
            />
        );
    }

    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItemCategory(item, index, parentIndex, indexInParent) {
        return (
            <ItemImageCategory
                key={item.id}
                dataCategory={this.dataCategory}
                item={item}
                index={index}
                itemSelected={this.state.itemSelected}
                onPress={this.onClickItemCategory}
            />
        );
    }

    /**
     * On click item
     */
    onClickItem = (images, index) => {
        this.refs.modalImageViewer.showModal(this.dataImages, index);
    }

    /**
     * On click item category
     */
    onClickItemCategory = (item, index) => {
        this.setState({ itemSelected: index });
        this.filter.paging.page = 0;
        if (item.id != null) {
            this.filter.imageTypeId = item.id;
        } else {
            this.filter.imageTypeId = null;
        }
        this.dataImages = []
        this.props.getImages(this.filter);
    }
}

const mapStateToProps = state => ({
    data: state.photoLibrary.data,
    isLoading: state.photoLibrary.isLoading,
    error: state.photoLibrary.error,
    errorCode: state.photoLibrary.errorCode,
    action: state.photoLibrary.action
});

const mapDispatchToProps = {
    ...photoLibraryActions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoLibraryView);

