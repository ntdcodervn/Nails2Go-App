import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity,TextInput } from 'react-native'
import { AppText} from '../../components';
import axios from 'axios';
import {BASE_URL_ROUTE} from './../../utils/misc'
export default class SendNewPass extends Component {
  state = {
    email : ''
  }

  _sendNewEmail= async () => {
    try {
      if(this.state.email !== ''){
      const sendNewPass = await axios.get(`${BASE_URL_ROUTE}api/users/getNewPassword?email=${this.state.email}`);
      if(sendNewPass.status === 200)
      {
          alert('Sent new password successfull, please check your mail !');
          
      }
      else if(sendNewPass.status === 201)
      {
          alert('Email not found, please try agian !');
      }
      else if(sendNewPass.status === 202)
      {
          alert('Send new password failed,  please try agian !');
      }
      else if(sendNewPass.status === 205)
      {
          alert('Email invalidate !');
      }
      else {
          alert('An error occurred, please try again');
      }
      }
      else {
          alert('Email is not empty !');
      }
  } catch (error) {
      console.log(error);
      alert('An error occurred, please try again');
  }
  }

  render() {
    return (
      <View style={{flex : 1,justifyContent : 'flex-start',marginTop : 20,alignItems : 'center'}}>
        <AppText style={{color : '#54414A',fontSize:24}}  i18nKey="send_pass"> </AppText>
        <View style={{width : '80%',marginTop : 30,justifyContent:'center',alignItems:'flex-start'}}>
        
        <AppText style={{color : '#54414A',fontWeight:'400'}} i18nKey="email"> </AppText>
        <TextInput
         
          style={{
            width : '100%',
            height :50,
            borderRadius:5,
            justifyContent : 'center',
            borderBottomColor : 'gray',
            borderBottomWidth:2,
            marginTop:5,
            marginBottom:20}}
            onChangeText= {(e) => {this.setState({
              email : e
            })}}
        ></TextInput>
        </View>
        <TouchableOpacity
        onPress={() => {this._sendNewEmail()}}
          style={{width : '80%', height :50,backgroundColor : '#FF00A9',borderRadius:5,justifyContent : 'center',alignItems : 'center'}}
        >
          <AppText style={{color : '#FFF',fontWeight : 'bold',fontSize : 25}}  i18nKey="send_pass"> </AppText>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
