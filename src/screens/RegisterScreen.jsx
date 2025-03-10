import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Animated,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { MESSAGE, SUCCESS, FAIL, ERROR } from "../enums/Message";
import authService from "../service/AuthService";
import { showCustomToast } from "../components/common/notifice/CustomToast";
import LoadingHelper from "../components/common/loading/LoadingScreen";

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Validation states
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [fullnameError, setFullnameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [termsError, setTermsError] = useState("");

    // Animation values
    const buttonScale = useRef(new Animated.Value(1)).current;

    const validateInputs = () => {
        let isValid = true;
        
        if (!username.trim()) {
            setUsernameError("Vui lòng nhập tên đăng nhập");
            isValid = false;
        } else if (username.length < 4) {
            setUsernameError("Tên đăng nhập phải có ít nhất 4 ký tự");
            isValid = false;
        } else {
            setUsernameError("");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError("Vui lòng nhập email");
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Email không hợp lệ");
            isValid = false;
        } else {
            setEmailError("");
        }
        
        if (!fullname.trim()) {
            setFullnameError("Vui lòng nhập họ tên");
            isValid = false;
        } else {
            setFullnameError("");
        }
        
        if (!phone.trim()) {
            setPhoneError("Vui lòng nhập số điện thoại");
            isValid = false;
        } else if (!/^\d{10}$/.test(phone)) {
            setPhoneError("Số điện thoại phải có 10 chữ số");
            isValid = false;
        } else {
            setPhoneError("");
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
        
        if (!confirmPassword) {
            setConfirmPasswordError("Vui lòng xác nhận mật khẩu");
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Mật khẩu xác nhận không khớp");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }
        
        if (!agreeToTerms) {
            setTermsError("Bạn phải đồng ý với điều khoản dịch vụ");
            isValid = false;
        } else {
            setTermsError("");
        }
        
        return isValid;
    };

    const handleRegister = async () => {
        if (!validateInputs()) return;
        
        try {
            setIsLoading(true);
            let userReq = {
                username: username,
                password: password,
                email: email,
                fullname: fullname,
                phone: phone
            }

            const resData = await authService.register(userReq);
            if (resData && resData.status === 200) {
                showCustomToast("Đăng ký thành công!", "success");
                navigation.replace("Login");
            } else {
                showCustomToast("Đăng ký thất bại. Vui lòng thử lại!", "error");
            }
        } catch (e) {
            showCustomToast(e.message, "error");
        } finally {
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

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const toggleAgreeToTerms = () => {
        setAgreeToTerms(!agreeToTerms);
        if (termsError) setTermsError("");
    };

    const openTermsAndConditions = () => {
        // Implement navigation to Terms and Conditions screen
        showCustomToast("Chức năng đang phát triển", "info");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={["#FFFAF0", "#FFD700", "#FF8C00", "#FFA07A", "#FFFFFF"]}
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        {/* Logo */}
                        <Image source={require("../assets/logo-banner.png")} style={styles.logo} resizeMode="contain" />
                        
                        <Text style={styles.welcomeText}>Tạo tài khoản mới</Text>
                        <Text style={styles.subtitleText}>Đăng ký để trải nghiệm dịch vụ</Text>

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

                        {/* Fullname Input */}
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="badge" size={22} color="#FF4C4C" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Họ và tên"
                                value={fullname}
                                onChangeText={(text) => {
                                    setFullname(text);
                                    if (fullnameError) setFullnameError("");
                                }}
                                autoCapitalize="words"
                                placeholderTextColor="#aaa"
                            />
                        </View>
                        {fullnameError ? <Text style={styles.errorText}>{fullnameError}</Text> : null}

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="email" size={22} color="#FF4C4C" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (emailError) setEmailError("");
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#aaa"
                            />
                        </View>
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                        {/* Phone Input */}
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="phone" size={22} color="#FF4C4C" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Số điện thoại"
                                value={phone}
                                onChangeText={(text) => {
                                    setPhone(text);
                                    if (phoneError) setPhoneError("");
                                }}
                                keyboardType="phone-pad"
                                placeholderTextColor="#aaa"
                            />
                        </View>
                        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

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

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="lock" size={22} color="#FF4C4C" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (confirmPasswordError) setConfirmPasswordError("");
                                }}
                                secureTextEntry={!showConfirmPassword}
                                placeholderTextColor="#aaa"
                            />
                            <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.eyeIcon}>
                                <MaterialIcons 
                                    name={showConfirmPassword ? "visibility" : "visibility-off"} 
                                    size={22} 
                                    color="#777" 
                                />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                        {/* Terms and Conditions Checkbox */}
                        <View style={styles.termsContainer}>
                            <TouchableOpacity 
                                style={styles.checkboxContainer} 
                                onPress={toggleAgreeToTerms}
                            >
                                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                                    {agreeToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                                </View>
                                <Text style={styles.termsText}>
                                    Tôi đồng ý với 
                                    <Text 
                                        style={styles.termsLink}
                                        onPress={openTermsAndConditions}
                                    > điều khoản dịch vụ</Text>
                                </Text>
                            </TouchableOpacity>
                            {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}
                        </View>

                        {/* Register Button */}
                        <Animated.View
                            style={[
                                styles.buttonContainer, 
                                { transform: [{ scale: buttonScale }] }
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleRegister}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                disabled={isLoading}
                            >
                                <LinearGradient
                                    colors={["#FF4C4C", "#FF4C4C"]}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Footer Links */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Đã có tài khoản? </Text>
                            <TouchableOpacity onPress={() => navigation.replace("Login")}>
                                <Text style={styles.footerLink}>Đăng nhập ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
            <LoadingHelper visible={isLoading} colors={['#ffffff', '#f5f5f5', '#e0e0e0']}/>
        </SafeAreaView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFAF0", // Màu nền để tránh nhấp nháy khi load
    },
    container: {
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
        width: width * 0.5,
        height: 60,
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
        marginBottom: 25,
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
    termsContainer: {
        width: "100%",
        marginTop: 10,
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#FF4C4C",
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#FF4C4C",
    },
    termsText: {
        fontSize: 14,
        color: "#555",
        flex: 1,
    },
    termsLink: {
        color: "#FF4C4C",
        fontWeight: "bold",
    },
    buttonContainer: {
        width: "100%",
        marginBottom: 20,
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
