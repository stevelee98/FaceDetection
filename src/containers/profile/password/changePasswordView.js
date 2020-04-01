'use strict';
import React, {Component} from 'react';
import { View, TextInput, Image, StyleSheet, Text, ImageBackground, Alert, TouchableHighlight, TouchableOpacity, ToastAndroid, Platform, Keyboard, BackHandler,
} from 'react-native';
import { Container, Form, Content, Item, Input, Button, Right, ListItem, Radio, Left, Icon, Header, Root, Toast,
} from 'native-base';
import styles from './styles';
import {localizes} from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import I18n from 'react-native-i18n';
import {Colors} from 'values/colors';
import * as actions from 'actions/userActions';
import {connect} from 'react-redux';
import {ErrorCode} from 'config/errorCode';
import {ActionEvent, getActionSuccess} from 'actions/actionEvent';
import StorageUtil from 'utils/storageUtil';
import {Constants} from 'values/constants';
import Utils from 'utils/utils';
import {Fonts} from 'values/fonts';
import {StackActions, NavigationActions} from 'react-navigation';
import TextInputCustom from 'components/textInputCustom';
import DialogCustom from 'components/dialogCustom';
import shadow_horizontal from 'images/shadow_horizontal.png';
import ic_eye_unlock_black from 'images/ic_eye_unlock_black.png';
import ic_eye_lock_black from 'images/ic_eye_lock_black.png';
import HeaderGradient from 'containers/common/headerGradient';

