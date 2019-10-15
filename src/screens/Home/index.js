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
  StyleSheet
} from 'react-native';
import MapView,{ Marker } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import {BASE_URL_ROUTE, getData} from '../../utils/misc';
import {home} from '../../constants/theme';
import {Header, AppText} from '../../components';
import {getUserInfo, getServices} from '../../utils/api';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IconEn from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-community/async-storage';

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
    
    var servicesLocal = await AsyncStorage.getItem('dataService');
    if(servicesLocal != null && servicesLocal.length != 0)
    {
      this.setState({
        userInfo,
        servicesLocal,
        isLoading: true,
        token: token,
      });
    } 
    else {
      var services = await getServices(token);
      this.setState({
        userInfo,
        services,
        isLoading: true,
        token: token,
      });
      var servicesLocal = await AsyncStorage.setItem('dataService',services);
    }
    
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
            height: 50,
            width: 55,
          
           
          }}
          // resizeMode="contain"
          source={require('../../assets/images/logoNail.jpg')}
          >

          </Image>
          <View style={{flexDirection : 'row'}}>
            <View style={{marginRight:10}}>
              <AppText i18nKey='location' style={{fontSize : 12}}></AppText>
              <AppText i18nKey='street' style={{fontSize : 12}}></AppText>
            </View>
            <Icon size={30} name='location-pin'></Icon>
          </View>
         
         
        </View>
        {userInfo ? (
          <LinearGradient style={home.userInfo} colors={['#ED152C', '#f44336']}>
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
         
          <View style={{flexDirection:'row', marginLeft: 30, marginBottom : 20, marginTop:20}}>
                  <IconEn color={'#54414A'} name='location' size={25}></IconEn>
                  <AppText style={{fontSize : 17, marginLeft : 5, fontWeight:'bold',color:'#54414A'}} i18nKey='our_location'></AppText>
                 
               </View>
             <View style={{width: '100%', justifyContent:'center',alignItems:'center', marginBottom: 20}} >
               
              <View style={{width : '90%', borderRadius : 20, overflow : 'hidden'}}>
                <MapView
                style={styles.map}
                region={{
                  latitude: 47.3743563,
                  longitude: 8.5301422,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: 47.3743563,
                  longitude: 8.5301422,
                  }}
                  title={'MyNails2Go'}
                  description={'tel : +41 76 463 37 38'}
                  
                  
                  
                >
                    <Image source={require('../../assets/images/locationNail.png')} style={{width:58,height:85}} ></Image>
                  </Marker>
              </MapView>
            </View>
             </View>

        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  
  map: {
    width : '100%',
    height : 300,
    
   
  },
});
