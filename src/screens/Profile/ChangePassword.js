import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity,TextInput } from 'react-native'
import { AppText} from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {BASE_URL_ROUTE} from './../../utils/misc'
export default class ChangePassword extends Component {
  state = {
      current_password : '',
      new_password : '',
      confirm_password : ''
  }

  _submitPassword = async () => {
    let token = await AsyncStorage.getItem('token');
                 
                console.log(this.state.new_password,this.state.current_password)
    if(this.state.new_password === this.state.confirm_password)
    {
        const changePassword = await axios.post(`${BASE_URL_ROUTE}api/users/changePassword`,{
            
                newPassword : this.state.new_password,
                currentPassword : this.state.current_password
            
        },{
            headers : {
                "x-auth-token" : token
            }
        });
       
        if(changePassword.status === 200)
        {
           
            alert('Change password successfull');
        }else if(changePassword.status === 202) {
            alert('Wrong password, please check again');
        }
        else if(changePassword.data.status === 204)
        {
          alert(changePassword.data.errors[0].msg);
        }
        else {
            alert('Change password falied, please try again')
        }
    }
    else {
        alert('Confirm password must be correct');
    }
  }

  render() {
    return (
      <View style={{flex : 1,justifyContent : 'flex-start',marginTop : 20,alignItems : 'center'}}>
        <AppText style={{color : '#54414A',fontSize:24}}  i18nKey="change_password"> </AppText>
        <View style={{width : '80%',marginTop : 30,justifyContent:'center',alignItems:'flex-start'}}>
        <AppText style={{color : '#54414A',fontWeight:'400'}}  i18nKey="current_password"> </AppText>
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
              current_password : e
            })}}
            secureTextEntry={true}
            
        ></TextInput>

        <AppText style={{color : '#54414A',fontWeight:'400'}}  i18nKey="new_password"> </AppText>
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
              new_password : e
            })}}
            secureTextEntry={true}
        ></TextInput>

        <AppText style={{color : '#54414A',fontWeight:'400'}} i18nKey="confirm_password"> </AppText>
        <TextInput
          secureTextEntry={true}
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
              confirm_password : e
            })}}
        ></TextInput>
        </View>
        <TouchableOpacity
        onPress={() => {this._submitPassword()}}
          style={{width : '80%', height :50,backgroundColor : '#FF00A9',borderRadius:5,justifyContent : 'center',alignItems : 'center'}}
        >
          <AppText style={{color : '#FFF',fontWeight : 'bold',fontSize : 25}}  i18nKey="change_password"> </AppText>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
