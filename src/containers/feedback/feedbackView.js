import React, { Component } from 'react';
import { View, Text, RefreshControl, BackHandler, Image, Dimensions, Platform } from 'react-native';
import BaseView from 'containers/base/baseView';
import styles from './styles';
import { Container, Root, Header, Content } from 'native-base';
import commonStyles from 'styles/commonStyles';
import { Constants } from 'values/constants';
import { localizes } from 'locales/i18n';
import { Colors } from 'values/colors';
import FlatListCustom from 'components/flatListCustom';
import * as actions from "actions/userActions";
import * as feedbackAction from "actions/feedbackAction";
import { connect } from "react-redux";
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import Utils from 'utils/utils';
//import ItemBranch from './itemBranch';
import TextInputCustom from 'components/textInputCustom';
import DialogCustom from 'components/dialogCustom';
import Dialog, { DIALOG_WIDTH } from 'components/dialog'
import StringUtil from 'utils/stringUtil';
import StorageUtil from 'utils/storageUtil';
import ic_my_location_black from 'images/ic_my_location_black.png';
import img_done_black from 'images/img_done_black.png';
import { Fonts } from 'values/fonts';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderGradient from 'containers/common/headerGradient';

//import ic_mail_red from 'images/ic_mail_red.png';
//import ic_call_red from 'images/ic_call_red.png';
const deviceWidth = Dimensions.get("window").width
const HEIGHT_FEEDBACK_CONTENT = 200;

