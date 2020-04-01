import React from "react-native";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";

export default {
    text: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
    },
    borderMessage: {
        borderRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_WHITE,
        borderColor: Colors.COLOR_TEXT,
        borderWidth: Constants.DIVIDE_HEIGHT_SMALL,
        padding: Constants.MARGIN_LARGE
    }
}