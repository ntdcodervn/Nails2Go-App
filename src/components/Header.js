import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  TextInput,
} from 'react-native';
import {colors, sizes, fonts} from '../constants/theme';
// Import Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import {icons} from '../utils/images';
import axios from 'axios';
import {AppText} from './';
import {services} from '../../src/constants/theme';
import {BASE_URL_ROUTE, getData} from '../utils/misc';

export default class Header extends Component {
  state = {
    searchValue: '',
  };
  updateInput = value => {
    this.setState({searchValue: value});
    this.props.onSearchChange(value);
  };
  render() {
    const {
      rightMenu,
      headerStyle,
      backScreen,
      whiteText,
      searchIcon,
      cartIcon,
      middleTitle,
    } = this.props;
    return rightMenu ? (
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          headerStyle,
        ]}>
        {backScreen ? (
          <TouchableOpacity
            onPress={() => this.props.onClick()}
            style={{width: 24}}>
            <Image
              source={whiteText ? icons.backIconWhite : icons.backIcon}
              style={{height: 20, marginVertical: 10}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : this.props.searchInput ? (
          <TextInput
            placeholder="Search..."
            style={{marginVertical: 10}}
            placeholderTextColor="#9DA3B4"
            value={this.state.searchValue}
            autoCaptitalize={'none'}
            onChangeText={value => this.updateInput(value)}
          />
        ) : (
          <AppText
            style={[styles.header, this.props.style]}
            i18nKey={this.props.i18nKey}
          />
        )}
        {middleTitle ? (
          <AppText
            style={[styles.header, this.props.style]}
            i18nKey={this.props.i18nKey}
          />
        ) : null}
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {searchIcon ? (
            <TouchableOpacity
              onPress={() => this.props.onPressSearch()}
              style={{marginRight: 20}}>
              <Ionicons
                name="ios-search"
                color={whiteText ? '#fff' : '#000'}
                size={sizes.h1}
              />
            </TouchableOpacity>
          ) : null}
          {cartIcon ? (
            <TouchableOpacity onPress={() => this.props.onPressCart()}>
              <Ionicons
                name="md-basket"
                color={whiteText ? '#fff' : '#000'}
                size={sizes.h1}
              />
        
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    ) : (
      <View
        style={[
          {
            flexDirection: 'row',
            width : '93%',
            marginTop : 10,
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          headerStyle,
        ]}>
      <AppText
        style={[styles.header, this.props.style]}
        i18nKey={this.props.i18nKey}
      />

      <Image
           style={{
            height: 50,
            width: 55,
          
           
          }}
          // resizeMode="contain"
          source={require('../assets/images/logoNail.jpg')}
          ></Image>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    color: colors.heading,
    fontFamily: fonts.black,
    fontSize: sizes.h1,
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
});
