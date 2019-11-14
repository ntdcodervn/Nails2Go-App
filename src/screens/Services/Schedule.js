import React, { Component } from 'react';
import { TouchableOpacity, Text, FlatList, View, Alert, Dimensions,SafeAreaView } from 'react-native';
import { schedule } from "../../constants/theme";
import { Header } from "../../components";
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import io from 'socket.io-client';
import {BASE_URL_ROUTE} from './../../utils/misc'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import { getServicesInCart } from "../../utils/api";
import ButtonGradient from './../../components/Button/ButtonGradient'
import DateTimePicker from "react-native-modal-datetime-picker";

const socket = io(BASE_URL_ROUTE);
export default class Schedule extends Component {
    static navigationOptions = {
        header: null
    };

    componentDidMount = async () => {
        let total = await axios.get(`${BASE_URL_ROUTE}api/booking/getTotalSlots`);
        console.log(total.data.total);
        this.setState({
            totalS : total.data.total
        })
        console.log(this.state.GridViewItems);
        socket.on('changeSlotRealTime',(data)=> {
            this.setState({
                GridViewItems : data.map((value,index) => {
                    console.log('Hello')
                    let d = new Date(value.date);
                    let dateNew = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
                    if(dateNew === this.state.date)
                    {
                        let item = {
                            key : index,
                            begin :`${value.slotName}:00`,
                            end : this._cutTime(value.slotName),
                            status : this._status(value.total),
                            id : value._id
                        };
                        return item;
                    }
                   
                    
                })
            })
        })

       
        
    }

    constructor() {
        super();
        this.state = {
            GridViewItems: [
               
            ],
            progress: 1,
            isDateTimePickerVisible: false,
            date : '',
            dateShow : '',
            totalS : 2
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
      };
    
      hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
      };
    
      handleDatePicked = date => {
        let d = new Date(date);
        console.log(date);
        let dateNew = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
         this.setState({
            date : dateNew,
            dateShow : d
        })
        this._getListDataSlot(dateNew);
        console.log("A date has been picked: ", d);
     
        
       
        this.hideDateTimePicker();
      };

      _getListDataSlot = async (data) => {
        let token = await AsyncStorage.getItem('token');
        let getAllSlot = await axios.get(`${BASE_URL_ROUTE}api/slot/getAllSlotByDate?date=${data}`, {
            headers : {
                "x-auth-token" : token
            },
        })
        this.setState({
            GridViewItems : getAllSlot.data.data.map((value,index) => {
                let item = {
                    key : index,
                    begin : `${value.slotName}:00`,
                    end : this._cutTime(value.slotName),
                    status : this._status(value.total),
                    id : value._id
                };
                return item;
                
            }),
        })
      }

    _cutTime(time) {
        
        let TimeEndTotal = (time+1) +  ':00';
        return TimeEndTotal;
    }

    _changeNumber(time) {
        let timeEnd = time.substring(0,time.indexOf(':'));
        
        return Number(timeEnd);
    }

     bubble_Sort(a)
    {
        console.log(a);
        var swapp;
        var n = a.length-1;
        var x=a;
        do {
            swapp = false;
            for (var i=0; i < n; i++)
            {
                if (x[i].slotName > x[i+1].slotName)
                {
                var temp = x[i];
                x[i] = x[i+1];
                x[i+1] = temp;
                swapp = true;
                }
            }
            n--;
        } while (swapp);
    return x; 
    }

     _status(statuss) {
        console.log(statuss + '/' + this.state.totalS);
       
       
        let per = (statuss/this.state.totalS);
        return per;
    }

    

    GetGridViewItem(item,slot) {
        // Alert.alert(item.begin, item.end);
        if (item.status == 1) {
            Alert.alert('Slot is full!');
        } else {
            Alert.alert(
                'Confirm',
                `Are you sure you want to book service at ${slot} o'clock`,
                [
                    {
                        text: 'OK',
                        onPress: () => {this._booking(item.id)}

                    },
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
                ],
                { cancelable: false },
            );
        }
    }

    _booking = async (id) => {
        console.log(id)
        let token = await AsyncStorage.getItem('token');
        let getCart = await getServicesInCart(token);
        let idServices = await getCart.map((value) => {
            return value._id;
        })
        console.log(getCart);
        if(getCart === null || getCart.length === 0)
        {
            alert("You have not choise the service");
        }
        else {
           
        let booking =  await axios({
            url: `${BASE_URL_ROUTE}api/booking/booking`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token,
            },
            data: {
              idService: idServices,
              idSlot : id
            },
          });
          if(booking.data.status === 200)
          {
              alert(booking.data.msg);
             
              this.props.navigation.navigate('ServicesScreen');
          }
          else {
            alert(booking.data.msg);
          }
          console.log(booking);
        }
       
    }

    goBack = () => {
        this.props.navigation.goBack();
    };

    _renderDate = () => {
        console.log(this.state.dateShow);
        if(this.state.dateShow === '' || !this.state.dateShow)
        {
            return( <View style={{marginTop : 20, marginBottom : 20}}>
                <Text style={{textAlign : 'center'}}>Please choose date</Text>
            </View>)
        }
        else{
            return( <View style={{flex : 1,flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop : 20, marginBottom : 20}}>
                <Icon name="calendar" style={{color : '#54414A',marginRight:10}} size={20}></Icon><Text style={{textAlign : 'center'}}>{moment(this.state.dateShow).format('MMMM Do YYYY')}</Text>
                
            </View>)
        }
    }
    
   

    render() {
        const barWidth = Dimensions.get('screen').width / 2 - 30;
        const titleHeader = this.props.navigation.getParam("titleHeader");
        return (
            <SafeAreaView style={{flex: 1}}>
                <Header
                    i18nKey={titleHeader}
                    rightMenu={true}
                    backScreen={true}
                    whiteText={false}
                    searchIcon={false}
                    cartIcon={false}
                    middleTitle={true}
                    headerStyle={{ paddingHorizontal: 24 }}
                    onClick={this.goBack}
                    style={{ textAlign: "center" }}
                />
               
               <ButtonGradient
              fcolor={"#ED152C"} 
              scolor={"#f44336"}
              onClick={() => this.showDateTimePicker()}
              i18nKey="choose_date"
            />
                  
                    {this. _renderDate()}

                 <FlatList
                    data={this.state.GridViewItems}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={this.GetGridViewItem.bind(this, item,item.begin)} style={schedule.container}>
                            <LinearGradient colors={['#ED152C', '#f44336']} style={schedule.containerInner} >
                                <Text style={schedule.slotNum}>
                                    Time
                                </Text>
                                <Text style={schedule.time}>{item.begin} - {item.end}</Text>
                                
                                <Progress.Bar borderColor='#FFFFFF'  progress={item.status} width={barWidth} />
                            </LinearGradient>
                        </TouchableOpacity>
                    }
                    numColumns={2}
                    />

                <DateTimePicker
                        minimumDate={new Date()}
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                />
                
               
                

            </SafeAreaView>
        );
    }
}