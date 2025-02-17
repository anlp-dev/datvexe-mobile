import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Thêm import này từ expo-linear-gradient
import RoleType from "../enums/RoleType";
import {MESSAGE, SUCCESS, FAIL, ERROR} from "../enums/Message";
import authService from "../service/AuthService";
import {Button} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {showCustomToast} from "../components/common/notifice/CustomToast";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const buttonScale = new Animated.Value(1); // For scaling animation

  const handleLogin = async () => {
    try{
      setIsLoading(true);
      const data = {username, password};
      const res_data= await authService.login(data);
      if(res_data.status === 200){
        const userData = await authService.getUser();
        const roleUser = userData?.data.roleId;
        if(roleUser.code === RoleType.KHACH_HANG){
          showCustomToast("Đăng nhập thành công !!!", "success")
          navigation.replace("MainTabs");
        }else if(roleUser.code === RoleType.LAI_XE){
          showCustomToast("Đăng nhập thành công !!!", "success")
          navigation.replace("DriverHomeScreen");
        }else{
          showCustomToast(FAIL.LOGIN_FAIL, "error");
        }
      }else{
        showCustomToast(FAIL.LOGIN_FAIL, 'error');
      }
    }catch (e) {
      showCustomToast(e.message, 'error')
    }finally {
      setIsLoading(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.98,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={["#FFFAF0", "#FFD700", "#FF8C00", "#FFA07A", "#FFFFFF"]}
      style={styles.container}
    >
      {/* Logo */}
      <Image
        source={require("../assets/logo-banner.png")}
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      {/* Login Button */}
      <Animated.View
        style={[styles.button, { transform: [{ scale: buttonScale }] }]}
      >
        <Button
          style={styles.buttonTouchable}
          onPress={handleLogin}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          loading={isLoading}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </Button>
      </Animated.View>

      {/* Footer Links */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Chưa có tài khoản ? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.footerLink}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    width: 270,
    height: 90,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#FF4C4C",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    marginBottom: 18,
    shadowColor: "#FF4C4C",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 60,
    backgroundColor: "#FF4C4C",
    borderRadius: 25, // Bo tròn góc mạnh hơn
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#FF4C4C",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  buttonTouchable: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  buttonText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  footer: {
    flexDirection: "row",
    marginTop: 35,
  },
  footerText: {
    fontSize: 16,
    color: "#777",
  },
  footerLink: {
    fontSize: 16,
    color: "#FF4C4C",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 5,
    opacity: 0.8,
  },
});
