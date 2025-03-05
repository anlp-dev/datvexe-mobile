import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/customer/HomeScreen";
import BookingScreen from "../screens/customer/BookingScreen";
import { Badge } from "react-native-paper";
import HistoryScreen from "../screens/customer/HistoryScreen";
import NotificationScreen from "../screens/customer/NotificationScreen";
import ProfileScreen from "../screens/customer/ProfileScreen";
const Tab = createBottomTabNavigator();

const NavigationTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
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
              <Ionicons name="home" size={size} color={color} />
            </>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Thông báo"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <>
              <Ionicons name="notifications" size={size} color={color} />
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
        name="Tài khoản"
        component={ProfileScreen}
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
