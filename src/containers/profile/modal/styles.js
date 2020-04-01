import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from 'values/constants';
import { Fonts } from "values/fonts";
import { CheckBox } from "native-base";
import commonStyles from "styles/commonStyles";
const { Dimensions, Platform } = React;
const { StyleSheet } = React;

const screen = Dimensions.get("window");
const deviceWidth = screen.width;
const SIZE_IMAGE = 112;

const WIDTH_ITEM = deviceWidth - Constants.MARGIN_XX_LARGE

export default {
    button: {
        ...commonStyles.shadowOffset,
        width: WIDTH_ITEM,
        paddingVertical: Constants.PADDING_LARGE + Constants.PADDING,
        borderRadius: Constants.CORNER_RADIUS,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        marginVertical: Constants.MARGIN,
        backgroundColor: Colors.COLOR_WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        ...commonStyles.text,
        margin: 0,
        paddingHorizontal: Constants.PADDING_X_LARGE
    },
    imageSize: {
        width: SIZE_IMAGE, height: SIZE_IMAGE,
        borderRadius: SIZE_IMAGE / 2,
        borderColor: Colors.COLOR_DRK_GREY,
        position: 'relative'
    },
};