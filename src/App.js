import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {YellowBox} from 'react-native';
import AppContainer from './navigations';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import appReducers from './redux/reducers';
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
export const store = createStore(appReducers);

export default class App extends Component {
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    firebase.notifications().onNotification(notification => {
      notification.android.setChannelId('members').setSound('default');
      firebase.notifications().displayNotification(notification);
    });
  }

  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      'members',
      'all',
      firebase.notifications.Android.Importance.Max,
    );
    firebase.messaging().subscribeToTopic('all');
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createNotificationListeners();
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
