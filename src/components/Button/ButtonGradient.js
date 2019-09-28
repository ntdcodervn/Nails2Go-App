import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AppText from "../AppText";
import {sizes, fonts} from '../../constants/theme';
export default class ButtonGradient extends Component {
  render() {
    const {fcolor,scolor,i18nKey} = this.props;
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => this.props.onClick()}
      >
        <LinearGradient
          colors={[fcolor, scolor]}
          style={styles.linearGradient}
        >
          <AppText style={styles.buttonText} i18nKey={i18nKey} />
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 24
  },
  linearGradient: {
    padding: 12,
    borderRadius: 5
  },
  buttonText: {
    fontSize: sizes.h2,
    fontFamily: fonts.black,
    textAlign: "center",
    color: 'white'
  }
});
