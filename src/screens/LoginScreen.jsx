import React, {useEffect, useState, useRef} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import {ROLE_TYPE} from "../enums/EnumsType";
import {MESSAGE, SUCCESS, FAIL, ERROR} from "../enums/Message";
import authService from "../service/AuthService";
import {Button} from 'react-native-paper';
import {showCustomToast} from "../components/common/notifice/CustomToast";
import LoadingHelper from "../components/common/loading/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check for existing token
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const currentTime = Math.floor(Date.now() / 1000);
          if(jwtDecode(token).exp > currentTime) {
            await AsyncStorage.removeItem("token");
            navigation.replace("MainTabs");
          }
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };
    checkToken();
  }, [navigation]);

  const validateInputs = () => {
    let isValid = true;
    
    if (!username.trim()) {
      setUsernameError("Vui lòng nhập tên đăng nhập");
      isValid = false;
    } else {
      setUsernameError("");
    }
    
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    
    try{
      setIsLoading(true);
      const data = {username, password};
      const res_data= await authService.login(data);
      if(res_data.status === 200){
        const userData = await authService.getUser();
        const roleUser = userData?.data.roleId;
        if(roleUser.code === ROLE_TYPE.KHACH_HANG){
          showCustomToast("Đăng nhập thành công !!!", "success")
          navigation.replace("MainTabs");
        }else if(roleUser.code === ROLE_TYPE.LAI_XE){
          showCustomToast("Đăng nhập thành công !!!", "success")
          navigation.replace("DriverHomeScreen");
        }else if(roleUser.code === ROLE_TYPE.NHAN_VIEN){
          showCustomToast("Đăng nhập thành công !!!", "success")
        }
        else{
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
      toValue: 0.95,
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#FFFAF0", "#FFD700", "#FF8C00", "#FFA07A", "#FFFFFF"]}
        style={styles.background}
      >
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Logo */}
          <Image
            source={require("../assets/logo-banner.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.welcomeText}>Chào mừng trở lại!</Text>
          <Text style={styles.subtitleText}>Đăng nhập để tiếp tục</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={22} color="#FF4C4C" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (usernameError) setUsernameError("");
              }}
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
          </View>
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={22} color="#FF4C4C" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError("");
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={22} 
                color="#777" 
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Animated.View
            style={[
              styles.buttonContainer, 
              { transform: [{ scale: buttonScale }] }
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#FF4C4C", "#FF4C4C"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <Text style={styles.orText}>Hoặc đăng nhập với</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                <FontAwesome name="google" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <FontAwesome name="facebook" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Links */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
              <Text style={styles.footerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </LinearGradient>
      <LoadingHelper visible={isLoading} colors={['#ffffff', '#f5f5f5', '#e0e0e0']}/>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  formContainer: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: width * 0.6,
    height: 70,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    borderColor: "#FF4C4C",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
    marginLeft: 5,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 25,
    marginTop: 5,
  },
  forgotPasswordText: {
    color: "#FF4C4C",
    fontSize: 14,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 25,
  },
  button: {
    width: "100%",
    height: 55,
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  socialContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  orText: {
    color: "#777",
    fontSize: 14,
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: "#DB4437",
  },
  facebookButton: {
    backgroundColor: "#4267B2",
  },
  footer: {
    flexDirection: "row",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#777",
  },
  footerLink: {
    fontSize: 14,
    color: "#FF4C4C",
    fontWeight: "bold",
  },
});