class FeedbackView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            enableRefresh: false,
            refreshing: false,
            fullName: "",
            phone: "",
            email: "",
            message: "",
            address: "",
            isAlertSuccess: false,
            contactName: '',
            contactAddress: '',
            contactPhone: '',
            contactEmail: '',
            user: null,
            userId: null
        };
        this.branches = [];

    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        this.getProfile();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    /**
    * Get profile user
    */
    getProfile() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user)) {
                this.setState({
                    user: user,
                    userId: user.id,
                    fullName: user.name,
                    phone: user.phone,
                    email: user.email
                });
                this.props.getUserProfile(user.id);
            }
        }).catch((error) => {
            this.saveException(error, 'getProfile');
        });
    }

    /**
     * getSourceUrlPath
     */
    getSourceUrlPath = () => {
        StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG).then((faq) => {
            if (!Utils.isNull(faq)) {
                let contactName = faq.find(x => x.name == 'contact.name');
                let contactAddress = faq.find(x => x.name == 'contact.address');
                let contactPhone = faq.find(x => x.name == 'contact.phone');
                let contactEmail = faq.find(x => x.name == 'contact.email');
                this.setState({
                    contactName: !Utils.isNull(contactName) ? contactName.textValue : "",
                    contactAddress: !Utils.isNull(contactAddress) ? contactAddress.textValue : "",
                    contactPhone: !Utils.isNull(contactPhone) ? contactPhone.textValue : "",
                    contactEmail: !Utils.isNull(contactEmail) ? contactEmail.textValue : ""
                });
            } else {
                // this.props.getConfig();
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
        });
    }

    /**
     * Handle data
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_BRANCH)) {
                    if (!Utils.isNull(data)) {
                        this.branches = data;
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.SEND_FEEDBACK)) {
                    if (data) {
                        this.setState({ isAlertSuccess: true })
                        setTimeout(() => { this.setState({ isAlertSuccess: false }, this.onBack()) }, 2000)
                    }
                }

            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
    }

    /**
     * Handle request
     */
    handleRequest() {
        this.props.getUserProfile(this.state.userId);
    }

    /**
     * On refresh
     */
    handleRefresh = () => {
        this.handleRequest();
    };

    /**
     * validate
     */
    validate() {
        const { fullName, phone, message, email } = this.state;
        const res = phone.charAt(0);
        if (Utils.isNull(fullName) || fullName.trim() == '') {
            this.showMessage(localizes("feedback.vali_fill_fullname"));
        } else if (StringUtil.validSpecialCharacter(fullName)) {
            this.showMessage(localizes("feedback.vali_fill_fullname"));
        } else if (fullName.length > 60) {
            this.showMessage(localizes("feedback.vali_fullname_length"));
        } else if (Utils.isNull(phone)) {
            this.showMessage(localizes("feedback.vali_fill_phone"));
        } else if (phone.length != 10 || res != "0") {
            this.showMessage(localizes("feedback.errorPhone"));
        } else if (!Utils.validatePhone(phone)) {
            this.showMessage(localizes("feedback.vali_phone"));
        } else if (Utils.isNull(message)) {
            this.showMessage(localizes("feedback.vali_message"));
        } else if (Utils.isNull(email)) {
            this.showMessage(localizes("feedback.vali_fill_mail"));
            this.email.focus();
        } else if (!Utils.validateEmail(email)) {
            this.showMessage(localizes("feedback.vali_mail"));
            this.email.focus();
        }
        else {
            this.onSendFeedback();
        }
    }

    /**
     * On send contact
     */
    onSendFeedback() {
        const { fullName, email, phone, message, address } = this.state;
        let filter = {
            name: fullName,
            email: email,
            phone: phone,
            message: message
        }
        this.props.sendFeedback(filter);
    }
    /**
         * Render right menu
         */
    renderRightMenu = () => {
        const { enableDelete } = this.state;
        return (
            <View style={{ paddingHorizontal: Constants.PADDING_X_LARGE + Constants.PADDING }}></View>
        )
    }

    render() {
        const { contactName, contactAddress, contactPhone, contactEmail } = this.state;
        console.log('contactName', contactName)
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        visibleStage={false}
                        onBack={this.onBack}
                        title={localizes("feedback.title")}
                        backgroundColor={Colors.COLOR_PRIMARY}
                        renderRightMenu={this.renderRightMenu}>
                    </HeaderGradient>
                    <Content
                        showsVerticalScrollIndicator={false}
                        ref={e => { this.fScroll = e }}
                        contentContainerStyle={{
                            paddingVertical: Constants.PADDING_LARGE
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }>
                        {this.renderContactInfo()}
                    </Content>
                    {this.renderAlertSuccess()}
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }

    /**
     * Render contact info
     */
    renderContactInfo() {
        return (
            <View style={[{}]}>
                {/* Full name */}
                <TextInputCustom
                    title={localizes("feedback.fullName")}
                    inputNormalStyle={{}}
                    refInput={input => (this.fullName = input)}
                    isInputNormal={true}
                    placeholder={localizes("feedback.fillFullName")}
                    value={this.state.fullName}
                    onChangeText={fullName => this.setState({ fullName })}
                    onSubmitEditing={() => {
                        this.phone.focus();
                    }}
                    returnKeyType={"next"}
                    hrEnable={true}
                />
                {/*PhoneNumber*/}
                <TextInputCustom
                    title={localizes("feedback.phone")}
                    inputNormalStyle={{}}
                    refInput={input => {
                        this.phone = input;
                    }}
                    isInputNormal={true}
                    placeholder={localizes("feedback.fillPhone")}
                    value={this.state.phone}
                    onChangeText={phone =>
                        this.setState({
                            phone: phone
                        })
                    }
                    onSubmitEditing={() => {
                        this.email.focus();
                    }}
                    keyboardType="phone-pad"
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    numberOfLines={1}
                    hrEnable={true}
                />
                {/*Email*/}
                <TextInputCustom
                    title={localizes("feedback.email")}
                    inputNormalStyle={{}}
                    refInput={input => {
                        this.email = input;
                    }}
                    isInputNormal={true}
                    placeholder={localizes("feedback.fillEmail")}
                    value={this.state.email}
                    onChangeText={email =>
                        this.setState({
                            email: email
                        })
                    }
                    onSubmitEditing={() => {
                        this.message.focus();
                    }}
                    keyboardType="email-address"
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    numberOfLines={1}
                    hrEnable={true}
                />
                {/* Message */}
                <TextInputCustom
                    title={localizes("feedback.message")}
                    refInput={input => {
                        this.message = input;
                    }}
                    value={this.state.message}
                    onChangeText={message =>
                        this.setState({
                            message: message
                        })
                    }
                    onSubmitEditing={() => {
                    }}
                    inputNormalStyle={[commonStyles.inputText, { textAlignVertical: 'top', borderRadius: Constants.CORNER_RADIUS }]}
                    isMultiLines={true}
                    placeholder={localizes("feedback.fillMessage")}
                    keyboardType="default"
                    editable={true}
                    numberOfLines={10}
                    minHeight={Platform.OS === 'ios'? HEIGHT_FEEDBACK_CONTENT : null}
                    multiline={true}
                    underlineColorAndroid="transparent"
                    hrEnable={true}
                />
                {this.renderCommonButton(
                    localizes("feedback.send"),
                    { color: Colors.COLOR_WHITE },
                    {
                        paddingHorizontal: Constants.PADDING_X_LARGE,
                        marginHorizontal: Constants.MARGIN_X_LARGE,
                        alignSelf: 'flex-end'
                    },
                    () => this.validate()
                )}
            </View>
        )
    }

    /**
     * Render alert success
     */
    renderAlertSuccess() {
        return (
            <Dialog
                visible={this.state.isAlertSuccess}
                dialogStyle={[commonStyles.shadowOffset, {
                    borderRadius: Constants.CORNER_RADIUS,
                    backgroundColor: Colors.COLOR_WHITE,
                }]}
                onTouchOutside={() => { this.onBack() }}
                renderContent={
                    () => {
                        return (
                            <View style={{ margin: Constants.MARGIN_X_LARGE, padding: Constants.PADDING_X_LARGE, justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={img_done_black} style={{ width: 120, height: 120 }} resizeMode="contain"></Image>
                                <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_X_MEDIUM, textAlign: 'center', margin: 0, padding: 0, marginTop: Constants.MARGIN_X_LARGE }]}>{localizes("feedback.sendSuccess")}</Text>
                            </View>
                        )
                    }
                } />
        );
    }
}

const mapStateToProps = state => ({
    data: state.feedback.data,
    isLoading: state.feedback.isLoading,
    error: state.feedback.error,
    errorCode: state.feedback.errorCode,
    action: state.feedback.action
});

const mapDispatchToProps = {
    ...actions,
    ...feedbackAction
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeedbackView);