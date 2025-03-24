import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Import icon chuyên nghiệp

const TransportOptions = () => {
  const navigation = useNavigation();

  const handleStartTrip = () => {
    navigation.navigate("LocationScreen");
  };

  return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleStartTrip} style={styles.button}>
          <LinearGradient
              colors={["#FFA07A", "#FF6347"]} // Gradient từ tone cam đào sang đỏ
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
          >
            <Ionicons name="car-outline" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.text}>Bắt đầu với chuyến đi của bạn</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 13,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default TransportOptions;
