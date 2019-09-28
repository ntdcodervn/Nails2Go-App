import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import ValidationRules from '../../utils/validateForm';
import axios from 'axios';
import {ButtonGradient, AppText, Input} from '../../components';
//Import Sign In & Sign Up Form
import theme, {colors, fonts} from '../../constants/theme';
export default class SignUpComponent extends Component {
  state = {
    errorResult: [],
    hasErrors: false,
    form: {
      firstName: {
        value: '',
        valid: false,
        type: 'textinput',
        rules: {
          isRequired: true,
        },
      },
      lastName: {
        value: '',
        valid: false,
        type: 'textinput',
        rules: {
          isRequired: true,
        },
      },
      email: {
        value: '',
        valid: false,
        type: 'textinput',
        rules: {
          isRequired: true,
        },
      },
      password: {
        value: '',
        valid: false,
        type: 'textinput',
        rules: {
          isRequired: true,
        },
      },
    },
  };
  updateInput = (name, value) => {
    this.setState({
      hasErrors: false,
    });
    let formCopy = this.state.form;
    formCopy[name].value = value;
    // Check Form
    let rules = formCopy[name].rules;
    let valid = ValidationRules(value, rules);
    formCopy[name].valid = valid;
    this.setState({
      form: formCopy,
    });
  };
  submitUser = async () => {
    let isFormValid = true;
    let formToSubmit = {};
    const formCopy = this.state.form;
    for (let key in formCopy) {
      isFormValid = isFormValid && formCopy[key].valid;
      formToSubmit[key] = formCopy[key].value;
    }
    if (isFormValid) {
      let response = await this.signupUser(
        formToSubmit.firstName,
        formToSubmit.lastName,
        formToSubmit.email,
        formToSubmit.password,
      );
      console.log(response);
      if (response.token) {
        await storeData('token', response.token);
        this.props.goHome();
      } else {
        this.setState({
          hasErrors: true,
          errorResult: response.errors,
        });
      }
    } else {
      this.setState({
        hasErrors: true,
      });
    }
  };
  formHasErrors = () => {
    if (this.state.errorResult.length > 0 || this.state.hasErrors) {
      return (
        <View
          style={{
            backgroundColor: colors.hover,
            padding: 10,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          {this.state.errorResult.length > 0 ? (
            this.state.errorResult.map((error, index) => (
              <Text
                style={{color: '#fff', fontFamily: fonts.regular}}
                key={index}>
                {error.msg}
              </Text>
            ))
          ) : (
            <Text style={{color: '#fff', fontFamily: fonts.regular}}>
              Please fill out the information
            </Text>
          )}
        </View>
      );
    } else {
      return null;
    }
  };
  signupUser = async (firstname, lastname, email, password) => {
    try {
      var data = await axios({
        url: 'https://nail2go-server.herokuapp.com/api/users/signUp',
        method: 'POST',
        data: {
          firstName: firstname,
          lastName: lastname,
          email: email,
          password: password,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return (
      <React.Fragment>
        <ScrollView>
          {this.formHasErrors()}
          <View style={theme.login.fullname}>
            <View style={[theme.login.childName, {marginRight: 20}]}>
              <AppText style={theme.login.formTitle} i18nKey="firstname" />
              <Input
                placeholder="Jane"
                placeholderTextColor="#9DA3B4"
                type={this.state.form.firstName.type}
                value={this.state.form.firstName.value}
                autoCaptitalize={'none'}
                onChangeText={value => this.updateInput('firstName', value)}
              />
            </View>
            <View style={[theme.login.childName, {marginLeft: 20}]}>
              <AppText style={theme.login.formTitle} i18nKey="lastname" />
              <Input
                placeholder="Doe"
                placeholderTextColor="#9DA3B4"
                type={this.state.form.lastName.type}
                value={this.state.form.lastName.value}
                autoCaptitalize={'none'}
                onChangeText={value => this.updateInput('lastName', value)}
              />
            </View>
          </View>
          <AppText style={theme.login.formTitle} i18nKey="email" />
          <Input
            placeholder="example@email.com"
            placeholderTextColor="#9DA3B4"
            type={this.state.form.email.type}
            value={this.state.form.email.value}
            autoCaptitalize={'none'}
            keyboardType={'email-address'}
            onChangeText={value => this.updateInput('email', value)}
          />
          <AppText style={theme.login.formTitle} i18nKey="password" />
          <Input
            placeholder="password"
            placeholderTextColor="#9DA3B4"
            type={this.state.form.password.type}
            value={this.state.form.password.value}
            autoCaptitalize={'none'}
            onChangeText={value => this.updateInput('password', value)}
            secureTextEntry
          />
          <ButtonGradient
            onClick={this.submitUser}
            fcolor="#FF00A9"
            scolor="#FF3D81"
            i18nKey="signup_title"
          />
        </ScrollView>
      </React.Fragment>
    );
  }
}
