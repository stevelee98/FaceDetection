import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, findNodeHandle, ImageBackground, Button } from 'react-native';
import * as actions from 'actions/userActions';
import { connect } from 'react-redux';
import { Constants } from 'values/constants';
import FlatListCustom from '../../components/flatListCustom';
import GridView from '../../components/gridView';
import Dialog, { DIALOG_WIDTH } from '../../components/dialog';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { localizes } from 'locales/i18n';
import ic_close from "../../images/ic_close.png";
import Utils from 'utils/utils';
import { Fonts } from 'values/fonts';

class LoginDialogCustom extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        })
    }

    /**
     * render title for dialog
     */
    renderTitle() {
        const { contentTitle, phoneNumber, styleItemBtn, styleTextTitle, onPressPhoneNumber, onPressX } = this.props;
        return (
            <View>
                <View>
                    <TouchableOpacity 
                        onPress={() => this.state.onPressX()}
                        style={{alignItems: 'flex-end'}}>
                        <Image
                            style={{width: 20, height: 20}}
                            source={require('../../images/ic_close.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={commonStyles.viewCenter}>
                    <Text style={[commonStyles.textBold,{

                        fontSize: Fonts.FONT_SIZE_X_LARGE,
                        margin: Constants.MARGIN_LARGE,
                    }]}>
                        {contentTitle}
                    </Text>
                    <Text style={{
                        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
                        color: Colors.COLOR_BLACK,
                        margin: Constants.MARGIN,
                    }}>
                        Để lấy lại mật khẩu vui lòng liên hệ đến
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.state.onPressPhoneNumber()}>
                        <Text style={[commonStyles.textBold,{
                            fontSize: Fonts.FONT_SIZE_LARGE,
                            color: Colors.COLOR_BLUE_DARK,
                        }]}>{phoneNumber}</Text>
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
                        color: Colors.COLOR_BLACK,
                        textAlign: 'center',
                        margin: Constants.MARGIN,
                    }}>
                        Bộ phân hỗ trợ sẽ giúp bạn reset mật khẩu đăng nhập.
                    </Text>
                </View>
            </View>
        )
    }

    _renderOutsideTouchable(onTouch) {
        const view = <View style={{ flex: 1, width: '100%' }} />

        // if (!onTouch) return view;

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.showDialog(false)
                onTouch && onTouch()
            }} style={{ flex: 1, width: '100%' }}>
                {view}
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <Dialog
                visible={this.state.visible}
                dialogStyle={[commonStyles.shadowOffset, {
                    borderRadius: Constants.CORNER_RADIUS,
                    backgroundColor: Colors.COLOR_WHITE,
                }]}
                onTouchOutside={() => { this.setState({ isAlert: false }) }}
                renderContent={
                    () => {
                        return (
                            <View style={[commonStyles.viewCenter, { margin: Constants.MARGIN_X_LARGE }]} >
                                {this.props.isVisibleTitle ? this.renderTitle() : null}
                            </View>
                        )
                    }
                } />
        )
    }
}

export default LoginDialogCustom;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE
    },
    card: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    text: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent'
    },
    done: {
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        backgroundColor: 'transparent'
    }
})