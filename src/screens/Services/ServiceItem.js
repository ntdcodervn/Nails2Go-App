import React, {Component} from 'react';
import {Text, View, TouchableHighlight,TouchableOpacity, Image} from 'react-native';

import {AppText} from '../../components';
import {services} from '../../constants/theme';

import {getData} from '../../utils/misc';
import {addCart} from '../../utils/api';
import AsyncStorage from '@react-native-community/async-storage';
export default class ServiceItem extends Component {
  state = {
    itemSelected: false,
    token: '',
    idSlot: '',
    idService: '',
    nameItem : '',
    description : ''
  };

  async componentDidMount() {
    try {
      var token = await getData('token');
      var lang = await AsyncStorage.getItem('@language_key');
      console.log(lang);
      for(let i= 0; i < this.props.item.nameService.length ; i++)
      {
        let element = this.props.item.nameService[i];
       
        if(element.lang == lang && element.value != '')
        {
          console.log(element.value);
          this.setState({
            nameItem : element.value
          })
          break;
        }else {
        
          this.setState({
            nameItem : this.props.item.nameService[0].value
          })
        }
      }

      for(let i= 0; i < this.props.item.description.length ; i++)
      {
        let element = this.props.item.description[i];
        if(element.lang == lang && element.value != '')
        {
          console.log(element.value);
          this.setState({
            description : element.value
          })
          break;
        }else {
         
          this.setState({
            description : this.props.item.description[0].value
          })
        }
      }

      this.setState({token: token});
    } catch (error) {
      console.log(error);
    }
  }

  _addCart = async (token, idService) => {
   
    var url = 'https://nail2go-server.herokuapp.com/api/cart/updateCart';
    
    try {
      var data = await addCart(token, idService, url);
      console.log(data);
      if(data.data.status === 200)
      {
        alert('Add service successful');
      }
      else if(data.data.status === 201)
      {
        alert('This service is already in the cart');
      }
      else {
        alert('Error ! Please try again');
      }
      console.log(data);
      this.props.countServices(token);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {itemSelected} = this.state;
    const {item} = this.props;
    return (
      <TouchableHighlight underlayColor="white" onPress={() => this.props.onClick(item)}>
        <View style={services.listItem}>
          <View
            style={[
              services.column,
              {
                flexDirection: 'row',
                flex: 2,
                marginRight: 20,
              },
            ]}>
            <Image
              style={{
                width: 44,
                height: 44,
                marginRight: 10,
                alignItems: 'center',
                borderRadius: 40,
              }}
              resizeMode="contain"
              source={{uri: item.image[0]}}
            />
            <View style={services.titleBG}>
              <Text style={services.title}>
                {this.state.nameItem.length > 30
                  ? this.state.nameItem.substring(0, 30) + '...'
                  : this.state.nameItem}
              </Text>
              <Text style={services.description}>
                {this.state.description.length > 30
                  ? this.state.description.substring(0, 30) + '...'
                  : this.state.description}
              </Text>
              <Text
                    style={services.description}>
                    Time : {item.timeMake}
                  </Text>
            </View>
          </View>
          <View
            style={[services.column, {justifyContent: 'flex-end', flex: 1}]}>
             
                
                  <Text
                  style={[services.title, {marginBottom: 10, textAlign: 'right'}]}>
                  CHF{item.price}
                </Text>
              
            
            <TouchableOpacity
              onPress={() => this._addCart(this.state.token, item._id)}
              style={[
                services.btnBook,
                // itemSelected ? services.btnBookSelected : null,
              ]}>
              <AppText
                i18nKey="book"
                style={[
                  services.btnBookText,
                  // itemSelected ? services.btnTextSelected : null,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
