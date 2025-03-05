import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Tab = ({ tab, setTab }) => {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, tab === "bookings" && styles.activeTab]}
        onPress={() => setTab("bookings")}
      >
        <FontAwesome5
          name="ticket-alt"
          size={20}
          color={tab === "bookings" ? "#FF6347" : "#333"}
        />
        <Text
          style={[styles.tabText, tab === "bookings" && styles.activeTabText]}
        >
          Xe khách
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, tab === "history" && styles.activeTab]}
        onPress={() => setTab("history")}
      >
        <FontAwesome5
          name="archive"
          size={20}
          color={tab === "history" ? "#FF6347" : "#333"}
        />
        <Text
          style={[styles.tabText, tab === "history" && styles.activeTabText]}
        >
          Hàng hóa
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    alignItems: "center",
    padding: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FF6347",
  },
  activeTabText: {
    color: "#FF6347",
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
})

export default Tab;
