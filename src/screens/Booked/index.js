import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import {Header, AppText, ButtonGradient} from '../../components';
import axios from 'axios';
import {booked} from '../../constants/theme';
import {getData} from '../../utils/misc';
import moment from 'moment';
import {BASE_URL_ROUTE} from './../../utils/misc'
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
const socket = io(BASE_URL_ROUTE);

export default class BookedScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    bookingList: null,
    slot: 0,
    time: 0,
  };
  goDetails = item => {
    this.props.navigation.navigate('BookedDetails', {
      booking: false,
      titleHeader: 'details',
    });
  };

  async componentDidMount() {
    const token = await getData('token');
    this.getBooked(token, 0);
    socket.on('getBookedRealTime', (data) => {
      this.setState({
        bookingList: data.reverse(),
        isLoading: true,
      });
    })
  }

  getBooked = async (token, page) => {
    try {
      var dataz = await axios({
        url: `${BASE_URL_ROUTE}api/booking/getBooked?page=${page}`,
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      console.log(dataz.data);
      this.setState({
        bookingList: dataz.data.booked.reverse(),
        isLoading: true,
      });
      console.log(dataz.data.booked);
    } catch (error) {
      console.log(error);
    }
  };

  renderItem(item) {
    return (
      <View style={booked.itemContainer}>
        <View style={booked.datetimeContainers}>
          <Text style={booked.date}>{moment(item.date).format('MMMM Do YYYY')}</Text>
          <Text style={booked.time}>Slot {item.slots.slotName}:00</Text>
        </View>
        
       
          {this._renderStatus(item.status,item._id)}
           
     
        
      </View>
    );
  }

  _renderStatus = (status,id) => {
      if(status == 0){
        return (
          <TouchableOpacity 
          style={{backgroundColor: '#f44336', padding : 10, borderRadius : 10}} 
          onPress={ () => {this._cancelBooked(id)}}>
              <Text style={{color: '#FFF'}}>Cancel</Text>
          </TouchableOpacity>
        )
      }else if(status == 1)
      {
        return (
          <Text>Paid</Text>
        )
      }else {
        return (
          <Text>Canceled</Text>
        )
      }
  }
  
  _cancelBooked = (idBooking) => {
    console.log(idBooking);
    Alert.alert(
      'Cancel',
      `Are you sure you want to cancel this booking`,
      [
          {
              text: 'Yes',
              onPress: async () => {
                let token = await AsyncStorage.getItem('token');
                let check = await axios({
                  url: `${BASE_URL_ROUTE}api/admin/changeStatusBooking`,
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                  },
                  data: {
                    idBooking : idBooking ,
                    status : -1
                  },
                });
                console.log(check)
                if(check.data.status === 200)
                {
                  const token = await getData('token');
                  this.getBooked(token, 0);
                  alert("Cancel this book successful !");
                }
              }

          },
          { text: 'No', onPress: () => console.log('Cancel Pressed') },
      ],
      { cancelable: false },
  );
  }
  render() {
    const {bookingData} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        {bookingData ? (
          <View style={booked.header}>
            <Header
              i18nKey="booked_nav"
              style={{color: '#fff', paddingLeft: 24}}
            />
            <View style={booked.notification}>
              <View style={booked.datetime}>
                <Text style={booked.notifyTime}>10:00 - 12:00</Text>
                <Text style={booked.notifyDate}>Tuesday, August 20, 2019</Text>
              </View>
              <Text style={booked.bookingText}>Booking</Text>
            </View>
          </View>
        ) : (
          <Header i18nKey="booked_nav" style={{paddingLeft: 24}} />
        )}
        <View style={booked.container}>
          <AppText style={booked.title} i18nKey="history"></AppText>
          
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.bookingList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => this.renderItem(item)}
          />
        </View>
      </SafeAreaView>
    );
  }
}
