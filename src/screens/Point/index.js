import React, { Component } from 'react'
import { Text, StyleSheet, View , SafeAreaView,FlatList,Image,TouchableOpacity } from 'react-native'
import {BASE_URL_ROUTE, getData} from '../../utils/misc';
import {Header, AppText} from '../../components';
import {icons} from '../../utils/images';
import { schedule } from "../../constants/theme";
import LinearGradient from 'react-native-linear-gradient';
import io from 'socket.io-client';
const socket = io(BASE_URL_ROUTE);

import axios from 'axios'
export default class index extends Component {
    static navigationOptions = {
        header: null,
      };

    state =  {
        point : 0,
        coupons : 0,
        id: ''
    }
    componentDidMount = async () => {
        const token = await getData('token');
        
         this.getUserInfo(token);
         socket.on('changePointUser', (data) => {

            if(this.state.id == data._id){
                this.setState({
                    point: data.point,
                    coupons: data.coupons,
                });
            }
          })
        
    }

   
    
    render() {
        return (
            <SafeAreaView style={{flex: 1, }}>
                <Header i18nKey="awards_nav" style={{paddingHorizontal: 24}}/>
               
                   
                    <FlatList
                    data={[1,2,3,4,5,6,7,8]}
                    renderItem={({ item }) => 
                                {
                                    if(this.state.coupons != 0)
                                    {
                                        if(item == 8)
                                        {
                                            return (<TouchableOpacity style={{...schedule.container, marginTop : 10}}>
                                                <LinearGradient colors={['#ED152C', '#f44336']} style={schedule.containerInner} >
                                                    <Text style={{...schedule.slotNum, marginTop : 12}}>
                                                        Coupons 30%
                                                    </Text>
                                                    <Text style={{...schedule.time,marginBottom : 20}}>for next time</Text>
                                                    
                                                   
                                                </LinearGradient>
                                            </TouchableOpacity>)
                                        }else {
                                            return (<View style={{ justifyContent: 'center',
                                            flex : 1,
                                            alignItems: 'center',
                                            padding: 10,
                                            marginTop :15,
                                            borderRadius: 8,}}><Image source={icons.nail_icon_a} style={{width : 120,height:120}}></Image></View>)
                                        }
                                    }
                                    else {
                                        if(item == 8 && this.state.coupons == 0)
                                        {
                                            return (<TouchableOpacity style={schedule.container}>
                                                <LinearGradient colors={['#bca5af', '#bca5af']} style={schedule.containerInner} >
                                                    <Text style={{...schedule.slotNum, marginTop : 12}}>
                                                        Coupons 30%
                                                    </Text>
                                                    <Text style={{...schedule.time,marginBottom : 20}}>for next time</Text>
                                                    
                                                   
                                                </LinearGradient>
                                            </TouchableOpacity>)
                                        }
                                        if(item <= this.state.point)
                                        {
                                            return (<View style={{ justifyContent: 'center',
                                            flex : 1,
                                            alignItems: 'center',
                                            padding: 10,
                                            marginTop :15,
                                            borderRadius: 8,}}><Image source={icons.nail_icon_a} style={{width : 120,height:120}}></Image></View>)
                                        }
                                        else {
                                            return (<View style={{ justifyContent: 'center',
                                            flex : 1,
                                            alignItems: 'center',
                                            padding: 10,
                                            marginTop :15,
                                            borderRadius: 8,}}><Image source={icons.nail_icon} style={{width : 120,height:120}}></Image></View>)
                                        }
                                    }
                                    
                                }
                    }
                    numColumns={2}
                    />
                    
                
            </SafeAreaView>
        )
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
            point : data.data.point,
            coupons : data.data.coupons,
            id : data.data._id
          });
          
          console.log(this.state.point);
        } catch (error) {
          console.log(error);
        }
      };
}

const styles = StyleSheet.create({})
