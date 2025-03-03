
    import React, { useState } from "react";
    import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
    import { Ionicons } from "@expo/vector-icons";

    const OrderTrackingScreen = () => {

        const [orders, setOrders] = useState([
            {
                id: "1",
                productName: "Fried Chicken Burger",
                status: "Shipped",
                deliveryTime: "25 minutes",
                image: require('../../assets/Cheeseburger.png'),
            },
            {
                id: "2",
                productName: "Pepperoni Pizza",
                status: "Out for Delivery",
                deliveryTime: "15 minutes",
                image: require('../../assets/Cheeseburger.png'),
            },
          
        ]);
        const deleteOrder = (id) => {
            setOrders(orders.filter(order => order.id !== id));
        };

        const renderItem = ({ item }) => (
            <View style={styles.orderContainer}>
                <Image source={item.image} style={styles.productImage} />
                <View style={styles.orderDetails}>
                    <Text style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.status}>Status: {item.status}</Text>
                    <Text style={styles.deliveryTime}>ETA: {item.deliveryTime}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteOrder(item.id)}>
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={styles.container}>
                <Text style={styles.header}>Order Tracking</Text>
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#F5F5F5",
            padding: 20,
        },
        header: {
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 15,
            textAlign: "center",
        },
        orderContainer: {
            flexDirection: "row",
            backgroundColor: "white",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
            alignItems: "center",
            justifyContent: "space-between",
        },
        productImage: {
            width: 50,
            height: 50,
            borderRadius: 10,
            marginRight: 15,
        },
        orderDetails: {
            flex: 1,
        },
        productName: {
            fontSize: 16,
            fontWeight: "bold",
        },
        status: {
            color: "#666",
        },
        deliveryTime: {
            color: "#888",
        },
    });

    export default OrderTrackingScreen;
