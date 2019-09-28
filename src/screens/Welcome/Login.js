import React, {Component} from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import axios from 'axios';
import {AppText} from '../../components';
//Import Style
import theme from '../../constants/theme';

import LoginComponent from './LoginComponent';
import SignUpComponent from './SignUpComponent';

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    status: true,
    active: 1,
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    errors: false,
    cookies: '',
  };

  changeStatus = (value, value2) => {
    this.setState({
      status: value,
      active: value2,
    });
  };
  _goHome = () => {
    this.props.navigation.navigate('Home');
  };
  _goSendPass = () => {
    this.props.navigation.navigate("SendNewPassScreen")
  }
  render() {
    return (
      <SafeAreaView>
        <View style={theme.login.container}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[
                theme.login.tabLayout,
                this.state.active === 1 ? theme.login.tabLayoutActive : null,
              ]}
              onPress={() => this.changeStatus(true, 1)}>
              <AppText
                style={[
                  theme.login.tabText,
                  this.state.active === 1 ? theme.login.tabTextActive : null,
                ]}
                i18nKey="signin_title"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                theme.login.tabLayout,
                this.state.active === 2 ? theme.login.tabLayoutActive : null,
              ]}
              onPress={() => this.changeStatus(false, 2)}>
              <AppText
                style={[
                  theme.login.tabText,
                  this.state.active === 2 ? theme.login.tabTextActive : null,
                ]}
                i18nKey="signup_title"
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 24}}>
            {this.state.status ? (
              <LoginComponent goHome={this._goHome} goSendPass={this._goSendPass} />
            ) : (
              <SignUpComponent />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
