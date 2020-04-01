import React, { Component } from "react";
import {
    View, Text, TouchableOpacity, Image,
    BackHandler, RefreshControl, TextInput, Keyboard
} from "react-native";
import BaseView from "containers/base/baseView";
import { Container, Header, Content, Root, Title } from "native-base";
import FlatListCustom from "components/flatListCustom";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";
import ItemListChat from "./itemListChat";
import firebase from "react-native-firebase";
import Utils from "utils/utils";
import StorageUtil from "utils/storageUtil";
import ic_search_white from "images/ic_search_white.png";
import ic_cancel_white from "images/ic_cancel_white.png";
import TextInputSetState from "./textInputSetState";
import DialogCustom from "components/dialogCustom";
import StringUtil from "utils/stringUtil";
import * as actions from "actions/userActions";
import * as commonActions from "actions/commonActions";
import { ErrorCode } from "config/errorCode";
import { getActionSuccess, ActionEvent } from "actions/actionEvent";
import { connect } from "react-redux";
import conversationStatus from "enum/conversationStatus";
import styles from "./styles";
import { async } from "rxjs/internal/scheduler/async";
import { localizes } from "locales/i18n";
import HeaderGradient from "containers/common/headerGradient";

class ListChatView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            isShowLoading: true,
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            isLoadingMore: false,
            stringSearch: null,
            isAlertDelete: false,
            itemSelected: null,
            mainConversation: [],
            showNoData: false
        };
        this.conversationIds = [];
        this.conversations = [];
        this.userId = null;
        this.onBackConversation = null;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
        this.getSourceUrlPath();
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            if (!Utils.isNull(user)) {
                this.userId = user.id;
                this.realTime = firebase.database().ref(`chats_by_user/u${user.id}/_all_conversation`);
                setTimeout(() => {
                    this.realTime.on("value", snap => {
                        this.readDataListChat();
                    });
                }, 1000);
            }
        }).catch(error => {
            this.saveException(error, "componentWillMount");
        });
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            this.props = nextProps;
            this.handleData();
        }
    };

    /**
     * read conversations on firebase
     * @param {*} usersKey (~ array contain userKey) is used when search
     */
    readDataListChat = async (usersKey) => {
        try {
            firebase
                .database()
                .ref(`chats_by_user/u${this.userId}/_conversation`)
                .orderByChild("deleted_last_updated_at")
                .startAt(`1_`)
                .endAt(`1_\uf8ff`)
                .once("value", conversationSnap => {
                    const conversationValue = conversationSnap.val();
                    console.log("conversationValue: ", conversationValue);
                    if (!Utils.isNull(conversationValue)) {
                        this.conversationIds = [];
                        conversationSnap.forEach(element => {
                            this.conversationIds.push(parseInt(StringUtil.getNumberInString(element.key)));
                        });
                        this.getInformationMemberChat();
                    } else {
                        this.setState({
                            refreshing: false,
                            isLoadingMore: false,
                            isShowLoading: false,
                            mainConversation: [],
                            showNoData: true
                        });
                    }
                });
        } catch (error) {
            this.saveException(error, "readDataListChat");
        }
    };

    /**
     * Get information member chat (name, avatarPath)
     */
    getInformationMemberChat() {
        if (this.conversationIds.length > 0) {
            this.props.getMemberOfConversation({
                conversationIds: this.conversationIds
            });
        }
    }

    /**
     * Get valueLastMessage and valueUnseen
     */
    getInformationConversation = async () => {
        if (this.conversations.length > 0) {
            for (let index = 0, size = this.conversations.length; index < size; index++) {
                let conversation = this.conversations[index];
                const lastMessageRef = firebase.database().ref(`chats_by_user/u${this.userId}/_conversation/c${conversation.conversationId}`);
                const lastMessageSnap = await lastMessageRef.once("value");
                const lastMessage = lastMessageSnap.val().last_messages;
                const deletedConversationRef = firebase.database().ref(`conversation/c${conversation.conversationId}/deleted`);
                const deletedConversationSnap = await deletedConversationRef.once("value");
                const deletedConversation = deletedConversationSnap.val();
                const unseenRef = firebase.database().ref(`members/c${conversation.conversationId}/u${this.userId}/number_of_unseen_messages`);
                const unseenSnap = await unseenRef.once("value");
                const valueUnseen = unseenSnap.val();
                let newConversation = {
                    ...conversation,
                    lastMessage,
                    unseen: valueUnseen,
                    deleted: deletedConversation
                };
                this.conversations[index] = newConversation;
            }
            // sort arr by updatedAt
            this.conversations.sort(function (a, b) {
                return parseInt(b.lastMessage.timestamp) - parseInt(a.lastMessage.timestamp);
            });
        }
        this.setState({
            refreshing: false,
            isLoadingMore: false,
            mainConversation: this.conversations,
            isShowLoading: false,
            showNoData: true
        });
        this.conversations = [];
    };

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        console.log("HANDLE DATA FROM LIST CHAT VIEW: ", data);
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_MEMBER_OF_CONVERSATION)) {
                    this.conversations = data;
                    // add information conversation
                    this.getInformationConversation();
                } else if (this.props.action == getActionSuccess(ActionEvent.DELETE_CONVERSATION)) {
                } else if (this.props.action == getActionSuccess(ActionEvent.SEARCH_CONVERSATION)) {
                    if (!Utils.isNull(data)) {
                        this.conversations = data;
                        this.getInformationConversation();
                    } else {
                        this.conversations = [];
                        this.getInformationConversation();
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    /**
     * Get more testing
     */
    getMoreTesting = () => {
        if (this.isLoadMore) {
            this.isLoadMore = false;
            global.pageConversation += 10;
            this.readDataListChat();
        }
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
        this.realTime.off();
    }

    //onRefreshing
    handleRefresh = () => {
        this.setState({
            refreshing: true,
            enableLoadMore: false
        });
        this.readDataListChat();
    };

    /**
     * Search user chat
     * @param {*} str
     */
    onSearch(str) {
        this.setState({
            stringSearch: str
        });
        if (!Utils.isNull(str)) {
            this.props.searchConversation({
                paramsSearch: str
            });
        } else {
            this.readDataListChat();
        }
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
                        // placeholder={localizes('listChatView.search')}
                        // iconRightSearch={ic_search_white}
                        // inputSearch={this.state.stringSearch}
                        onRef={ref => {
                            this.inputSearchRef = ref
                        }}
                        // onChangeTextInput={stringSearch => this.onSearch(stringSearch)}
                        // iconRightSearch={!Utils.isNull(this.state.stringSearch) ? ic_cancel_white : ic_search_white}
                        // onPressRightSearch={() => (!Utils.isNull(this.state.stringSearch) ? this.onSearch() : this.inputSearchRef.focus())}
                        // onSubmitEditing={() => Keyboard.dismiss()}
                        renderRightMenu={this.renderRightHeader}>
                    </HeaderGradient>
                    <FlatListCustom
                        contentContainerStyle={{
                            paddingVertical: Constants.PADDING_LARGE
                        }}
                        horizontal={false}
                        data={this.state.mainConversation}
                        itemPerCol={1}
                        renderItem={this.renderItemListChat.bind(this)}
                        showsVerticalScrollIndicator={false}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        isShowEmpty={this.state.showNoData}
                        textForEmpty={'Không có dữ liệu'}
                        styleEmpty={{ marginTop: Constants.MARGIN_XX_LARGE * 5 }}
                    />
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.state.isShowLoading)}
                    {this.renderDialogDelete()}
                </Root>
            </Container>
        );
    }

    /**
     * Render dialog delete conversation
     */
    renderDialogDelete() {
        const { itemSelected } = this.state;
        return (
            <DialogCustom
                visible={this.state.isAlertDelete}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={localizes('confirm')}
                textBtnOne={localizes('cancel')}
                textBtnTwo={localizes('delete')}
                contentText={localizes('listChatView.confirmTextChat')}
                onPressX={() => {
                    this.setState({ isAlertDelete: false });
                }}
                onPressBtnPositive={() => {
                    firebase
                        .database()
                        .ref()
                        .update({
                            [`members/c${itemSelected.conversationId}/u${this.userId}/deleted_conversation`]: true,
                            [`chats_by_user/u${this.userId}/_conversation/c${itemSelected.conversationId}/deleted`]: true,
                            [`chats_by_user/u${this.userId}/_conversation/c${itemSelected.conversationId}/deleted__last_updated_at`]: "0_0",
                            [`conversation/c${itemSelected.conversationId}/deleted`]: true
                        })
                        .then(() => {
                            this.readDataListChat();
                            // update DB
                            // + set conversation.status = 2 (suspended)
                            // + set conversation_member.deleted_conversation = true (with me id)
                            this.props.deleteConversation(itemSelected.conversationId);
                            this.setState({
                                isAlertDelete: false
                            });
                            this.onBackConversation ? this.onBackConversation() : null;
                        });
                }}
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
    renderItemListChat(item, index, parentIndex, indexInParent) {
        return (
            <ItemListChat
                data={this.state.mainConversation}
                item={item}
                index={index}
                onPressItemChat={() => {
                    this.props.navigation.navigate("Chat", {
                        userMember: {
                            id: item.userId,
                            name: item.name,
                            avatarPath: item.avatarPath
                        },
                        conversationId: item.conversationId
                    });
                    firebase
                        .database()
                        .ref(`members/c${item.conversationId}/u${this.userId}/number_of_unseen_messages`)
                        .set(0);
                    this.readDataListChat();
                }}
                onPressDeleteItem={() => {
                    this.setState({ isAlertDelete: true, itemSelected: item });
                }}
                resourcePath={this.resourceUrlPath.textValue}
            />
        );
    }
}

const mapStateToProps = state => ({
    data: state.listChat.data,
    isLoading: state.listChat.isLoading,
    error: state.listChat.error,
    errorCode: state.listChat.errorCode,
    action: state.listChat.action
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListChatView);