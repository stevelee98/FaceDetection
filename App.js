/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text, Button,
    View, TextInput,
    StatusBar
} from 'react-native';
import { capitalizeFirstLetter } from './src/utils/stringUtil';
import { Provider } from 'react-redux';
import * as actions from './src/actions';
import { connect } from 'react-redux';
import store from './src/store';
import { AppNavigator } from 'containers/navigation';
import { Root } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';
import { Constants } from 'values/constants';
import KeyboardManager from 'react-native-keyboard-manager';
import { Colors } from 'values/colors';

export default class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
        Platform.OS === 'android' ? null : KeyboardManager.setEnable(false)
    }

    render() {
        StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY, true)
        return (
            <Provider store={store}>
                <Root>
                    <MenuProvider customStyles={menuProviderStyles}>
                        <AppNavigator />
                    </MenuProvider>
                </Root>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    }
});

const menuProviderStyles = {
};