class ChangePassword extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: '',
      newPass: '',
      confirmPass: '',
      hideOldPassword: true,
      hideNewPassword: true,
      hideNewPasswordConfirm: true,
      isData: false,
      isAlertSuccess: false,
      faultOldPass: false,
      faultNewPass: false,
      faultConfirmPass: false
    };
    const { isEmptyPassword } = this.props.navigation.state.params;
    this.isEmptyPassword = isEmptyPassword;
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handlerBackButton,
    );
  }

  // Hide & show old password
  manageOldPasswordVisibility = () => {
    // function used to change password visibility
    let last = this.state.oldPass;
    this.setState({
      hideOldPassword: !this.state.hideOldPassword,
      oldPass: '',
    });
    setTimeout(() => {
      this.setState({
        oldPass: last,
      });
    }, 0);
  };

  // Hide & show new password
  manageNewPasswordVisibility = () => {
    // function used to change password visibility
    let last = this.state.newPass;
    this.setState({
      hideNewPassword: !this.state.hideNewPassword,
      newPass: '',
    });
    setTimeout(() => {
      this.setState({
        newPass: last,
      });
    }, 0);
  };

  // Hide & show confirm new password
  manageNewPasswordConfirmVisibility = () => {
    let last = this.state.confirmPass;
    this.setState({
      hideNewPasswordConfirm: !this.state.hideNewPasswordConfirm,
      confirmPass: '',
    });
    setTimeout(() => {
      this.setState({
        confirmPass: last,
      });
    }, 0);
  };

  // On press change password
  onPressCommonButton = () => {
    let {oldPass, newPass, confirmPass} = this.state;
    if (oldPass.length == 0 && !this.isEmptyPassword) {
      this.showMessage(localizes('setting.enterOldPass'));
      this.password.focus();
      this.setState({
        faultOldPass: true
      })
      return false;
    } else if (newPass == "") {
      this.showMessage(localizes('setting.enterNewPass'));
      this.newPassword.focus();
      this.setState({
        faultNewPass: true
      })
      return false;
    } else if (newPass.length < 6 || newPass.length > 20) {
      this.showMessage(localizes("confirmPassword.vali_character_password"))
      this.newPassword.focus()
      this.setState({
        faultNewPass: true
      })
      return false
    } else if (!Utils.validateContainUpperPassword(newPass)) {
      this.showMessage(localizes("register.vali_character_password"));
      this.newPassword.focus();
      this.setState({
        faultNewPass: true
      })
      return false
    } else if (Utils.validateSpacesPass(newPass)) {
      this.showMessage(localizes("register.vali_pass_space"));
      this.newPassword.focus();
      this.setState({
        faultNewPass: true
      })
      return false
    } else if (confirmPass.length == 0) {
      this.showMessage(localizes('setting.enterConfPass'));
      this.confirmPassword.focus();
      this.setState({
        faultConfirmPass: true
      })
      return false;
    } else if (newPass !== confirmPass) {
      this.showMessage(localizes('register.vali_confirm_password'));
      this.confirmPassword.focus();
      this.setState({
        faultConfirmPass: true
      })
      return false;
    } else {
      this.props.changePass(oldPass, newPass);
      return true;
    }
  };

  /**
   * On cancel edit
   */
  onCancelEdit() {
    this.setState({
      oldPass: '',
      newPass: '',
      confirmPass: '',
    });
    this.props.navigation.navigate("Profile");
  }

  handleData() {
    let data = this.props.data;
    console.log('Data pass', data);
    if (data != null && this.props.errorCode != ErrorCode.ERROR_INIT) {
      if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
        if (this.props.action == getActionSuccess(ActionEvent.CHANGE_PASS)) {
          if (data) {
            this.setState({
              oldPass: '',
              newPass: '',
              confirmPass: '',
              hideOldPassword: true,
              hideNewPassword: true,
              hideNewPasswordConfirm: true,
              isAlertSuccess: true,
            });
          } else {
            this.showMessage(localizes('setting.oldPassFail'));
            this.setState({
              faultPass: false
          })
            this.password.focus();
          }
        }
      } else {
        this.handleError(this.props.errorCode, this.props.error);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.props = nextProps;
      this.handleData();
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Root>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}>
            <HeaderGradient
              visibleStage={false}
              onBack={this.onBack}
              title={localizes("forgot_password.titleChangePassword")}
              renderRightMenu={this.renderRightMenu}>
            </HeaderGradient>
            <Content contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
              <Form
                style={{
                  flex: 1,
                  backgroundColor: Colors.COLOR_WHITE,
                  borderRadius: Constants.CORNER_RADIUS,
                  paddingTop: Constants.PADDING_X_LARGE,
                }}>
                {/* Old password */}
                { !this.isEmptyPassword ? <View style={{justifyContent: 'center', position: 'relative', 
                marginHorizontal: Constants.MARGIN_X_LARGE,}}>
                  <TextInputCustom
                    refInput={ref => (this.password = ref)}
                    isInputAction={true}
                    title={"Mật khẩu cũ"}
                    placeholder="Mật khẩu cũ"
                    value={this.state.oldPass}
                    underlineColorAndroid="transparent"
                    secureTextEntry={this.state.hideOldPassword}
                    fault={this.state.faultOldPass}
                    onChangeText={text => {
                      this.setState({
                        oldPass: text,
                        faultOldPass: false
                      });
                    }}
                    onSubmitEditing={() => {
                      this.newPassword.focus();
                    }}
                    returnKeyType={'next'}
                  />
                  <TouchableHighlight
                    onPress={this.manageOldPasswordVisibility}
                    style={[
                      commonStyles.shadowOffset,
                      {
                        position: 'absolute',
                        padding: Constants.PADDING_LARGE,
                        right: Constants.PADDING_LARGE,
                      },
                    ]}
                    underlayColor="transparent">
                    <Image
                      style={{resizeMode: 'contain', opacity: Constants.SHADOW_OPACITY_BUTTON}}
                      source={
                        this.state.hideOldPassword
                          ? ic_eye_lock_black
                          : ic_eye_unlock_black
                      }
                    />
                  </TouchableHighlight>
                </View> : null }
                {/* New password */}
                <View style={{justifyContent: 'center', position: 'relative',
                marginRight: Constants.MARGIN_X_LARGE,
                marginLeft: Constants.MARGIN_X_LARGE,}}>
                  <TextInputCustom
                    refInput={ref => (this.newPassword = ref)}
                    isInputAction={true}
                    title={"Mật khẩu mới"}
                    placeholder="Mật khẩu mới"
                    value={this.state.newPass}
                    fault={this.state.faultNewPass}
                    underlineColorAndroid="transparent"
                    secureTextEntry={this.state.hideNewPassword}
                    onChangeText={text => {
                      this.setState({
                        newPass: text,
                        faultNewPass: false
                      });
                    }}
                    onSubmitEditing={() => {
                      this.confirmPassword.focus();
                    }}
                    returnKeyType={'next'}
                  />
                  <TouchableHighlight
                    onPress={this.manageNewPasswordVisibility}
                    style={[
                      commonStyles.shadowOffset,
                      {
                        position: 'absolute',
                        padding: Constants.PADDING_LARGE,
                        right: Constants.PADDING_LARGE,
                      },
                    ]}
                    underlayColor="transparent">
                    <Image
                      style={{resizeMode: 'contain', opacity: Constants.SHADOW_OPACITY_BUTTON}}
                      source={
                        this.state.hideNewPassword
                          ? ic_eye_lock_black
                          : ic_eye_unlock_black
                      }
                    />
                  </TouchableHighlight>
                </View>
                {/* Confirm new password */}
                <View style={{justifyContent: 'center', position: 'relative',
                marginRight: Constants.MARGIN_X_LARGE,
                marginLeft: Constants.MARGIN_X_LARGE,}}>
                  <TextInputCustom
                    refInput={ref => (this.confirmPassword = ref)}
                    isInputAction={true}
                    title={"Nhập lại mật khẩu mới"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={this.state.confirmPass}
                    fault={this.state.faultConfirmPass}
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    underlineColorAndroid="transparent"
                    secureTextEntry={this.state.hideNewPasswordConfirm}
                    onChangeText={text => {
                      this.setState({
                        confirmPass: text,
                        faultConfirmPass: false
                      });
                    }}
                    returnKeyType={'done'}
                  />
                  <TouchableHighlight
                    onPress={this.manageNewPasswordConfirmVisibility}
                    style={[
                      commonStyles.shadowOffset,
                      {
                        position: 'absolute',
                        padding: Constants.PADDING_LARGE,
                        right: Constants.PADDING_LARGE,
                      },
                    ]}
                    underlayColor="transparent">
                    <Image
                      style={{resizeMode: 'contain', opacity: Constants.SHADOW_OPACITY_BUTTON}}
                      source={
                        this.state.hideNewPasswordConfirm
                          ? ic_eye_lock_black
                          : ic_eye_unlock_black
                      }
                    />
                  </TouchableHighlight>
                </View>
                {/* Button save */}
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  {/* button change */}
                  <View style={{flexDirection: 'row', margin:Constants.MARGIN_X_LARGE}}>
                    {this.renderCommonButton(
                      'Thay đổi',
                      {color: Colors.COLOR_WHITE},
                      [
                        commonStyles.shadowOffset,
                        {
                          flex: 1,
                          marginHorizontal: Constants.MARGIN_X_LARGE,
                          marginTop: 2 * Constants.MARGIN_X_LARGE,
                          marginBottom: Constants.MARGIN_LARGE,
                        },
                      ],
                      () => {
                        this.onPressCommonButton();
                      },
                    )}
                  </View>
                  {/* button cancel */}
                  <View style={{flexDirection: 'row',
                    marginLeft: Constants.MARGIN_X_LARGE,
                    marginRight: Constants.MARGIN_X_LARGE,
                    marginBottom: Constants.MARGIN_XX_LARGE,
                    borderRadius: Constants.MARGIN_24,
                    borderWidth: Constants.DIVIDE_HEIGHT_SMALL,
                    borderColor: Colors.COLOR_GRAY,}}>
                    <TouchableHighlight
                    onPress={() => {
                      this.onCancelEdit()}}
                    style={[{ flex: 1, padding: Constants.PADDING,
                    borderRadius: Constants.CORNER_RADIUS,}, commonStyles.viewCenter,]}
                    underlayColor={Colors.COLOR_SHADOW}>
                      <Text style={[commonStyles.textBold, commonStyles.text]}>Hủy</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Form>
              {this.renderAlertSuccess()}
            </Content>
          </View>
          {this.showLoadingBar(this.props.isLoading)}
        </Root>
      </Container>
    );
  }

    /**
    * Render right menu
    */
    renderRightMenu = () => {
        return (
            <View style={{paddingHorizontal: Constants.MARGIN_X_LARGE}}></View>
        )
    }

  /**
   * Render alert success
   */
  renderAlertSuccess() {
    return (
      <DialogCustom
        visible={this.state.isAlertSuccess}
        isVisibleTitle={true}
        isVisibleOneButton={true}
        isVisibleContentText={true}
        contentTitle={'Thông báo'}
        textBtn={'OK'}
        contentText={localizes('setting.change_pass_success')}
        onPressBtn={() => {
          this.setState({isAlertSuccess: false});
          this.props.navigation.navigate('Profile');
        }}
      />
    );
  }
}
const mapStateToProps = state => ({
  data: state.changePass.data,
  action: state.changePass.action,
  isLoading: state.changePass.isLoading,
  error: state.changePass.error,
  errorCode: state.changePass.errorCode,
});
export default connect(mapStateToProps, actions)(ChangePassword);
