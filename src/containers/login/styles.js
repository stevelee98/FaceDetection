import React from "react-native";
import { Dimensions } from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import commonStyles from "styles/commonStyles";

const screen = Dimensions.get("window");
const { StyleSheet } = React;

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.COLOR_SKY_BLUE
    },
    buttonLogin: {
        marginBottom: 15,
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: Constants.CORNER_RADIUS,
        paddingTop: Constants.PADDING_LARGE,
        paddingBottom: Constants.PADDING_LARGE,
    },
    inputLogin: {
        marginLeft: Constants.MARGIN_LOGIN,
        marginRight: Constants.MARGIN_LOGIN,
        marginBottom: Constants.MARGIN_LARGE
    },
    images: {
        marginLeft: 8, marginRight: 8, marginTop: 8, marginBottom: 2,
        alignItems: 'flex-end',
        justifyContent: 'flex-end', alignSelf: 'flex-end'
    },
    textForgotPass: {
        fontSize: Fonts.FONT_SIZE_X_MEDIUM, textAlign: 'right',
        padding: Constants.PADDING,
        margin: 0
    },
};
