import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import * as actions from './redux/actions/index';

class AuthLoading extends Component {
  state = {
    isLoading: true,
  };

  async componentDidMount() {
    try {
      const value = await this.getData();
      const token = await AsyncStorage.getItem('token');
      if (value) {
        this.setLanguage(value);
        if (token) {
          this.props.navigation.navigate('Home');
        } else {
          this.props.navigation.navigate('Welcome');
        }
      } else {
        this.setLanguage('en');
        this.props.navigation.navigate('Welcome');
      }
    } catch (e) {
      // error reading value
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@language_key');
      if (value !== null) {
        return value;
      }
    } catch (e) {
      // error reading value
    }
  };

  setLanguage = async language => {
    await AsyncStorage.setItem('@language_key', language + '');
    this.props.setLanguage(language);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <ActivityIndicator
          size="large"
          style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}
        />
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    language: state.languageReducer.language,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLanguage: language => {
      dispatch(actions.changeLanguage(language));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthLoading);
