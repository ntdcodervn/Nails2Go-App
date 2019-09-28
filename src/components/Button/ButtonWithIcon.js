import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import AppText from "../AppText";
import {sizes, fonts, colors} from '../../constants/theme';
export default class ButtonWithIcon extends Component {
  render() {
    const { icon, i18nKey } = this.props;
    return (
      <TouchableOpacity onPress={() => this.props.onClick()} >
        <View style={[styles.btnLayout,this.props.buttonStyle]}>
          <Image source={icon} style={styles.icon} resizeMode='contain'/>
          <AppText style={styles.title} i18nKey={i18nKey} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btnLayout: {
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5
  },
  icon: {
    marginRight: 10,
    height: 26
  },
  title: {
    fontSize: sizes.h3,
    fontFamily: fonts.black,
    textAlign: "center",
    color: colors.heading
  }
});
