import React from "react-native";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";

const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
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
    logoContainer: {
        flex: 1,
        marginTop: deviceHeight / 8,
        marginBottom: 30
    },
    logo: {
        position: "absolute",
        left: Platform.OS === "android" ? 40 : 50,
        top: Platform.OS === "android" ? 35 : 60,
        width: 280,
        height: 100
    },
    viewFunction: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonFunction: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    listItem: {
        flex: 1, alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: Constants.PADDING_X_LARGE * 1.5,
        marginLeft: Constants.MARGIN_X_LARGE,
        borderBottomWidth: 1,
        borderColor: Colors.COLOR_GREY_LIGHT
    },
    imageFunction: {
        alignSelf: 'center',
        justifyContent: 'flex-start',
        marginLeft: Constants.MARGIN_X_LARGE
    },
    imageAvatar: {
        width: 90,
        height: 90,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        marginLeft: Constants.MARGIN_X_LARGE,
        marginTop: Constants.MARGIN_X_LARGE,
        borderWidth: 1,
        borderColor: Colors.COLOR_WHITE,
        borderRadius: 90,
    },
    ieltsType: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: Constants.MARGIN_X_LARGE,
    },
    line: {
        marginLeft: Constants.MARGIN_LARGE, marginRight: Constants.MARGIN_LARGE,
        width: '98%',
        height: 1,
        backgroundColor: Colors.COLOR_BLACK,
    },
    touchableIeltsType: {
        paddingLeft: Constants.PADDING_LARGE,
        paddingRight: Constants.PADDING_LARGE,
        height: 200, width: 200
    },
    imageSizeHomeView: {
        marginHorizontal: Constants.MARGIN,
        height: 35, width: 35
    },
    imageSizeUser: {
        marginHorizontal: Constants.MARGIN_X_LARGE,
        height: 75, width: 75
    },
    imageAvatar: {
        width: 50,
        height: 50,
        justifyContent: 'flex-start',
        marginLeft: Constants.MARGIN,
        marginTop: Constants.MARGIN,
        borderWidth: 1,
        borderColor: Colors.COLOR_WHITE,
        borderRadius: 25,
    },
    btnChange: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: Constants.MARGIN_X_LARGE
    },
    cardView: {
        // ...commonStyles.shadowOffset,
        flex: 1,
        alignItems: 'center',
        borderRadius: Constants.CORNER_RADIUS,
        justifyContent: 'center',
    },
    bg_overlay: {
        backgroundColor: 'rgba(3, 5, 4, 0.3)',
        flex: 1,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: Constants.CORNER_RADIUS,
        padding: Constants.PADDING_X_LARGE,
        alignItems: "flex-end"
    },
    tabs: {
        ...commonStyles.shadowOffset,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: Constants.CORNER_RADIUS,
        borderBottomRightRadius: Constants.CORNER_RADIUS
    },
    tab: {
        flex: 1
    },
    labelTab: {
        ...commonStyles.textBold,
        color: Colors.COLOR_WHITE,
        textAlign: "center",
        marginVertical: Constants.MARGIN_LARGE
    },
    lineStyle: {
        marginHorizontal: Constants.MARGIN_XX_LARGE,
        padding: 1,
        backgroundColor: Colors.COLOR_WHITE
    },
    viewPager: {
        flex: 1
    },
    iconChat: {
        ...commonStyles.viewCenter,
        position: "absolute",
        bottom: Constants.MARGIN_XX_LARGE,
        right: Constants.MARGIN_X_LARGE,
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
        borderWidth: 0.8,
        borderColor: Colors.COLOR_PRIMARY_LOW
    }
};
