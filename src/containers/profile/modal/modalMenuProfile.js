import React, { Component } from "react";
import {
    ImageBackground, Text, View, Image, TouchableOpacity,
    StyleSheet, Dimensions, Platform, ScrollView, SafeAreaView
} from "react-native";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import commonStyles from "styles/commonStyles";
import Modal from "react-native-modal";
import Utils from "utils/utils";
import styles from "./styles";
import { localizes } from "locales/i18n";
import ic_edit_red from "images/ic_edit_red.png";
import ic_lock_red from "images/ic_lock_red.png";
import ic_logout_red from "images/ic_logout_red.png"
import { Icon } from "react-native-elements";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const screen = Dimensions.get("window");
const deviceWidth = screen.width;
const deviceHeight = screen.height

const WIDTH_ITEM = deviceWidth - 40
const HEIGHT_ITEM = 52

export default class ModalMenuProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: null,
            isVisible: this.props.isVisible
        };
        this.menus = [
            localizes("userProfileView.editProfile"),
            localizes("userProfileView.changePass"),
            localizes('setting.log_out')
        ]
    }

    /**
     * On select
     * @param {*} selected 
     */
    onSelect(selected) {
        this.setState({
            selected
        })
    }

    /**
     * Show modal
     */
    showModal() {
        this.setState({
            isVisible: true
        })
    }

    /**
     * Hide modal
     */
    hideModal() {
        this.setState({
            isVisible: false
        })
    }

    render() {
        const { selected, isVisible } = this.state;
        return (
            <SafeAreaView >
                <Modal
                    ref={"modalMenuProfile"}
                    style={{
                        margin: 0, // This is the important style you need to set
                        alignItems: undefined,
                        justifyContent: undefined,
                    }}
                    isVisible={isVisible}
                    animationIn="slideInRight"
                    animationOut="slideOutRight"
                    onBackButtonPress={() => this.setState({ isVisible: false })}
                    onBackdropPress={() => this.setState({ isVisible: false })}

                    useNativeDriver={true}
                >
                    <View style={{
                        backgroundColor: Colors.COLOR_TRANSPARENT,
                        width: deviceWidth,
                        top: 40,
                        alignItems: 'flex-end',
                        padding: Constants.PADDING_LARGE
                    }}>
                        <View style={{ alignItems: 'flex-start', backgroundColor: 'white', borderRadius: Constants.CORNER_RADIUS, padding: Constants.PADDING_X_LARGE, marginHorizontal: Constants.MARGIN_X_LARGE, }}>
                            {this.menus.map((text, index) => {
                                return (

                                    <TouchableOpacity style={{ flexDirection: 'row' }}
                                        key={index}
                                        activeOpacity={Constants.ACTIVE_OPACITY}
                                        onPress={() => this.onResult(index + 1)}>
                                        <View style={{ marginVertical: Constants.MARGIN_LARGE, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                            {index == 0 ? <Image source={ic_edit_red} /> : index == 1 ? <Image source={ic_lock_red} /> : <Image source={ic_logout_red} />}
                                            <Text style={[commonStyles.text, { marginHorizontal: Constants.MARGIN_X_LARGE }]}>{text}</Text>
                                        </View>
                                    </TouchableOpacity>

                                )
                            })}
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    /**
     * On Sort product
     */
    onResult(index) {
        this.setState({
            selected: index,
            isVisible: false
        });
        setTimeout(() => {
            this.props.onResult(index);
        }, 1000)
        
    }
}