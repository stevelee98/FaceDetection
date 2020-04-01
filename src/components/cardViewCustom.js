import React, { Component } from 'react';
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
import commonStyles from 'styles/commonStyles';
import LinearGradient from 'react-native-linear-gradient';

const window = Dimensions.get('window');

class CardViewCustom extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (          
            <View style={[commonStyles.cardView, this.props.style, {opacity: 0.8 }]}>
                <LinearGradient colors={[Colors.COLOR_WHITE, Colors.COLOR_WHITE_OPACITY_50]} style={{            
                    borderRadius: Constants.CORNER_RADIUS,     
                }}>
                <View style={[commonStyles.viewCenter,{ marginBottom: - Constants.MARGIN,}]}>
                    <Text style={[commonStyles.titleBoldCardView, { color: Colors.COLOR_BLACK, marginTop: Constants.MARGIN_X_LARGE }]}>
                        {this.props.title}
                    </Text>
                </View>
                {this.props.viewChild}
                </LinearGradient>
            </View>
            
        );
    }
}

export default CardViewCustom;