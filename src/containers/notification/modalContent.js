import React, { Component } from "react";
import {
    ImageBackground, View, StatusBar,
    Image, TouchableWithoutFeedback,
    BackHandler, Alert, Linking,
    RefreshControl, StyleSheet, Slider,
    TextInput, Dimensions, FlatList,
    TouchableHighlight, TouchableOpacity,
    ScrollView
} from "react-native";
import {
    Container, Header, Title, Left, Icon, Right,
    Button, Body, Content, Text, Card, CardItem, Form
} from "native-base";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import ic_back_model from 'images/ic_back_model.png';
import ic_next_white from 'images/ic_next_white.png';
import commonStyles from "styles/commonStyles";
import BaseView from "containers/base/baseView"
import TextInputCustom from "components/textInputCustom";
import ModalDropdown from 'components/dropdown';
import I18n, { localizes } from "locales/i18n";
import StringUtil from "utils/stringUtil";
import { Fonts } from "values/fonts";
import { months } from "moment";
import FlatListCustom from "components/flatListCustom";
import Modal from 'react-native-modalbox';
import moment from 'moment';
import DateUtil from "utils/dateUtil";
import CardViewCustom from "components/cardViewCustom";
import ic_close_black from "images/ic_close_black.png";

const screen = Dimensions.get("window");

export default class ModalContent extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            contentValue: null,
            titleValue: null
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
    }

    componentWillMount = () => {
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
    handleData() { }

    /**
     * Show Modal Week
     */
    showModal(contentValue, titleValue) {
        this.setState({
            contentValue,
            titleValue
        })
        this.refs.modalContent.open();
    }

    /**
     * hide Modal Week
     */
    hideModal() {
        this.refs.modalContent.close();
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentWillUnmount = () => {
    }

    render() {
        return (
            <Modal
                ref={"modalContent"}
                style={{
                    backgroundColor: "#00000000",
                    width: screen.width,
                    height: screen.height,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                backdrop={true}
                onClosed={() => {
                    this.hideModal()
                }}
                backButtonClose={true}
                swipeToClose={false}
            >
                <View style={{
                    borderRadius: Constants.CORNER_RADIUS,
                    width: screen.width - Constants.MARGIN_X_LARGE * 2,
                    alignItems: 'center'
                }}>            
                    <CardViewCustom
                        style={{}}
                        title={localizes("notificationView.notification")}
                        viewChild={        
                            <View style={{
                                justifyContent: 'center'
                            }}>
                                <TouchableOpacity 
                                    onPress={() => {this.hideModal()}}
                                    style={{alignItems: 'flex-end', marginTop: - Constants.MARGIN_12 * 3, marginHorizontal : Constants.MARGIN_X_LARGE}}>
                                    <Image
                                        style={{}}
                                        source={ic_close_black}/>
                                </TouchableOpacity>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={[commonStyles.text, {
                                        flex: 1,
                                        marginHorizontal: Constants.MARGIN_X_LARGE,
                                        marginTop: Constants.MARGIN_XX_LARGE,
                                        marginBottom: Constants.MARGIN_XX_LARGE,
                                        color: Colors.COLOR_BLACK,
                                        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
                                        fontWeight: 'bold'
                                    }]}>
                                        {this.state.contentValue}
                                    </Text>
                                </ScrollView>                             
                                {/*{
                                    this.renderCommonButton(
                                        localizes("close"),
                                        { color: Colors.COLOR_WHITE },
                                        { marginVertical: Constants.MARGIN_X_LARGE },
                                        () => { this.hideModal() }
                                    )
                                }*/}
                            </View>
                        }
                    />
                </View>
            </Modal>
        );
    }
}