import React from "react";
import { Image, StyleSheet } from "react-native";

const Logo = () => {
  return (
    <Image
      source={require('../../assets/logo-banner.png')}
      style={styles.logo}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 230,
    height: 80,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Logo;
