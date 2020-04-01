import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground, Dimensions, View, StatusBar, TextInput, ScrollView, TouchableOpacity, Image, Keyboard } from "react-native";
import { Form, Textarea, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Fab, Footer, Input, Item } from "native-base";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import TimerCountDown from "components/timerCountDown";
import commonStyles from "styles/commonStyles";
import ic_back_white from "images/ic_back_white.png";
import ic_back_black from "images/ic_back_black.png";
import ic_notification_white from "images/ic_notification_white.png";
import { Fonts } from "values/fonts";
import ic_default_user from "images/ic_default_user.png";
import shadow_avatar_home from "images/shadow_avatar_home.png";
import Utils from "utils/utils";
import ImageLoader from "components/imageLoader";
import BackgroundShadow from "components/backgroundShadow";
import ic_cart_grey from "images/ic_cart_grey.png";
import StringUtil from "utils/stringUtil";
import LinearGradient from "react-native-linear-gradient";
import ic_shopping_cart_white from "images/ic_shopping_cart_white.png";
import ic_search_white from 'images/ic_search_white.png';
import ic_cancel_white from 'images/ic_cancel_white.png';
import ic_logo_white from 'images/ic_logo_white.png';
import ic_chat_white from 'images/ic_chat_white.png';
import { localizes } from "locales/i18n";

const deviceHeight = Dimensions.get("window").height;
const AVATAR_HEIGHT = 30;

class HeaderView extends Component {
    static propTypes = {
        //Title
        title: PropTypes.string.isRequired,
        //Unit: Seconds
        timeLimit: PropTypes.number,
        //Handle to be called:
        //when user pressed back button
        onBack: PropTypes.func,
        //Called when countdown time has been finished
        onFinishCountDown: PropTypes.func,
        //Called when extra time has been finished
        onTick: PropTypes.func,
        titleStyle: PropTypes.object,
        isReady: PropTypes.bool,
        visibleBack: PropTypes.bool,
        visibleCart: PropTypes.bool,
        visibleNotification: PropTypes.bool,
        visibleLogo: PropTypes.bool,
        visibleMap: PropTypes.bool,
        visibleAccount: PropTypes.bool,
        visibleSearchBar: PropTypes.bool,
        stageSize: PropTypes.number,
        initialIndex: PropTypes.number,
        visibleStage: PropTypes.bool,
        visibleIconLeft: PropTypes.bool
    };

