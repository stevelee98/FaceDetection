import React, { Component } from 'react';
import img_bg from "images/img_bg.png";
import PropTypes from 'prop-types';
import {
    ListView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewPropTypes as RNViewPropTypes,
    FlatList,
    Dimensions,
    ImageBackground
} from 'react-native';
import { Colors } from 'values/colors';
import Utils from 'utils/utils';
import { Constants } from 'values/constants';

const window = Dimensions.get('window');

class BackgroundCustom extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageBackground
                resizeMode='cover'
                style={{ width: window.width, height: "100%", backgroundColor: Colors.COLOR_PRIMARY }}
                source={img_bg} />
        );
    }
}

export default BackgroundCustom;