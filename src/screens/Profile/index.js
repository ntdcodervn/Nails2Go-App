import React, {Component} from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Header, AppText} from '../../components';
import {BASE_URL_ROUTE, getData, langList} from '../../utils/misc';
import ImagePicker from 'react-native-image-picker';
import {profile, fonts, sizes, colors} from '../../constants/theme';
import AsyncStorage from '@react-native-community/async-storage';
import {icons} from '../../utils/images';
import ValidationRules from '../../utils/validateForm';
import {changeName} from '../../utils/api';
export default class ProfileScreen extends Component {
  static navigationOptions = {
    header: null,
    langeChoosed: null,
  };

  onLogout = () => {
    AsyncStorage.removeItem('token');
    this.props.navigation.navigate('Welcome');
  };



  state = {
    colorTrueSwitchIsOn: true,
    colorFalseSwitchIsOn: false,
    data: {},
    booked : 0,
    token: '',
    edit: false,
    errorResult: [],
    hasErrors: false,
    langeChoosedCus : 'english',
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
    },
  };

  async checkPermission() {
    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const isGranted2 = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (isGranted && isGranted2) {
      return true;
    }
    try {
      this.requestPermission();
    } catch (err) {
      console.log('error');
      console.log(err);
    }
  }

  async requestPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ],
        {
          title: 'Cho phép sử dụng máy ảnh và bộ nhớ',
          message: 'Bạn cần cấp phép truy cập bộ nhớ để có thể tải file về',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Huỷ',
          buttonPositive: 'Cho phép',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  }

  selectPhotoTapped = () => {
    this.checkPermission();
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response);
        let source = {uri: response.uri};
        this.setState({
          imageSource: source,
        });
        this.updateImage(response);
      }
    });
  };
  updateImage = async photo => {
    const formData = new FormData();
    formData.append(
      'avatarUser',
     {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")

     }
    );
    try {
      let response = await axios({
        method: 'POST',
        url: `${BASE_URL_ROUTE}api/users/editAvatar`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': this.state.token,
          Accept: 'application/json',
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  async componentDidMount() {
    const token = await getData('token');
    var language = await AsyncStorage.getItem('@language_key');
    let getTotalBooked = await axios.get(`${BASE_URL_ROUTE}api/booking/totalBooked`,{
      headers : {
        "x-auth-token" : token
      }
    })
    
    if(getTotalBooked.status !== null && getTotalBooked.status == 200)
    {
      console.log(getTotalBooked.data.total)
      this.setState({
        booked : getTotalBooked.data.total
      })
    }
   
    this._renderLanguageLabel()
    this.setState({token});
    this.getUserInfo(this.state.token);
  }
  

  getUserInfo = async token => {
    try {
      var data = await axios({
        url: `${BASE_URL_ROUTE}api/users/getDataUser`,
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      this.setState({
        data: data.data,
        form: {
          firstName: {
            value: data.data.name.split(' ')[0],
          },
          lastName: {
            value: data.data.name.split(' ')[1],
          },
        },
        isLoading: false,
        imageSource: {uri: BASE_URL_ROUTE + data.data.avatar},
      });
    } catch (error) {
      console.log(error);
    }
  };

  editInfo = () => {
    this.setState({edit: !this.state.edit});
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
    let response = await changeName(
      formToSubmit.firstName,
      formToSubmit.lastName,
      this.state.token,
    );
    if (response.msg) {
      alert('Success');
      this.setState({edit: false});
    } else {
      this.setState({
        hasErrors: true,
        errorResult: response.errors,
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

  _renderLanguageLabel = async () => {
      let label = await AsyncStorage.getItem('@language_label');
      if(label)
      {
        this.setState({
          langeChoosedCus : label
        })
      }
      else {
        this.setState({
          langeChoosedCus : 'english'
        })
      }
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, width: '100%'}}>
        <Header i18nKey="profile_nav" style={{paddingHorizontal: 24}} />
        <ScrollView
          style={{width: '100%', flex: 1}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{flexGrow: 1}}>
            <View style={profile.PersonInfo}>
              <TouchableOpacity onPress={() => this.selectPhotoTapped()}>
                <View style={profile.PersonInfo}>
                  <Image
                    style={profile.avatar}
                    source={this.state.imageSource}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 15,
                      right: 0,
                      backgroundColor: colors.primary,
                      width: 18,
                      height: 18,
                      alignItems: 'center',
                      borderRadius: 30,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: fonts.bold,
                        fontSize: sizes.h3,
                      }}>
                      +
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {this.state.edit ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <TextInput
                    type={this.state.form.firstName.type}
                    value={this.state.form.firstName.value}
                    autoCaptitalize={'none'}
                    maxLength={15}
                    style={{
                      backgroundColor: '#9DA3B4',
                      marginRight: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}
                    onChangeText={value => this.updateInput('firstName', value)}
                  />
                  <TextInput
                    type={this.state.form.lastName.type}
                    value={this.state.form.lastName.value}
                    autoCaptitalize={'none'}
                    maxLength={15}
                    style={{
                      backgroundColor: '#9DA3B4',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}
                    onChangeText={value => this.updateInput('lastName', value)}
                  />
                  <TouchableOpacity
                    style={{marginLeft: 15}}
                    onPress={() => this.submitUser()}>
                    <Image
                      style={{width: 16, height: 16}}
                      resizeMode="contain"
                      source={icons.saveIcon}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={[profile.fullname, {fontFamily: fonts.bold}]}>
                    {this.state.form.firstName.value}{' '}
                    {this.state.form.lastName.value}
                  </Text>
                  <TouchableOpacity
                    style={{marginLeft: 15}}
                    onPress={() => this.editInfo()}>
                    <Image
                      style={{width: 16, height: 16}}
                      resizeMode="contain"
                      source={icons.editIcon}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <Text style={profile.email}>{this.state.data.email}</Text>
            </View>
            <View style={profile.PointInfo}>
              <View style={profile.point}>
                <Text style={profile.content}>{this.state.data.point}</Text>
                <AppText i18nKey="point" style={profile.Infotitle}></AppText>
              </View>
              <View style={profile.booked}>
                <Text style={profile.content}>{this.state.booked}</Text>
                <AppText i18nKey="booked" style={profile.Infotitle}></AppText>
              </View>
            </View>
            <View style={profile.subFunction}>
            
              <AppText i18nKey="settings" style={profile.functionTitle}></AppText>
              <View style={profile.functionTools}>
                
                
                <AppText style={{
                    fontFamily: fonts.regular,
                    fontSize: sizes.h4,
                    color: colors.text,
                  }} i18nKey="language"> </AppText>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ChangeLanguage')
                  }>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: sizes.h4,
                      color: colors.secondary_text,
                    }}>
                    {this.state.langeChoosedCus}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={profile.touchlogin}
              onPress={() => this.props.navigation.navigate('ChangePassword')}>
              <AppText style={profile.logginText} i18nKey="change_password"> </AppText>
              
            </TouchableOpacity>
            <TouchableOpacity
              style={profile.touchlogin}
              onPress={() => this.onLogout()}>
              <AppText style={profile.logginText} i18nKey="logout"> </AppText>
              
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
