import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../components/common/Logo";
import SearchBar from "../../components/common/SearchBar";
import TransportOptions from "../../components/common/TransportOptions";
import PopularDestinations from "../../components/specific/home/PopularDestinations";
import Banner from "../../components/specific/home/Banner";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Icon } from "react-native-paper";


const HomeScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const screenHeight = Dimensions.get("window").height;
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={["#FFA07A", "#FFFFFF"]}
          style={[styles.gradientBackground, { height: screenHeight / 2 }]}
        />
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: tabBarHeight },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Banner />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>

        {/* Transport Options */}
        <View style={styles.transportContainer}>
          <TransportOptions />
        </View>

        {/* Popular Destinations */}
        <View style={styles.destinationsContainer}>
          <View style={styles.titleContainer}>
            <Ionicons
              name="map-outline"
              size={18}
              color="black"
              style={styles.icon}
            />

            <Text style={styles.sectionTitle}>Tuyến phổ biến</Text>
          </View>
          <View style={styles.destinationGrid}>
            <PopularDestinations />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  gradientBackground: {
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  bannerContainer: {
    alignSelf: "center",
    width: 400,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
  },
  searchContainer: {
    alignItems: "center",
    margin: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#FFFAF0",
  },
  transportContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  destinationsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

export default HomeScreen;
