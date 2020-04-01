import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import { Constants } from 'values/constants';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import Hr from 'components/hr';
import imageOrientationType from 'enum/imageOrientationType';

const screen = Dimensions.get("window");
const MARGIN_DEDUCT = Constants.MARGIN_LARGE * 7 + Constants.MARGIN;

const WIDTH_IMAGE = screen.width - MARGIN_DEDUCT;
const HEIGHT_IMAGE_PORTRAIT = WIDTH_IMAGE * 738 / 492;
const HEIGHT_IMAGE_LANDSCAPE = WIDTH_IMAGE * 276 / 492;
const NUM_OF_LINES = 5;

export default class ItemPostNew extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            'showMoreButton': false,
            'isSeeMore': false
        };
        this.images = [];
        this.maxImage = 5;
    }

    render() {
        const { data, item, index, resourceUrlPathResize, resourceUrlPath, onPressImage } = this.props;
        let lengthImages = !Utils.isNull(item.images) ? item.images.length : 0;
        let numMoreImage = lengthImages - this.maxImage;
        return (
            <View style={styles.container}>
                <View style={{ position: "relative", width: Constants.MARGIN_X_LARGE, alignItems: "center" }}>
                    <View style={[styles.circle, {
                        borderColor: index == 0 ? Colors.COLOR_PRIMARY_LOW : Colors.COLOR_TRANSPARENT
                    }]}>
                        {item.isShowDate && <View style={styles.dotDate} />}
                    </View>
                    <View style={styles.lineDate} />
                </View>
                <View style={styles.content}>
                    {item.isShowDate
                        && <Text style={[commonStyles.textBold]}>
                            {DateUtil.timeAgo(item.createdAt)}
                            {/* {DateUtil.convertFromFormatToFormat(item.createdAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)} */}
                        </Text>
                    }
                    <View style={{ alignItems: "flex-start" }}>   
                    <Text
                        numberOfLines={!this.state.isSeeMore ? NUM_OF_LINES : null}
                        onTextLayout={({ nativeEvent: { lines } }) =>                      
                            this.setState({showMoreButton: lines.length >= NUM_OF_LINES}) 
                        }
                        style={[commonStyles.text, { marginRight: Constants.MARGIN_X_LARGE,}]}>
                        {item.content}
                    </Text>
                    {this.state.showMoreButton && !this.state.isSeeMore ? <TouchableOpacity onPress={() => this.setState({isSeeMore: true, showMoreButton: false})}>
                        <Text style={[commonStyles.text, {color: Colors.COLOR_PRIMARY}]}>Xem thêm</Text>
                    </TouchableOpacity> : null}
                    </View>
                    {!Utils.isNull(item.images) && <View style={this.getStyleBoxImage()}>
                        {item.images.map((image, indexImage) => {
                            let path = "";
                            let hasHttp = false;
                            if (!Utils.isNull(image)) {
                                hasHttp = image.path.indexOf('http') != -1;
                                path = hasHttp ? image.path : resourceUrlPathResize + "=" + image.path;
                                let img = resourceUrlPath + "/sr/display?" + "op=resize&w=" + Math.ceil(screen.width) + "&path=" + image.path;
                                this.images.push({ path: img });
                            }
                            return (
                                indexImage < this.maxImage
                                && <View key={indexImage.toString()} style={{ position: "relative" }}>
                                    <TouchableOpacity
                                        activeOpacity={Constants.ACTIVE_OPACITY}
                                        onPress={() => onPressImage(this.images, indexImage)}>
                                        <ImageLoader
                                            resizeModeType={'cover'}
                                            resizeAtt={hasHttp ? null : { type: 'resize', width: this.getWidthImage(indexImage) }}
                                            path={path}
                                            style={[styles.image, {
                                                width: this.getWidthImage(indexImage),
                                                height: this.getHeightImage(indexImage)
                                            }]}
                                        />
                                        {
                                            numMoreImage > 0
                                            && indexImage == this.maxImage - 1
                                            && <View style={styles.moreImage}>
                                                <Text style={styles.numMore}>+{numMoreImage}</Text>
                                            </View>
                                        }
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                    }
                    <Hr
                        style={{
                            marginHorizontal: Constants.MARGIN,
                            marginTop: Constants.MARGIN_X_LARGE - Constants.MARGIN,
                            marginRight: Constants.MARGIN_X_LARGE
                        }}
                        color={Colors.COLOR_BORDER}
                        width={Constants.BORDER_WIDTH}
                    />
                </View>
            </View>
        );
    }

    /**
     * Get style box image
     */
    getStyleBoxImage = () => {
        const { item } = this.props;
        let length = !Utils.isNull(item.images) ? item.images.length : 0;
        let styleBoxImage = null;
        switch (item.oriented) {
            case imageOrientationType.SQUARE_ORIENTED:
                styleBoxImage = {
                    flexDirection: "row",
                    flexWrap: "wrap"
                };
                break;
            case imageOrientationType.PORTRAIT_ORIENTED:
                if (length == 4 || length == 3) {
                    styleBoxImage = {
                        flexWrap: "wrap",
                        height: HEIGHT_IMAGE_PORTRAIT / 1.5 + Constants.MARGIN_LARGE
                    };
                } else {
                    styleBoxImage = {
                        flexDirection: "row",
                        flexWrap: "wrap"
                    };
                }
                break;
            case imageOrientationType.LANDSCAPE_ORIENTED:
                if (length >= 5) {
                    styleBoxImage = {
                        flexWrap: "wrap",
                        height: HEIGHT_IMAGE_PORTRAIT / 1.5 + Constants.MARGIN_LARGE
                    };
                } else {
                    styleBoxImage = {
                        flexDirection: "row",
                        flexWrap: "wrap"
                    };
                }
                break;
            default:
                styleBoxImage = {
                    flexDirection: "row",
                    flexWrap: "wrap"
                };
                break;
        }
        return styleBoxImage;
    }

    /**
     * Get width image
     */
    getWidthImage = (index) => {
        const { item } = this.props;
        switch (item.oriented) {
            case imageOrientationType.SQUARE_ORIENTED:
                return this.handleWidthSquare(index);
            case imageOrientationType.PORTRAIT_ORIENTED:
                return this.handleWidthPortrait(index);
            case imageOrientationType.LANDSCAPE_ORIENTED:
                return this.handleWidthLandscape(index);
            default:
                return 0;
        }
    }

    /**
     * Get height image
     */
    getHeightImage = (index) => {
        const { item } = this.props;
        switch (item.oriented) {
            case imageOrientationType.SQUARE_ORIENTED:
                return this.handleHeightSquare(index);
            case imageOrientationType.PORTRAIT_ORIENTED:
                return this.handleHeightPortrait(index);
            case imageOrientationType.LANDSCAPE_ORIENTED:
                return this.handleHeightLandscape(index);
            default:
                return 0;
        }
    }

    /**
     * Handle width square
     */
    handleWidthSquare = (index) => {
        const { item } = this.props;
        let length = !Utils.isNull(item.images) ? item.images.length : 0;
        if (length >= 5) {
            if (index == 0 || index == 1) {
                return WIDTH_IMAGE / 2 - Constants.MARGIN;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 4) {
            return WIDTH_IMAGE / 2 - Constants.MARGIN;
        } else if (length == 3) {
            if (index == 0) {
                return WIDTH_IMAGE;
            } else {
                return WIDTH_IMAGE / 2 - Constants.MARGIN;
            }
        } else if (length == 2) {
            return WIDTH_IMAGE / 2 - Constants.MARGIN;
        } else if (length == 1) {
            return WIDTH_IMAGE;
        }
    }

    /**
     * Get height square
     */
    handleHeightSquare = (index) => {
        const { item } = this.props;
        let length = !Utils.isNull(item.images) ? item.images.length : 0;
        if (length >= 5) {
            if (index == 0 || index == 1) {
                return WIDTH_IMAGE / 2 - Constants.MARGIN;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 4) {
            return WIDTH_IMAGE / 2 - Constants.MARGIN;
        } else if (length == 3) {
            return WIDTH_IMAGE / 2 - Constants.MARGIN;
        } else if (length == 2) {
            return WIDTH_IMAGE / 2 - Constants.MARGIN;
        } else if (length == 1) {
            return WIDTH_IMAGE;
        }
    }

    /**
     * Handle width portrait
     */
    handleWidthPortrait = (index) => {
        const { item } = this.props;
        let length = !Utils.isNull(item.images) ? item.images.length : 0;
        if (length >= 5) {
            if (index == 0 || index == 1) {
                return WIDTH_IMAGE / 2 - Constants.MARGIN;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 4 || length == 3) {
            if (index == 0) {
                return WIDTH_IMAGE / 1.5 - 2.5;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 2) {
            return WIDTH_IMAGE / 2 - Constants.MARGIN;
        } else if (length == 1) {
            return WIDTH_IMAGE;
        }
    }

    /**
     * Get height portrait
     */
    handleHeightPortrait = (index) => {
        const { item } = this.props;
        let length = !Utils.isNull(item.images) ? item.images.length : 0;
        if (length >= 5) {
            if (index == 0 || index == 1) {
                return WIDTH_IMAGE / 2 - Constants.MARGIN;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 4) {
            if (index == 0) {
                return HEIGHT_IMAGE_PORTRAIT / 1.5;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 3) {
            if (index == 0) {
                return HEIGHT_IMAGE_PORTRAIT / 1.5;
            } else {
                return WIDTH_IMAGE / 2 - Constants.MARGIN;
            }
        } else if (length == 2) {
            return HEIGHT_IMAGE_PORTRAIT / 1.5;
        } else if (length == 1) {
            return HEIGHT_IMAGE_PORTRAIT;
        }
    }

    /**
     * Handle width landscape
     */
    handleWidthLandscape = (index) => {
        const { item } = this.props;
        let length = !Utils.isNull(item.images) ? item.images.length : 0;
        if (length >= 5) {
            return WIDTH_IMAGE / 2 - Constants.MARGIN;
        } else if (length == 4) {
            if (index == 0) {
                return WIDTH_IMAGE;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 3) {
            if (index == 0) {
                return WIDTH_IMAGE;
            } else {
                return WIDTH_IMAGE / 2 - Constants.MARGIN;
            }
        } else {
            return WIDTH_IMAGE;
        }
    }

    /**
     * Get height landscape
     */
    handleHeightLandscape = (index) => {
        const { item } = this.props;
        let length = !Utils.isNull(item.images) ? item.images.length : 0;
        if (length >= 5) {
            if (index == 0 || index == 1) {
                return WIDTH_IMAGE / 2 - Constants.MARGIN;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 4) {
            if (index == 0) {
                return WIDTH_IMAGE / 1.5 - 2.5;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 3) {
            if (index == 0) {
                return WIDTH_IMAGE / 1.5 - 2.5;
            } else {
                return WIDTH_IMAGE / 3 - (Constants.MARGIN + 1.5);
            }
        } else if (length == 2) {
            return WIDTH_IMAGE / 2 - Constants.MARGIN;
        } else if (length == 1) {
            return HEIGHT_IMAGE_LANDSCAPE;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        ...commonStyles.viewHorizontal,
        paddingHorizontal: Constants.PADDING_X_LARGE
    },
    content: {
        width: "100%",
        paddingLeft: Constants.PADDING_LARGE,
        paddingTop: Constants.PADDING_LARGE
    },
    image: {
        borderRadius: Constants.CORNER_RADIUS,
        margin: Constants.MARGIN,
    },
    moreImage: {
        ...commonStyles.viewCenter,
        backgroundColor: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE,
        position: "absolute",
        borderRadius: Constants.CORNER_RADIUS,
        top: 4, right: 4, left: 4, bottom: 4
    },
    numMore: {
        ...commonStyles.text,
        color: Colors.COLOR_WHITE
    },
    lineDate: {
        width: Constants.BORDER_WIDTH,
        height: "100%",
        backgroundColor: Colors.COLOR_PRIMARY_LOW,
        marginTop: Constants.MARGIN_XX_LARGE + 6,
        opacity: 0.3
    },
    dotDate: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.COLOR_PRIMARY_LOW
    },
    circle: {
        ...commonStyles.viewCenter,
        position: "absolute",
        top: Constants.MARGIN_XX_LARGE + 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 0.5
    }
});