    static defaultProps = {
        onFinishCountDown: null,
        onFinishExtraTime: null,
        isReady: true,
        onTick: null,
        visibleBack: false,
        visibleCart: false,
        visibleNotification: false,
        visibleLogo: false,
        visibleMap: false,
        visibleAccount: false,
        visibleSearchBar: false,
        onBack: null,
        stageSize: 4,
        initialIndex: 0,
        visibleStage: false,
        titleStyle: null,
        visibleIconLeft: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            countDownTime: this.props.timeLimit
        };
        this.timeTick = this.state.countDownTime;
    }

    render() {
        const { title, onBack, onRefresh, onGrid, renderRightMenu, renderLeftMenu, renderMidMenu } = this.props;
        return (
            <View style={styles.headerBody}>
                {this.props.visibleLogo ? this.renderLogo() : null}
                {/*Back button*/}
                {this.props.visibleBack ? this.renderBack() : null}
                {renderLeftMenu && renderLeftMenu()}
                {this.props.visibleIconLeft ? this.renderIconLeft() : null}
                {!StringUtil.isNullOrEmpty(title) ? (
                    <Text numberOfLines={1} style={[commonStyles.titleBold, { color: Colors.COLOR_WHITE, textAlign: "center", flex: 1 }, this.props.titleStyle]}>
                        {title}
                    </Text>
                ) : null}
                {/* Render account */}
                {this.props.visibleAccount ? this.renderAccount() : null}
                {/* Render timer countdown */}
                {this.props.visibleSearchBar ? this.renderSearchBar() : null}
                {/* Render timer countdown */}
                {renderMidMenu && renderMidMenu()}
                {this.props.visibleIconRight ? this.renderIconRight() : null}
                {this.props.visibleCart ? this.renderCart() : null}
                {this.props.visibleMessage ? this.renderMessage() : null}
                {/* Notification button */}
                {this.props.visibleNotification ? this.renderNotification() : null}
                {/* Render list */}
                {this.props.visibleMap ? this.renderMap() : null}
                {/* Render stage list */}
                {this.props.visibleStage ? this.renderStageList() : null}
                {renderRightMenu && renderRightMenu()}
                <StatusBar barStyle="light-content" backgroundColor={Colors.COLOR_PRIMARY_HIGH} />
            </View>

        );
    }

    onTimeElapsed = () => {
        if (this.props.onFinishCountDown) this.props.onFinishCountDown();
    };

    /**
     * Render back
     */
    renderBack() {
        const { bgBack } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    padding: Constants.PADDING_LARGE,
                    backgroundColor: !Utils.isNull(bgBack) ? bgBack : Colors.COLOR_TRANSPARENT
                }}
                onPress={() => {
                    if (this.props.onBack) this.props.onBack();
                }}
            >
                <Image source={Utils.isNull(this.props.icBackMenu) ? ic_back_white : this.props.icBackMenu} />
            </TouchableOpacity>
        );
    }

    /**
     * Render icon left
    */
    renderIconLeft() {
        const { onPressIconLeft } = this.props;
        return (
            <TouchableOpacity
                style={{ padding: Constants.PADDING_12 }}
                onPress={() => {
                    if (onPressIconLeft) this.props.onPressIconLeft();
                }}
            >
                <Image source={this.props.visibleIconLeft} />
            </TouchableOpacity>
        );
    }

    /**
     * Render icon right
     */
    renderIconRight() {
        const { onPressIconRight } = this.props;
        return (
            <TouchableOpacity
                style={{ padding: Constants.PADDING_12 }}
                onPress={() => {
                    if (onPressIconRight) this.props.onPressIconRight();
                }}
            >
                <Image source={this.props.visibleIconRight} />
            </TouchableOpacity>
        );
    }

    /**
     * Render message
     */
    renderMessage() {
        const { onPressMess, quantityMess } = this.props;
        return (
            <TouchableOpacity
                style={{
                    paddingVertical: Constants.PADDING, paddingHorizontal: Constants.PADDING_12
                }}
                onPress={() => {
                    if (onPressMess) this.props.onPressMess();
                }}
            >
                <Image source={ic_chat_white} style={{ aspectRatio: 0.85, resizeMode: 'contain' }} />
                {quantityMess != 0 ? (
                    <View
                        style={[
                            commonStyles.viewCenter,
                            {
                                position: "absolute",
                                top: Constants.MARGIN,
                                right: 0,
                                //width: quantityMess >= 10 ? 24 : 16,
                                height: 16,
                                borderRadius: Constants.CORNER_RADIUS,
                                backgroundColor: Colors.COLOR_BACKGROUND_COUNT_NOTIFY
                            }
                        ]}
                    >
                        <Text
                            style={[
                                commonStyles.text,
                                {
                                    color: Colors.COLOR_WHITE,
                                    fontSize: Fonts.FONT_SIZE_SMALL
                                }
                            ]}
                        >
                            {quantityMess}
                        </Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    }
    /**
     * Render cart
     */
    renderCart() {
        const { quantityCart } = this.props;
        return (
            <TouchableOpacity
                style={{
                    paddingVertical: Constants.PADDING_12,
                    paddingRight: Constants.PADDING_LARGE,
                    paddingLeft: Constants.PADDING_LARGE,
                }}
                onPress={() => {
                    if (this.props.showCart) this.props.showCart();
                }}
            >
                <Image source={ic_shopping_cart_white} />
                {quantityCart != 0 ? (
                    <View
                        style={[
                            {
                                // justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                top: Constants.MARGIN,
                                right: 0,
                                width: this.quantityCart >= 10 ? 24 : 16,
                                height: 16,
                                borderRadius: Constants.CORNER_RADIUS,
                                backgroundColor: Colors.COLOR_BACKGROUND_COUNT_NOTIFY
                            }
                        ]}
                    >
                        <Text
                            style={[
                                commonStyles.text,
                                {
                                    color: Colors.COLOR_WHITE,
                                    fontSize: Fonts.FONT_SIZE_SMALL
                                }
                            ]}
                        >
                            {quantityCart}
                        </Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    }

    renderMap() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    flexDirection: "row",
                    right: 0,
                    marginRight: Constants.PADDING_12
                }}
                onPress={this.props.openMenu}
            >
                <View>
                    <Image source={this.props.icon} style={{ height: Constants.DIVIDE_HEIGHT_LARGE * 6, width: Constants.DIVIDE_HEIGHT_LARGE * 6 }} resizeMode={"contain"} />
                </View>
            </TouchableOpacity>
        );
    }

    renderAccount() {
        const { user, userName, gotoLogin, source } = this.props;

        console.log("SOURCE AVARTAR: ", source);
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '30%' }}>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={this.props.gotoLogin}
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        padding: Constants.PADDING_LARGE,
                    }}
                >
                    <ImageLoader
                        style={{
                            width: AVATAR_HEIGHT,
                            height: AVATAR_HEIGHT,
                            borderRadius: AVATAR_HEIGHT / 2,
                            position: "relative",
                            borderWidth: Constants.BORDER_WIDTH,
                            borderColor: Colors.COLOR_WHITE
                        }}
                        resizeModeType={'cover'}
                        resizeAtt={{ type: 'resize', width: AVATAR_HEIGHT }}
                        path={!Utils.isNull(source) ? source : null}
                    />
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[commonStyles.text, { flex: 1, marginRight: Constants.MARGIN_LARGE, color: Colors.COLOR_WHITE ,marginLeft: Constants.MARGIN_LARGE}]}>
                        {!Utils.isNull(userName) ? userName.trim() : localizes('homeView.no_login')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * Render notification button
     */
    renderNotification() {
        const { badgeCount } = global;
        const WIDTH = Utils.getLength(parseInt(badgeCount)) < 2 ? 18 : 26;
        const RIGHT = Utils.getLength(parseInt(badgeCount)) < 2 ? 2 : 0;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    position: "absolute",
                    justifyContent: "center",
                    right: 0,
                    padding: Constants.PADDING_LARGE
                }}
                onPress={this.props.gotoNotification}
            >
                <Image source={ic_notification_white} />
                {badgeCount != 0 ? (
                    <View
                        style={[
                            {
                                position: 'absolute',
                                alignSelf: 'flex-start',
                                right: RIGHT,
                                top: 4,
                                width: WIDTH,
                                backgroundColor: Colors.COLOR_PRIMARY,
                                borderWidth: 0.5,
                                borderColor: Colors.COLOR_WHITE,
                                borderRadius: WIDTH / 2,
                                justifyContent: 'center', alignItems: 'center'
                            }
                        ]}
                    >
                        <Text style={{
                            textAlign: 'center',
                            color: Colors.COLOR_WHITE,
                            fontSize: Fonts.FONT_SIZE_X_SMALL
                        }}>{badgeCount}</Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    }

    /**
     * Render logo
     */
    renderLogo() {
        return (
            <View style={[commonStyles.viewCenter, {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0
            }]}>
                <Image source={ic_logo_white} />
            </View>
        );
    }

    /***
     * render title search
     */
    renderTitleSearch() {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[commonStyles.viewHorizontal, commonStyles.viewCenter]}
                onPress={() => {
                    if (this.props.onTouchStart) {
                        this.props.onTouchStart(); // with editable = false
                    }
                }}
            >
                <TextInput
                    style={[
                        commonStyles.text,
                        {
                            margin: 0,
                            borderRadius: 0,
                            flex: 1,
                            paddingHorizontal: Constants.PADDING_LARGE,
                            color: Colors.COLOR_WHITE
                        }
                    ]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={Colors.COLOR_WHITE}
                    ref={ref => {
                        if (this.props.onRef) this.props.onRef(ref);
                    }}
                    value={this.props.inputSearch}
                    onChangeText={this.props.onChangeTextInput}
                    onSubmitEditing={() => {
                        this.props.onSubmitEditing();
                        Keyboard.dismiss();
                    }}
                    keyboardType="default"
                    underlineColorAndroid="transparent"
                    returnKeyType={"search"}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    autoFocus={this.props.autoFocus}
                    editable={this.props.editable}
                />
            </TouchableOpacity>
        )
    }
    /**
     * Render timer count down
     */
    renderSearchBar() {
        return (
            <View style={[{ flex: 1, flexDirection: "row", alignItems: "center" }, this.props.styleSearch]}>
                {/*Left button*/}
                {!Utils.isNull(this.props.iconLeftSearch) ? (
                    <TouchableOpacity
                        style={{
                            paddingVertical: "100%",
                            paddingHorizontal: Constants.PADDING_LARGE
                        }}
                        onPress={() => {
                            this.props.onPressLeftSearch();
                        }}
                    >
                        <Image source={this.props.iconLeftSearch} />
                    </TouchableOpacity>
                ) : null}
                <TextInput
                    style={[
                        commonStyles.text,
                        {
                            margin: 0,
                            borderRadius: 0,
                            flex: 1,
                            paddingHorizontal: Constants.PADDING_LARGE,
                            color: Colors.COLOR_WHITE
                        }
                    ]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={Colors.COLOR_WHITE}
                    ref={ref => {
                        if (this.props.onRef) this.props.onRef(ref);
                    }}
                    value={this.props.inputSearch}
                    onChangeText={this.props.onChangeTextInput}
                    onSubmitEditing={() => {
                        this.props.onSubmitEditing();
                        Keyboard.dismiss();
                    }}
                    keyboardType="default"
                    underlineColorAndroid="transparent"
                    returnKeyType={"search"}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    autoFocus={this.props.autoFocus}
                    editable={this.props.editable}
                />
                {/*Right button*/}
                {!Utils.isNull(this.props.iconRightSearch) ? (
                    <TouchableOpacity
                        style={{
                            paddingVertical: "100%",
                            paddingHorizontal: Constants.PADDING_LARGE
                        }}
                        onPress={() => {
                            this.props.onPressRightSearch();
                        }}
                    >
                        <Image source={this.props.iconRightSearch} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }

    componentWillReceiveProps(newProps) {
        if (newProps.timeLimit <= 0) this.timeTick = newProps.timeLimit;
        this.setState({
            countDownTime: newProps.timeLimit
        });
    }

    /**
     * Get remain time is countdown
     */
    getTime() {
        return this.timeTick;
    }

    /**
     * Render stage list include dot & bar
     */
    renderStageList() {
        if (this.props.removeHeader == true) {
            return <View />;
        }
        const size = this.props.stageSize;
        let stages = [];
        const initialIndex = this.props.initialIndex;
        for (let i = 0; i < size; i++) {
            let styleForBar = [styles.barStage];
            let styleForDot = [styles.dotStage];
            if (i > initialIndex) {
                styleForDot.push({ backgroundColor: "rgba(255,255,255,0.2)" });
                styleForBar.push({ backgroundColor: "rgba(255,255,255,0.2)" });
            }
            let dotStage = (
                <View key={i * 2 + 1} style={styleForDot}>
                    <Text style={{ color: Colors.COLOR_PRIMARY }}>{i + 1}</Text>
                </View>
            );
            let barStage = <View style key={i * 2 + 2} style={styleForBar} />;
            if (i !== 0) {
                stages.push(barStage);
            }
            stages.push(dotStage);
        }
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: Constants.MARGIN_LARGE,
                    marginLeft: Constants.MARGIN_LARGE
                }}
            >
                {stages}
            </View>
        );
    }
}

const styles = {
    headerBody: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    whiteIcon: {
        color: Colors.COLOR_WHITE
    },

    dotStage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.COLOR_WHITE,
        justifyContent: "center",
        alignItems: "center"
    },

    barStage: {
        width: 10,
        height: 5,
        backgroundColor: Colors.COLOR_WHITE
    }
};
export default HeaderView;
