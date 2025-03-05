import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MESSAGE, SUCCESS, FAIL, ERROR } from "../enums/Message";
import authService from "../service/AuthService";
import {showCustomToast} from "../components/common/notifice/CustomToast";

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        try {
            if (!username || !email || !fullname || !phone || !password || !confirmPassword) {
                Alert.alert(MESSAGE.ERROR, ERROR.NOT_FILL);
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert(MESSAGE.ERROR, ERROR.PASS_NOT_MATCH);
                return;
            }
            if (!/^\d{10}$/.test(phone)) {
                Alert.alert(MESSAGE.ERROR, ERROR.PHONE_NOT_10DIGIT);
                return;
            }

        } catch (e) {
            showCustomToast(e.message, "error")
        } finally {
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={["#FFFAF0", "#FFD700", "#FF8C00", "#FFA07A", "#FFFFFF"]}
                style={styles.container}
            >
                <Image source={require("../assets/logo-banner.png")} style={styles.logo} />

                <TextInput
                    style={styles.input}
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor="#aaa"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Tên đầy đủ"
                    value={fullname}
                    onChangeText={setFullname}
                    autoCapitalize="words"
                    placeholderTextColor="#aaa"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#aaa"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#aaa"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#aaa"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#aaa"
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Đăng ký</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Đã có tài khoản?</Text>
                    <TouchableOpacity onPress={() => navigation.replace("Login")}>
                        <Text style={styles.footerLink}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
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
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        shadowColor: "#FF4C4C",
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonText: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        marginTop: 20,
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
    },
});
