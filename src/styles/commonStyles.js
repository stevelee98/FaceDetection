import React from "react-native";
import { Dimensions } from "react-native";
import { Constants } from 'values/constants'
import { Fonts } from 'values/fonts'
import { Colors } from 'values/colors'
import { Platform } from "react-native";

const { StyleSheet } = React;
const screen = Dimensions.get("window");

export default {
    text: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
    },
    textBold: {
        color: Colors.COLOR_TEXT,
        fontFamily: Fonts.FONT_BOLD,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        fontWeight: 'bold'
    },
    textItalic: {
        color: Colors.COLOR_TEXT,
        fontFamily: Fonts.FONT_ITALIC,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        fontStyle: 'italic',
    },
    textBoldItalic: {
        color: Colors.COLOR_TEXT,
        fontFamily: Fonts.FONT_BOLD_ITALIC,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        fontStyle: 'italic',
    },
    title: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_LARGE,
        margin: Constants.MARGIN,
    },
    titleBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        fontWeight: 'bold'
    },
    titleBoldCardView: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_LARGE,
        margin: Constants.MARGIN,
        fontWeight: 'bold'
    },
    marginLeftRight: {
        marginLeft: Constants.MARGIN_X_LARGE,
        marginRight: Constants.MARGIN_X_LARGE,
    },
    textSmall: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_SMALL,
        margin: Constants.MARGIN
    },
    textSmallBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_SMALL,
        margin: Constants.MARGIN,
        fontWeight: 'bold'
    },
    textSmallItalic: {
        color: Colors.COLOR_TEXT,
        fontFamily: Fonts.FONT_ITALIC,
        fontSize: Fonts.FONT_SIZE_X_SMALL,
        margin: Constants.MARGIN
    },
    fabBigSize: {
        width: Constants.BIG_CIRCLE,
        height: Constants.BIG_CIRCLE,
        borderRadius: Constants.BIG_CIRCLE,
        backgroundColor: Colors.COLOR_PRIMARY,
        margin: 0,
    },
    viewHorizontal: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textOrange: {
        color: Colors.COLOR_PRIMARY,
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        margin: Constants.MARGIN,
    },
    textOrangeBold: {
        color: Colors.COLOR_PRIMARY,
        fontFamily: Fonts.FONT_BOLD,
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        margin: Constants.MARGIN,
        fontWeight: 'bold'
    },
    buttonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: Constants.CORNER_RADIUS,
        marginVertical: Constants.MARGIN_LARGE,
        backgroundColor: Colors.COLOR_TEXT,
        // paddingHorizontal: Constants.PADDING_X_LARGE,
        paddingVertical: Constants.PADDING_LARGE
    },
    buttonImage: {
        marginBottom: Constants.MARGIN_X_LARGE,
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: Constants.CORNER_RADIUS,
    },
    inputText: {
        paddingVertical: Constants.PADDING_LARGE,
        paddingHorizontal: Constants.PADDING_X_LARGE,
        borderWidth: Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_BORDER,
        backgroundColor: Colors.COLOR_WHITE,
        marginVertical: Constants.MARGIN_LARGE,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        borderRadius: Constants.PADDING
    },
    pickerStyle: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: '10%',
    },
    shadowOffset: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT
    },
    viewCenter: {
        justifyContent: "center",
        alignItems: "center",
    },
    touchInputSpecial: {
        flex: 1,
        flexDirection: 'row',
        fontWeight: 'bold',
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT,
        borderRadius: Constants.CORNER_RADIUS,
    },
    marginForShadow: {
        marginVertical: Constants.MARGIN_LARGE,
        marginHorizontal: Constants.MARGIN_X_LARGE
    },
    header: {
        backgroundColor: Colors.COLOR_PRIMARY,
        borderBottomWidth: 0,
        alignItems: 'center'
    },
    viewSpaceBetween: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    position0: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    cardView: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT,
        margin: Constants.MARGIN_X_LARGE,
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.CORNER_RADIUS,
        width: screen.width - Constants.MARGIN_XX_LARGE,
    },
    tabStyle: {
        backgroundColor: Colors.COLOR_TRANSPARENT
    },
    activeTabStyle: {
        backgroundColor: Colors.COLOR_TRANSPARENT,
    },
    activeTextStyle: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        fontWeight: 'bold',
        color: Colors.COLOR_RED
    },
    textStyle: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        color: Colors.COLOR_TEXT
    },
    tabBarUnderlineStyle: {
        backgroundColor: Colors.COLOR_TRANSPARENT
    },
    scrollableTab: {
        borderWidth: 0,
        backgroundColor: Colors.COLOR_TRANSPARENT
    },
    textInputLogin: {
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        textAlign: 'left',
        marginHorizontal: Constants.MARGIN,
        fontWeight: 'bold'
    },
    textDialogTitle: {
        fontSize: Fonts.FONT_SIZE_SMALL,
        textAlign: 'center',
        marginLeft: Constants.MARGIN_X_LARGE,
        fontWeight: 'bold'
    }
};