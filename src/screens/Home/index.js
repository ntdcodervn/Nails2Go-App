import React, {Component} from 'react';
import axios from 'axios';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BASE_URL_ROUTE, getData} from '../../utils/misc';
import {home} from '../../constants/theme';
import {Header, AppText} from '../../components';
import {getUserInfo, getServices} from '../../utils/api';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    status: true,
    isLoading: true,
    token: '',
    userInfo: null,
    services: null,
    role: 'admin',
  };

  async componentDidMount() {
    var token = await getData('token');
    var userInfo = await getUserInfo(token);
    var services = await getServices(token);
    this.setState({
      userInfo,
      services,
      isLoading: true,
      token: token,
    });
  }
  // Render Hot Services
  renderHotItems(item, index) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('HotServicesDetails', {item})
        }>
        <View style={home.hotItem}>
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            source={{uri: item.image[0]}}
          />
          <View style={home.hotTitleBG}>
            <Text style={home.hotTitle}>{item.nameService[0].value}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {userInfo, services} = this.state;
    return (
      <SafeAreaView style={home.container}>
        <View style={{width : '90%',marginBottom : 20, marginTop : 20,flexDirection:'row',justifyContent:'space-between'}}>
          <Image
           style={{
            height: 40,
            width: 74,
          
           
          }}
          // resizeMode="contain"
          source={require('../../assets/images/logoNail.jpg')}
          >

          </Image>
          <View style={{flexDirection : 'row'}}>
            <View style={{marginRight:10}}>
              <AppText i18nKey='location'></AppText>
              <AppText i18nKey='street'></AppText>
            </View>
            <Icon size={30} name='location-pin'></Icon>
          </View>
         
         
        </View>
        {userInfo ? (
          <LinearGradient style={home.userInfo} colors={['#FF00A9', '#FF3D81']}>
            <View style={{paddingVertical: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={home.userName}>
                  <AppText i18nKey="hi" />, {userInfo.name}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={home.userPoint}>
                  {userInfo.point}{' '}
                  <AppText style={home.userPoint} i18nKey="point_text" />
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Profile')}>
              <Image
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 22,
                 
                }}
                // resizeMode="contain"
                source={{
                  uri: `https://nail2go-server.herokuapp.com/${userInfo.avatar}`,
                }}
              />
            </TouchableOpacity>
          </LinearGradient>
        ) : null}
        <ScrollView
          style={{flex: 1, width: '100%'}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={home.hotServices}>
            <AppText style={home.title} i18nKey="hot_services" />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ServicesScreen')}>
              <Text>
                <AppText style={home.watchMore} i18nKey="watch_more" />
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{width: '100%'}}
            data={services}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => this.renderHotItems(item, index)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
