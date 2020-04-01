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
  slider: {
    overflow: 'visible', // for custom animations
    //marginBottom: -Constants.MARGIN_X_LARGE - Constants.MARGIN_LARGE,
  },
  sliderContentContainer: {
    paddingTop: Constants.MARGIN_LARGE // for custom animation
  },
  paginationContainer: {
    paddingTop: Constants.PADDING_LARGE,
    paddingBottom: Constants.PADDING_LARGE,
    marginBottom: -Constants.MARGIN_LARGE,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,

  }
};
