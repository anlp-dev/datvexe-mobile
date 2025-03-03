import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foodgo</Text>
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/hamburger.png")} style={styles.image1} />
        <Image source={require("../../assets/pizza.png")} style={styles.image2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EADCF5", // Màu tím nhạt
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "400",
    color: "#fff",
    position: "absolute",
    top: "20%",
    fontFamily: "Lobster",
  },
  imageContainer: {
    position: "absolute",
    bottom: -50,
    flexDirection: "row",
    gap: 10,
  },
  image1: {
    width: 248,
    height: 288,
    marginLeft: -40,
  },
  image2: {
    width: 291,
    height: 237,
    zIndex: 12000,
    marginLeft: -85,
    
    
    
  },
});

export default Welcome;
