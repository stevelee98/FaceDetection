import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from 'values/constants';
import { Fonts } from "values/fonts";
import commonStyles from "styles/commonStyles";
const { Dimensions, Platform } = React;
const { StyleSheet } = React;

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND
    },
    buttonStyle: {
        alignItems: 'center',
        borderRadius: Constants.CORNER_RADIUS,
        marginVertical: Constants.MARGIN_LARGE,
        backgroundColor: Colors.COLOR_PRIMARY,
        paddingHorizontal: Constants.PADDING_X_LARGE,
        paddingVertical: Constants.PADDING
    },
};