import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const popularDestinations = [
  {
    id: 1,
    title: "Hà Nội - Lào Cai",
    price: "485.000đ",
    duration: "11h",
    image: require("../../../assets/anhxe1.png"),
  },
  {
    id: 2,
    title: "Lào Cai - Sapa",
    price: "150.000đ",
    duration: "2h",
    image: require("../../../assets/anhxe2.png"),
  },
  {
    id: 3,
    title: "Hà Nội - Sapa",
    price: "350.000đ",
    duration: "6h",
    image: require("../../../assets/anhxe3.png"),
  },
  {
    id: 4,
    title: "Nội Bài - Lào cai",
    price: "350.000đ",
    duration: "6h",
    image: require("../../../assets/anhxe4.png"),
  },
];

const PopularDestinations = () => {
  const renderDestination = ({ item }) => (
    <TouchableOpacity style={styles.destinationCard}>
      <Image source={item.image} style={styles.destinationImage} />
      <View style={styles.destinationInfo}>
        <Text style={styles.destinationTitle}>{item.title}</Text>
        <View style={styles.destinationMeta}>
          <Text style={styles.destinationPrice}>Từ {item.price}</Text>
          <View style={styles.durationContainer}>
            <Icon name="access-time" size={16} color="black" />
            <Text style={styles.destinationDuration}>{item.duration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={popularDestinations}
      renderItem={renderDestination}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2} // Hiển thị 2 cột
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContent}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  destinationsContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  destinationCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    borderRadius: 12,
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  destinationInfo: {
    padding: 12,
  },
  destinationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  destinationMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  destinationPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6347",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  destinationDuration: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4,
  },
});

export default PopularDestinations;
