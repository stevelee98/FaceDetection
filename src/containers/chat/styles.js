import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from 'values/constants';
import { Fonts } from "values/fonts";
import { CheckBox } from "native-base";
const { Dimensions, Platform } = React;
const { StyleSheet } = React;

export default {
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.COLOR_BACKGROUND
    },
    header: {
        justifyContent: 'flex-start', alignItems: 'center', backgroundColor: Colors.COLOR_PRIMARY, paddingLeft: Constants.PADDING_X_LARGE, borderBottomWidth: 0
    }, title: {
        color: 'white'
    },
    input: {
        height: '100%',
        textAlignVertical: 'bottom',
        marginHorizontal: -5
    },
    item: {
        alignItems: 'center',
        marginVertical: Constants.PADDING_X_LARGE,
        paddingHorizontal: Constants.PADDING_LARGE,
    },
    name: {
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: 0
    },
    price: {
        fontSize: Fonts.FONT_SIZE_X_LARGE,
        color: Colors.COLOR_PRIMARY,
        margin: 0
    },
    checkBox: {
        backgroundColor: Colors.COLOR_WHITE,
        borderWidth: 0,
        padding: 0,
    },
    listPriceContainer: {
        flex: 1,
        paddingHorizontal: Constants.PADDING_X_LARGE,
        backgroundColor: Colors.COLOR_WHITE,
        padding: Constants.PADDING_X_LARGE * 2
    },
    btnDeleteImage: {
        padding: Constants.PADDING,
        position: 'absolute',
        borderRadius: Constants.CORNER_RADIUS / 2,
        top: Constants.MARGIN,
        right: Constants.MARGIN_LARGE,
        backgroundColor: Colors.COLOR_GREY_LIGHT
    },
    itemImageContainer: { marginVertical: Constants.PADDING_X_LARGE, marginHorizontal: Constants.MARGIN_LARGE, borderWidth: 1, borderColor: Colors.COLOR_GREY_LIGHT, borderRadius: Constants.CORNER_RADIUS / 2 },
    dockSendMess: {
        justifyContent: 'center',
        borderTopLeftRadius: Constants.CORNER_RADIUS,
        borderTopRightRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_GREY,
    },
    flatListSendImages: {
        paddingHorizontal: Constants.MARGIN_LARGE,
        height: 180 + Constants.MARGIN_XX_LARGE,
        borderTopLeftRadius: Constants.CORNER_RADIUS,
        borderTopRightRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_GREY
    },
    borderMessage: {
        borderRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_WHITE,
        borderColor: Colors.COLOR_TEXT,
        borderWidth: Constants.DIVIDE_HEIGHT_SMALL,
        padding: Constants.MARGIN_LARGE
    }
};