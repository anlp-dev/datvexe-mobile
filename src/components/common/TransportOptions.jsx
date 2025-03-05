import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {CarType} from "../../enums/EnumsType";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const transportOptions = [
  { id: 1, title: "Xe khách", icon: "🚌" },
  { id: 2, title: "Xe sân bay", icon: "🚐" },
  { id: 3, title: "Hàng hoá", icon: "📦" },
  { id: 4, title: "Đặt xe", icon: "🚗" },
];

const TransportOptions = () => {
  const navigation = useNavigation();
  
  const handleOpenLocationChoide = (e) => {
    if(CarType.XE_KHACH === e){
      navigation.navigate("LocationScreen")
    }else{
      Alert.alert("Mục này đang trong quá trình phát triển, vui lòng quay lại sau !!!")
    }
  };

  return (
    <>
      {transportOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.transportOption}
          onPress={(e) => handleOpenLocationChoide(option.id)}
        >
          <Text style={styles.transportIcon}>{option.icon}</Text>
          <Text style={styles.transportText}>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  transportOption: {
    alignItems: "center",
    borderRadius: 12,
    elevation: 3,
    padding: 10,
  },
  transportIcon: {
    fontSize: 32,
    color: "#fff",
  },
  transportText: {
    fontSize: 14,
    color: "black",
    marginTop: 8,
  },
});

export default TransportOptions;
