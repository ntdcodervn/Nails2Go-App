import React, { Component } from "react";
import { Text, View, FlatList,SafeAreaView } from "react-native";
import axios from "axios";
import { cart, colors, fonts, sizes } from "../../constants/theme";
import {  getData } from "../../utils/misc";
import { Header, ButtonGradient,AppText } from "../../components";

import { getServicesInCart, addCart } from "../../utils/api";
export default class CartScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    cartList: [],
    cartPrices: [],
    slot: 0,
    amountPrice: 0,
    tipPrice: 0,
    totalPrice: 0,
    token: ""
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  async componentDidMount() {
    const token = await getData("token");
    this.setState({ token });
    this._fetchCart(token);
  }
  _fetchCart = async token => {
    try {
      var servicesInCart = await getServicesInCart(token);
      var amountPrice = servicesInCart.reduce((price, sevice) => {
        return (price += sevice.price);
      }, 0);
      var tipPrice = 10;
      var totalPrice = amountPrice + tipPrice;
      this.setState({
        cartList: servicesInCart,
        cartPrices: servicesInCart,
        amountPrice,
        tipPrice,
        totalPrice
      });
    } catch (error) {}
  };
  goSchedule = () => {
    this.props.navigation.navigate("ScheduleScreen", {
      cartList: this.state.cartList,
      titleHeader: "choose_slot"
    });
  };
  _removeItem = async id => {
    try {
      var url =
        "https://nail2go-server.herokuapp.com/api/cart/deleteProductInCart";
      var removeItem = await addCart(this.state.token, id, url);
      this._fetchCart(this.state.token);
    } catch (error) {}
  };
  renderCartItems(item) {
    return (
      <View style={cart.cartItem}>
        <Text style={cart.itemTitle}>{item.nameService[0].value}</Text>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Text style={cart.price}>${item.price}</Text>
          <Text
            style={{
              paddingHorizontal: 15,
              paddingVertical: 3,
              marginLeft: 15,
              borderRadius: 5,
              backgroundColor: "red",
              color: "#fff",
              fontFamily: fonts.regular,
              fontSize: sizes.h4
            }}
            onPress={() => this._removeItem(item._id)}
          >
            x
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { booking, titleHeader } = this.props.navigation.state.params;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          i18nKey={titleHeader}
          rightMenu={true}
          backScreen={true}
          whiteText={false}
          searchIcon={false}
          cartIcon={false}
          middleTitle={true}
          numOfServices={true}
          headerStyle={{ paddingHorizontal: 24 }}
          onClick={this.goBack}
          style={{ textAlign: "center" }}
        />
         <AppText style={cart.title} i18nKey="services_in_cart"> </AppText>
        {this.state.cartList.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.cartList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
              this.renderCartItems(item, this.state.cartPrices[index])
            }
          />
        ) : (
         
          <AppText style={{ marginHorizontal: 24 }} i18nKey="cart_is_empty">Amount</AppText>
        )}

        <View style={cart.amountContainer}>
          {this.state.cartList.length > 0 || !booking ? (
            <View style={cart.amountChild}>
              <View style={{ flex: 1 }}>
                <AppText style={cart.summarytext} i18nKey="amount">Amount</AppText>
                <AppText style={cart.summarytext} i18nKey="tip">Tip</AppText>
                <AppText style={cart.summarytext} i18nKey="total">Total</AppText>
              </View>
              <View
                style={{
                  flex: 1,
                  alignContent: "flex-end",
                  alignItems: "flex-end",
                  right: 0
                }}
              >
                <Text style={[cart.summarytext, { textAlign: "right" }]}>
                  ${this.state.amountPrice}
                </Text>
                <Text style={[cart.summarytext, { textAlign: "right" }]}>
                  ${this.state.tipPrice}
                </Text>
                <Text
                  style={[
                    cart.summarytext,
                    { textAlign: "right", paddingBottom: 0 }
                  ]}
                >
                  ${this.state.totalPrice}
                </Text>
              </View>
            </View>
          ) : null}
          {booking && this.state.cartList.length > 0 ? (
            <ButtonGradient
              fcolor={"#FF00A9"}
              scolor={"#FF3D81"}
              onClick={this.goSchedule}
              i18nKey="book"
            />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}
