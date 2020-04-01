import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import { Constants } from 'values/constants';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import LinearGradient from 'react-native-linear-gradient';

const screen = Dimensions.get("window");

export default class ItemImageCategory extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { dataCategory, item, index, resourceUrlPathResize, onPress, itemSelected } = this.props;
        let colors = index == itemSelected
            ? [Colors.COLOR_PRIMARY_LOW, Colors.COLOR_PRIMARY_HIGH]
            : [Colors.COLOR_WHITE, Colors.COLOR_WHITE];
        let colorText = index == itemSelected
            ? Colors.COLOR_WHITE
            : Colors.COLOR_TEXT;
        let colorBorder = index == itemSelected ? Colors.COLOR_TRANSPARENT : Colors.COLOR_TEXT;
        return (
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.8 }}
                style={[styles.container, {
                    borderColor: colorBorder,
                    marginHorizontal: Constants.MARGIN_LARGE,
                    marginTop: index == itemSelected ? - 1 : 0,
                    paddingVertical: index == itemSelected ? Constants.PADDING_LARGE : Constants.PADDING_LARGE - 1,
                    marginRight: index == dataCategory.length - 1 ? Constants.MARGIN_X_LARGE + Constants.MARGIN_LARGE : Constants.MARGIN_LARGE
                }]}>
                <TouchableOpacity
                    style={{}}
                    onPress={() => { onPress(item, index) }}
                >
                    <Text style={[commonStyles.text, {
                        color: colorText
                    }]}>{item.name}</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...commonStyles.viewCenter,
        paddingHorizontal: Constants.PADDING_X_LARGE,
        paddingVertical: Constants.PADDING_LARGE,
        borderRadius: Constants.CORNER_RADIUS / 2,
        borderWidth: 1
    }
});
