import React, { Component } from "react";
import { Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import { cart } from "../../constants/theme";
import { ServicesData } from "../../constants/sampleData";
import { Header,AppText } from "../../components";

export default class CartScreen extends Component {
  static navigationOptions = {
    header: null
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  renderCartItems(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("ServicesDetails", { item: item })
        }
      >
        <View style={cart.cartItem}>
          <Image style={cart.image} source={{ uri: item.images[0] }} />
          <Text style={cart.itemTitle}>{item.title}</Text>
          <Text style={cart.price}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          i18nKey="cart"
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
        <AppText style={cart.title} i18nKey="services_in_cart"> Services in Cart </AppText>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={ServicesData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderCartItems(item)}
        />
        <View
          style={cart.amountContainer}
        >
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
              $2500
            </Text>
            <Text style={[cart.summarytext, { textAlign: "right" }]}>$10</Text>
            <Text style={[cart.summarytext, { textAlign: "right",paddingBottom: 0 }]}>
              $2510
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
