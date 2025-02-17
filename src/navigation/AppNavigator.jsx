import React, {useEffect} from "react";
import {TouchableOpacity} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome5} from "@expo/vector-icons";

// Screens
import NavigationTab from "./NavigationTab";
import LoginScreen from "../screens/LoginScreen";
import HistoryScreen from "../screens/customer/HistoryScreen";
import LocationScreen from "../screens/customer/LocationScreen";
import CarScheduleScreen from "../screens/customer/CarScheduleScreen";
import SeatSelectionScreen from "../screens/customer/SeatSelectionScreen";
import BookingConfirmScreen from "../screens/customer/BookingConfirmScreen";
import PaymentScreen from "../screens/customer/PaymentScreen";
import DriverHomeScreen from "../screens/driver/DriverHomeScreen";
import BookingSuccessScreen from "../screens/customer/BookingSuccessScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfile from "../screens/customer/DetailProfileScreen";
import DetailProfileScreen from "../screens/customer/DetailProfileScreen";

const Stack = createStackNavigator();

// Constants
const HEADER_STYLE = {
    backgroundColor: "#FFA07A",
};

const HEADER_TINT_COLOR = "#fff";

// Common header options
const getCommonHeaderOptions = (title) => ({
    headerBackTitle: title === "Hoàn thành" ? null : " Quay lại",
    headerBackImage: () => (
        <FontAwesome5 name="chevron-left" size={16} color={HEADER_TINT_COLOR}/>
    ),
    headerStyle: HEADER_STYLE,
    headerTintColor: HEADER_TINT_COLOR,
    headerTitle: title,
});

// Screen configurations
const SCREEN_CONFIGS = [
    {
        name: "Login",
        component: LoginScreen,
        options: {headerShown: false},
    },
    {
        name: "MainTabs",
        component: NavigationTab,
        options: {headerShown: false},
    },
    {
        name: "HistoryTab",
        component: HistoryScreen,
        options: getCommonHeaderOptions("Lịch sử"),
    },
    {
        name: "LocationScreen",
        component: LocationScreen,
        options: getCommonHeaderOptions("Xe khách"),
    },
    {
        name: "SeatSelectionScreen",
        component: SeatSelectionScreen,
        options: getCommonHeaderOptions("Chọn chỗ"),
    },
    {
        name: "CarScheduleScreen",
        component: CarScheduleScreen,
        options: getCommonHeaderOptions("Danh sách chuyến"),
    },
    {
        name: "PaymentScreen",
        component: PaymentScreen,
        options: getCommonHeaderOptions("Thanh toán"),
    },
    {
        name: "BookingConfirmScreen",
        component: BookingConfirmScreen,
        options: getCommonHeaderOptions("Xác nhận thông tin"),
    },
    {
        name: "DriverHomeScreen",
        component: DriverHomeScreen,
        options: {headerShown: false},
    },
    {
        name: "EditProfileScreen",
        component: EditProfile,
        options: getCommonHeaderOptions("Thông tin cá nhân")
    },
    {
        name: "BookingSuccessScreen",
        component: BookingSuccessScreen,
        options: {
            ...getCommonHeaderOptions("Hoàn thành"),
            headerLeft: () => null,
        }
    }
];

const AppNavigator = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const loadToken = async () => {
            try{
                const token = await AsyncStorage.getItem("token");
                if(!token){
                    navigation.replace("Login");
                }
            }catch (e) {
                console.log(e)
            }
        }
        loadToken();
    }, []);

    const locationPickerOptions = {
        headerBackTitleStyle: "",
        headerBackTitle: "",
        headerBackImage: () => null,
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome5
                    name="times"
                    size={20}
                    color={HEADER_TINT_COLOR}
                    style={{marginRight: 15}}
                />
            </TouchableOpacity>
        ),
        headerStyle: HEADER_STYLE,
        headerTintColor: HEADER_TINT_COLOR,
        headerTitle: "Chọn địa điểm",
    };

    return (
        <Stack.Navigator initialRouteName="Login">
            {SCREEN_CONFIGS.map(({name, component, options}) => (
                <Stack.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={options}
                />
            ))}
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options= {{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;