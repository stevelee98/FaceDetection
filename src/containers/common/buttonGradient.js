import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground, ActivityIndicator, Dimensions, View, StatusBar, TextInput, ScrollView, TouchableOpacity, Image, Keyboard } from "react-native";
import { Form, Textarea, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Fab, Footer, Input, Item } from "native-base";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import ic_back_white from "images/ic_back_white.png";
import ic_notification_white from "images/ic_notification_white.png";
import { Fonts } from "values/fonts";
import ic_default_user from "images/ic_default_user.png";
import shadow_avatar_home from "images/shadow_avatar_home.png";
import Utils from "utils/utils";
import ImageLoader from "components/imageLoader";
import BackgroundShadow from "components/backgroundShadow";
import ic_cart_grey from "images/ic_cart_grey.png";
import StringUtil from "utils/stringUtil";
import LinearGradient from "react-native-linear-gradient";
import I18n from 'react-native-i18n';
import { localizes } from 'locales/i18n';

export default class ButtonGradient extends BaseView {
    static defaultProps = {
        title: '',
        titleStyle: {},
        buttonStyle: {},
        onPress: null,
        disableButton: false,
        viewStyle: {},
        isLoading: false,
        //onPressItem: this.props.onPress ? this.props.onPress : this.onPressCommonButton.bind(this)
    }
    constructor(props) {
        super(props)
    }
    onPressCommonButton() {
    }
    render() {
        const { onPress, title, titleStyle, buttonStyle, isLoading, viewStyle, disableButton,styles } = this.props
        return (

            // <View style={{
            //     elevation: Constants.ELEVATION,
            //     shadowOffset: {
            //         width: Constants.SHADOW_OFFSET_WIDTH,
            //         height: Constants.SHADOW_OFFSET_HEIGHT
            //     },
            //     shadowOpacity: Constants.SHADOW_OPACITY,
            //     shadowColor: Colors.COLOR_GREY_LIGHT,
            //     backgroundColor: Colors.COLOR_DRK_GREY,
            // }}>

            <View style={[viewStyle]}>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    disabled={disableButton}
                    onPress={onPress}>
                    <LinearGradient colors={['#139e8d', '#34e77f']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[commonStyles.shadowOffset, commonStyles.buttonStyle, buttonStyle, {
                            paddingVertical: Constants.PADDING_12,
                            margin: 0,
                            borderRadius: Constants.CORNER_RADIUS / 2,                            
                            marginHorizontal: Constants.MARGIN_X_LARGE,
                        },styles]}>
                        {!isLoading
                            ? <Text style={[commonStyles.text, titleStyle]} >
                                {title}
                            </Text>
                            : <ActivityIndicator color={Colors.COLOR_WHITE} animating size="large" />
                        }
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            // </View>
        )
    }
}