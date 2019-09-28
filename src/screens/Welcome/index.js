import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import theme from "../../constants/theme";
import { ButtonGradient, AppText } from "../../components";
export default class WelcomeScreen extends Component {
  static navigationOptions = {
    header: null
  };

  //Go to Login Screen
  goLogin = () => {
    this.props.navigation.navigate("LoginScreen");
  };

  render() {
    return (
      <View style={theme.welcome.container}>
        <Image
          source={require("../../assets/images/bg.png")}
          style={{ maxHeight: 281 }}
          resizeMode={"contain"}
        />
        <AppText style={theme.welcome.welcomText} i18nKey="greeting_text" />
        <AppText style={theme.welcome.firstText} i18nKey="greeting_content" />
        <ButtonGradient
          i18nKey="greeting_btn"
          fcolor="#FF00A9"
          scolor="#FF3D81"
          onClick={this.goLogin}
        />
      </View>
    );
  }
}
