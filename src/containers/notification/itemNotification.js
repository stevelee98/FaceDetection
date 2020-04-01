'use strict';
import React, { PureComponent } from 'react';
import {
    ImageBackground, View, StatusBar, TextInput,
    ScrollView, TouchableOpacity, Modal, Image,
    Dimensions, FlatList, ActivityIndicator, Alert
} from "react-native";
import {
    Root, Form, Textarea, Container, Header, Title, Left, Right,
    Button, Body, Content, Text, Card, CardItem,
    Fab, Footer, Input, Item, Toast, ActionSheet
} from "native-base";
import commonStyles from "styles/commonStyles";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import { Fonts } from "values/fonts";
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import DateUtil from 'utils/dateUtil';
import Utils from 'utils/utils';
import notificationType from 'enum/notificationType';
import { CheckBox } from 'react-native-elements';
import styles from './styles';
import { thisExpression } from '@babel/types';
import logo from 'images/logo.png';


class ItemNotification extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            isCheck: false
        }
        this.W_H_IMAGE = 36;
        this.W_H_SEEN = 10;
        this.RADIUS = 5;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            this.props = nextProps
        }
    }

    render() {
        const { item, index, onPressItem, deleteObj } = this.props;
        let parseItem = {
            title: item.title,
            content: item.content,
            date: item.createdAt,
            isSeen: item.seen,
            image: item.image,
            type: item.type,
            isTemp: item.isTemp,
            isCheck: item.isCheck
        };
        const numberRow = 3;
        return (
            <View style={{
                backgroundColor: parseItem.isSeen ? Colors.COLOR_BACKGROUND : Colors.COLOR_GRAY_HIGHLIGHT,
                paddingVertical: Constants.PADDING_LARGE,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                borderBottomWidth: Constants.BORDER_WIDTH / 2,
                borderBottomColor: parseItem.isSeen ? Colors.COLOR_BORDER : Colors.COLOR_GRAY_HIGHLIGHT,
            }}>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={{
                        flex: 1,
                        paddingVertical: Constants.PADDING_LARGE,
                        backgroundColor: parseItem.isSeen ? Colors.COLOR_BACKGROUND : Colors.COLOR_GRAY_HIGHLIGHT,
                        alignItems: 'flex-start',
                        paddingHorizontal: Constants.PADDING_X_LARGE
                    }}
                    onPress={() => deleteObj.enable ? this.onCheck() : onPressItem()}>
                    <View style={[commonStyles.viewHorizontal, { alignItems: 'flex-start' }]}>
                        <View style={[commonStyles.viewCenter, {
                            position: 'relative',
                            alignItems: 'center',
                            marginHorizontal: Constants.MARGIN_X_LARGE,
                            //marginLeft: parseItem.isSeen ? Constants.MARGIN_X_LARGE : Constants.MARGIN_XX_LARGE,
                            marginVertical: Constants.MARGIN_LARGE,
                            width: this.W_H_IMAGE,
                            height: this.W_H_IMAGE,
                            borderRadius: this.W_H_IMAGE / 2,
                            backgroundColor: parseItem.isSeen ? Colors.COLOR_WHITE : Colors.COLOR_GRAY_HIGHLIGHT,
                        }]}>
                            <Image source={logo} />
                            {/* {
                                !parseItem.isSeen
                                    ? <View
                                        style={{
                                            position: "absolute",
                                            backgroundColor: Colors.COLOR_TURQUOISE,
                                            height: this.W_H_SEEN,
                                            width: this.W_H_SEEN,
                                            borderRadius: this.RADIUS,
                                            top: - 1, right: 1
                                        }} />
                                    : null
                            } */}
                        </View>
                        <View style={commonStyles.viewHorizontal}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    numberOfLines={numberRow}
                                    ellipsizeMode={'tail'}
                                    style={[commonStyles.text, {
                                        padding: 0, marginTop: Constants.MARGIN,
                                        color: parseItem.isTemp ? Colors.COLOR_GRAY : Colors.COLOR_TEXT,
                                        fontSize: parseItem.isTemp ? Fonts.FONT_SIZE_X_SMALL : Fonts.FONT_SIZE_MEDIUM - 1
                                    }]}>
                                    {parseItem.content}
                                </Text>
                                <Text style={[commonStyles.textItalic, {
                                    padding: 0,
                                    margin: 0,
                                    marginTop: Constants.MARGIN,
                                    alignSelf: 'flex-start',
                                    fontSize: Fonts.FONT_SIZE_X_SMALL + 1,
                                    opacity: 0.5
                                }]}>{DateUtil.convertFromFormatToFormat(parseItem.date, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)}, lúc {DateUtil.convertFromFormatToFormat(parseItem.date, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_TIME)}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                {deleteObj.enable ? this.renderCheckBox(parseItem) : null}
            </View>

        )
    }

    /**
     * Render check box
     */
    renderCheckBox(parseItem) {
        const { item, index } = this.props;
        return (
            <CheckBox
                key={index}
                checkedColor={Colors.COLOR_TEXT}
                // checkedIcon='check-square'
                // uncheckedIcon='circle-o'
                iconRight
                checked={item.isCheck}
                containerStyle={[styles.checkBox, {backgroundColor: parseItem.isSeen ? Colors.COLOR_WHITE : Colors.COLOR_GRAY_HIGHLIGHT
                , marginRight: Constants.MARGIN_XX_LARGE}]}
                onPress={this.onCheck}
            />
        )
    }

    /**
     * On check
     */
    onCheck = () => {
        const { item } = this.props;
        item.isCheck = !item.isCheck;
        this.props.onChecked(item);
        this.setState({ isCheck: !this.state.isCheck })
    }
}

export default ItemNotification;