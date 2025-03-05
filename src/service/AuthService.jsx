import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from "../api/ApiConfig";
import {jwtDecode} from "jwt-decode";

const AuthService = {
    async checkToken() {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                return false;
            }
            return true;
        } catch (e) {
            throw new Error(e)
        }
    },
    async register(userReq) {
        try {
            const res = await fetch(`${apiConfig.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userReq)
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        } catch (e) {
            throw new Error(e.message);
        }
    },
    async login(userReq) {
        try {
            const res = await fetch(`${apiConfig.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userReq)
            })
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            }
            if (data.data != null) {
                await AsyncStorage.setItem("token", data.data);
            } else {
                await AsyncStorage.removeItem("token");
            }
            return data;
        } catch (e) {
            throw new Error(e);
        }
    },
    async getUser() {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                throw new Error("Lỗi khi lấy token");
            }
            const tokenDecode = jwtDecode(token);
            const res = await fetch(`${apiConfig.baseUrl}/auth/profile/${tokenDecode.userId}`, {
                method: "GET",
                headers: apiConfig.getAuthHeaders(token),
            })
            const data = await res.json();
            if (!res.ok) {
                throw new Error("Lỗi khi lấy dữ liệu!!!")
            }
            return data;
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default AuthService;
