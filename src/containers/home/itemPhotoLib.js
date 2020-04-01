import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import { Constants } from 'values/constants';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';

const screen = Dimensions.get("window");
const WIDTH_IMAGE = screen.width / 2 - Constants.MARGIN_LARGE * 3;
const HEIGHT_IMAGE = WIDTH_IMAGE * (12 / 8);

export default class ItemPhotoLib extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { data, item, index, resourceUrlPathResize, onPress } = this.props;
        let image = !Utils.isNull(item.path) && item.path.indexOf('http') != -1
            ? item.path : !Utils.isNull(resourceUrlPathResize) ? resourceUrlPathResize.textValue + "=" + item.path : '';
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => onPress(image, index)}
                style={[styles.container, {
                    marginLeft: index % 2 == 0 ? Constants.MARGIN_X_LARGE : Constants.MARGIN_LARGE,
                    marginRight: index % 2 != 0 ? Constants.MARGIN_X_LARGE : Constants.MARGIN_LARGE
                }]}>
                <View style={{
                    borderRadius: Constants.CORNER_RADIUS / 2,
                    flexDirection: "row",
                    flexWrap: "wrap"
                }}>
                    <ImageLoader
                        resizeModeType={'cover'}
                        resizeAtt={{ type: 'resize', width: WIDTH_IMAGE }}
                        path={image}
                        style={[styles.image, {
                            borderTopLeftRadius: Constants.CORNER_RADIUS / 2,
                            borderTopRightRadius: Constants.CORNER_RADIUS / 2,
                            width: WIDTH_IMAGE,
                            height: HEIGHT_IMAGE
                        }]}
                    />
                </View>
                <Text style={[commonStyles.text, { marginHorizontal: Constants.MARGIN_LARGE }]}>
                    {item.code}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT,
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.CORNER_RADIUS / 2,
        width: WIDTH_IMAGE,
        height: HEIGHT_IMAGE + Constants.MARGIN_XX_LARGE,
        marginVertical: Constants.MARGIN_LARGE
    },

    image: {

    }
});
