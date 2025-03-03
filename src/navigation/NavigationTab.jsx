import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/customer/HomeScreen";
import BookingScreen from "../screens/customer/BookingScreen";
import { Badge } from "react-native-paper";
import ProfileCustomerScreen from "../screens/customer/ProfileCustomerScreen";
import ProductDetailScreen from "../screens/customer/ProductDetailScreen";
import CartProductScreen from "../screens/customer/CartProductScreen";
import PaymentScreen from "../screens/customer/PaymentScreen";
import PaymentSuccessScreen from "../screens/customer/PaymentSuccessScreen";
import ForgotPasswordScreen from "../screens/user/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/user/ResetPasswordScreen";
import SignUpScreen from "../screens/user/SignUpScreen";
import FavoritFood from "../screens/customer/FavoriteFood";
import ChatScreen from "../screens/customer/ChatScreen";
import OrderTrackingScreen from "../screens/customer/OrderTrackingScreen";
const Tab = createBottomTabNavigator();

const NavigationTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#EADDFF",
        },
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "#FF6347",
      }}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <>
              <Ionicons name="home-outline" size={size} color={color} />
            </>
          ),
          headerShown: false,
        }}
      />
      
      <Tab.Screen
        name="Giỏ hàng"
        component={CartProductScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <>
              <Ionicons  name="chatbubble-ellipses-outline" size={size} color={color} />
              <Badge
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "red",
                  fontSize: 12,
                  paddingHorizontal: 6,
                }}
              >
                3
              </Badge>
            </>
          ),
        }}
      />

<Tab.Screen
        name="Thông Báo"
        component={OrderTrackingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <>
              <Ionicons  name="notifications" size={size} color={color} />
              <Badge
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "red",
                  fontSize: 12,
                  paddingHorizontal: 6,
                }}
              >
                3
              </Badge>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Tài Khoản"
        component={ProfileCustomerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationTab;
