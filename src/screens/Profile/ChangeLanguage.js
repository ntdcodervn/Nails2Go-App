import React, {Component} from 'react';
import {Text, View,BackHandler,exit} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions/index';
import {fonts} from '../../constants/theme';
import {langList} from '../../utils/misc';
import RNRestart from 'react-native-restart';

class ChangeLanguage extends Component {
  setLanguage = async (language,label) => {
    await AsyncStorage.setItem('@language_key', language);
    await AsyncStorage.setItem('@language_label', label);
    this.props.setLanguage(language);
    RNRestart.Restart();
    // Platform.OS === 'android' ?  alert('The app will turn off after 1 second !') :  alert('Please restart your app, to update the language !');;
   
   
    // setTimeout(() => {
    //   Platform.OS === 'android' ? BackHandler.exitApp() : '';
   
    // },1000)
  };
  render() { 
    return (
      <View>
        {langList.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => this.setLanguage(item.id,item.label)}>
            <Text style={{padding: 15, fontFamily: fonts.regular}}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
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
)(ChangeLanguage);
