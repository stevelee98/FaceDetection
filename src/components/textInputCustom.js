import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions, ImageBackground, Image, TouchableOpacity } from 'react-native';
import GridView from 'components/gridView';
import PropTypes from 'prop-types';
import { Textarea, Input, InputGroup } from 'native-base';
import white_shadow_android from "images/white_blur_shadow.png"
import commonStyles from 'styles/commonStyles';
import ic_next_white from 'images/ic_next_white.png';
import { Colors } from 'values/colors';
import Utils from 'utils/utils';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';
import { TextInputMask } from 'react-native-masked-text';

/**
 * This is text input custom without using state to change value
 * You can use this component instead of TextInput
 */

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get("window").width;

export default class TextInputCustom extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value ? props.value : "",
            isFocus: props.isFocus,
            showResults: false,
        }
    }

    onClick = () => {
        this.setState({ showResults: true });
    }

    render() {
        const { isMultiLines, isInputAction, isInputNormal, isInputMask } = this.props
        return (
            <View>
                {isMultiLines ? this.renderInputMultiLines() : null}
                {isInputAction ? this.renderInputAction() : null}
                {isInputNormal ? this.renderInputOneLine() : null}
                {isInputMask ? this.renderInputMask() : null}
            </View>
        )
    }

    renderInputOneLine() {
        const { refInput, inputNormalStyle, autoCapitalize, returnKeyType, placeholder,
            onSubmitEditing, keyboardType, secureTextEntry, borderBottomWidth, contentLeft, contentRight,
            onSelectionChange, blurOnSubmit, onFocus, numberOfLines, styleInputGroup, styleTitle, fault = false } = this.props;
        console.log("fault TEXT INPUT CUSTOM: ", fault);
        return (
            <InputGroup style={[{
                paddingRight: 0,
                paddingLeft: 0,
                borderBottomWidth: !Utils.isNull(borderBottomWidth) ? borderBottomWidth : 0,
                borderBottomColor: fault ? Colors.COLOR_RED : Colors.COLOR_BORDER
            }, styleInputGroup]}>
                {!Utils.isNull(contentLeft) ? <Image source={contentLeft} style={{ marginRight: Constants.MARGIN_LARGE }} /> : null}
                {!Utils.isNull(this.props.title) ? <Text style={{ fontWeight: 'bold', fontSize: Fonts.FONT_SIZE_X_MEDIUM, width: widthDevice * 1 / 4 }}>{this.props.title}</Text> : null}
                <TextInput
                    {...this.props}
                    ref={refInput}
                    secureTextEntry={secureTextEntry}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.COLOR_TEXT_PLACEHOLDER}
                    returnKeyType={returnKeyType}
                    autoCapitalize={autoCapitalize}
                    style={[commonStyles.text, inputNormalStyle, {
                        flex: 1,
                        elevation: 0,
                        padding: 0,
                        margin: 0,
                        height: Constants.HEIGHT_INPUT,
                        textAlign: this.props.textAlignInput,
                        paddingVertical: Constants.PADDING_LARGE,
                    }]}
                    value={this.state.value}
                    onChangeText={this.changeText.bind(this)}
                    underlineColorAndroid='transparent'
                    onSubmitEditing={onSubmitEditing}
                    keyboardType={keyboardType}
                    onSelectionChange={onSelectionChange}
                    blurOnSubmit={blurOnSubmit}
                    onFocus={onFocus}
                    numberOfLines={numberOfLines}
                />
                {!Utils.isNull(contentRight) ? contentRight : null}
            </InputGroup>
        );
    }

    renderInputAction() {
        const { refInput, onPress, touchSpecialStyle, inputNormalStyle, imageSpecialStyle, placeholder,
            myBackgroundColor, disabled, autoCapitalize, opacity, onFocus, isAsterisk, fault = false } = this.props;
        return (
            <View>
                {this.state.showResults || !Utils.isNull(this.state.value) ? <Text style={[commonStyles.textInputLogin]}>{this.props.title}
                    {isAsterisk ? this.renderAsterisk() : null}
                </Text> : null}
                <TouchableOpacity
                    disabled={disabled}
                    onPress={onPress}
                    activeOpacity={1}
                    style={[touchSpecialStyle, {
                        elevation: 0,
                    }]}>
                    <TextInput
                        {...this.props}
                        autoCapitalize={autoCapitalize}
                        ref={refInput}
                        style={[{
                            flex: 1,
                            elevation: 0,
                            padding: 0,
                            margin: 0,
                            height: Constants.HEIGHT_INPUT,
                            textAlign: this.props.textAlignInput,
                        }, commonStyles.text, inputNormalStyle, {
                            borderBottomWidth: fault ? 1 : Constants.BORDER_WIDTH,
                            borderBottomColor: fault ? Colors.COLOR_RED : Colors.COLOR_BORDER,
                        }]}
                        placeholder={!(this.state.showResults) ? placeholder : ''}
                        placeholderTextColor={Colors.COLOR_DRK_GREY}
                        value={this.state.value}
                        onChangeText={this.changeText.bind(this)}
                        underlineColorAndroid='transparent'
                        blurOnSubmit={false}
                        autoCorrect={false}
                        selectTextOnFocus={false}
                        onFocus={() => {
                            this.onClick()
                        }}
                        onBlur={() => { this.setState({ showResults: false }) }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    renderInputMultiLines() {
        const { inputNormalStyle, refInput, autoCapitalize, borderBottomWidth, contentLeft, contentRight,
            blurOnSubmit, styleInputGroup, keyboardType, returnKeyType, onSubmitEditing } = this.props
        return (
            <InputGroup style={[{
                paddingRight: 0,
                paddingLeft: 0,
                borderBottomWidth: !Utils.isNull(borderBottomWidth) ? borderBottomWidth : 0,
                borderBottomColor: Colors.COLOR_BORDER
            }, styleInputGroup]}>
                {!Utils.isNull(contentLeft) ? <Image source={contentLeft} style={{ marginRight: Constants.MARGIN_LARGE }} /> : null}
                {!Utils.isNull(this.props.title) ? <Text style={{ fontWeight: 'bold', fontSize: Fonts.FONT_SIZE_X_MEDIUM, width: widthDevice * 1 / 4, }}>{this.props.title}</Text> : null }
                <TextInput
                    {...this.props}
                    ref={refInput}
                    style={[commonStyles.text, inputNormalStyle,{
                        flex: 1,
                        elevation: 0,
                        paddingLeft: 0,
                        margin: 0,
                        textAlign: this.props.textAlignInput,
                        paddingVertical: Constants.PADDING_LARGE,
                    }]}
                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                    onChangeText={this.changeText.bind(this)}
                    underlineColorAndroid='transparent'
                    blurOnSubmit={false}
                    multiline={true}
                    autoCapitalize={autoCapitalize}
                    value={this.state.value}
                    autoCorrect={false}
                    selectTextOnFocus={false}
                    keyboardType={keyboardType}
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType={returnKeyType}
                />
            </InputGroup>
        )
    }

    renderInputMask() {
        const { refInput, inputNormalStyle, autoCapitalize, returnKeyType, placeholder, onSubmitEditing,
            keyboardType, secureTextEntry, onSelectionChange, blurOnSubmit, borderBottomWidth,
            onFocus, numberOfLines, title, warnTitle, isValidate, hrEnable = true, typeFormat, options } = this.props;
        return (
            <View style={{    
                marginHorizontal: Constants.MARGIN_X_LARGE,        
                borderBottomWidth: !Utils.isNull(borderBottomWidth) ? borderBottomWidth : 0,
                borderBottomColor: Colors.COLOR_BORDER }}>
                {!Utils.isNull(this.props.title) ? <Text style={{ fontWeight: 'bold', fontSize: Fonts.FONT_SIZE_X_MEDIUM, width: widthDevice * 1 / 4, }}>{this.props.title}</Text> : null}
                <TextInputMask
                    {...this.props}
                    ref={refInput}
                    autoCapitalize={autoCapitalize}
                    secureTextEntry={secureTextEntry}
                    style={[commonStyles.text, inputNormalStyle, {
                        margin: 0,
                    }]}
                    placeholder={placeholder}
                    returnKeyType={returnKeyType}
                    value={this.state.value}
                    onChangeText={this.changeText.bind(this)}
                    underlineColorAndroid='transparent'
                    keyboardType={keyboardType}
                    blurOnSubmit={blurOnSubmit}
                    onSelectionChange={onSelectionChange}
                    onFocus={onFocus}
                    type={typeFormat}
                    options={options}
                    numberOfLines={numberOfLines}
                />
            </View>
        )
    }

    changeText(text) {
        this.setState({
            value: text
        })
        if (this.props.onChangeText)
            this.props.onChangeText(text)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    renderAsterisk() {
        return (
            <Text style={{ color: 'red' }}> *</Text>
        );
    }

}