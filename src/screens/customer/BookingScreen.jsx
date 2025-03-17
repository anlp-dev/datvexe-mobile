import React, {useCallback, useEffect, useState} from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FontAwesome5} from "@expo/vector-icons";
import Tab from "../../components/specific/booking/Tab";
import {showCustomToast} from "../../components/common/notifice/CustomToast";
import BookingService from "../../service/booking/BookingService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import {formatTime} from "../../utils/format";
import {MaterialIcons} from "@expo/vector-icons";
import {getStatusStyle, getStatusText} from "../../utils/formatStatus";


const BookingScreen = ({navigation}) => {
    const [tab, setTab] = useState("bookings"); // 'bookings' | 'history'
    const [dataBooking, setDataBooking] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const token = await AsyncStorage.getItem("token");
                    if (!token) {
                        throw new Error("Lỗi khi lấy token");
                    }
                    const tokenDecode = jwtDecode(token);
                    const resData = await BookingService.getByUser(tokenDecode.userId);
                    if (resData.status === 200) {
                        setDataBooking(resData.data)
                    } else {
                        showCustomToast("Error", "error");
                    }
                } catch (e) {
                    console.log(e.message)
                    showCustomToast(e.message, 'info')
                }
            }
            fetchData()
        }, [])
    )

    const handlePayment = (item) => {
        try {
            navigation.navigate("PaymentScreen", {dataBooking: item});
        }catch (e) {
            showCustomToast(e.message, "error");
        }
    }

    const handleDetailTrip = (item) => {
        try{
            navigation.navigate("TripDetailScreen", {data: item});
        }catch (e) {
            showCustomToast(e.message, "error")
        }
    }

    const renderItem = ({item}) => (
        <View style={styles.ticketContainer}>
            <TouchableOpacity onPress={() => handleDetailTrip(item)}>
                <View style={styles.ticket}>
                    <View style={styles.ticketHeader}>
                        <Text style={styles.ticketCode}>
                            🎟 Mã vé: {item.code}
                        </Text>
                        <Text style={[styles.status, getStatusStyle(item.status)]}>
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                    <View style={styles.ticketBody}>
                        <Text style={styles.ticketDetail}>🕒 Thời gian: {formatTime(item.departureTime)}</Text>
                        <Text style={styles.ticketDetail}>📍 Điểm xuất phát: {item.pickupLocation}</Text>
                        <Text style={styles.ticketDetail}>📍 Điểm đến: {item.dropoffLocation}</Text>
                    </View>
                    {item.status === 'pending' ? (
                        <TouchableOpacity style={styles.payButton} activeOpacity={0.7} onPress={() => handlePayment(item)}>
                            <MaterialIcons name="payment" size={20} color="#fff" style={styles.payIcon}/>
                            <Text style={styles.payButtonText}>Thanh toán ngay</Text>
                        </TouchableOpacity>
                    ) : ""}


                    <View style={styles.ticketFooter}>
                        <View style={styles.dottedLine}/>
                        <Text style={styles.footerText}>Tận hưởng chuyến đi! 🚍</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Tabs */}
            <Tab tab={tab} setTab={setTab}/>
            {/* Content */}
            <FlatList
                data={dataBooking}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.historyButton}
                                  onPress={() => navigation.navigate('HistoryTab', {tabSelected: tab})}
                >
                    <Text style={styles.historyButtonText}>Lịch sử</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
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
    list: {
        padding: 16,
    },
    ticketContainer: {
        marginVertical: 8,
        paddingHorizontal: 5,
        alignItems: "center"
    },
    ticket: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        width: 400,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        position: "relative",
    },
    ticketHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    ticketCode: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    status: {
        fontSize: 14,
        fontWeight: "bold",
    },
    ticketBody: {
        marginVertical: 8,
    },
    ticketDetail: {
        fontSize: 14,
        marginVertical: 4,
        color: "#555",
    },
    payButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fa8457",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    payIcon: {
        marginRight: 8, // Khoảng cách giữa icon và chữ
    },
    payButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    ticketFooter: {
        alignItems: "center",
        marginTop: 8,
    },
    dottedLine: {
        borderStyle: "dotted",
        borderWidth: 1,
        borderRadius: 1,
        borderColor: "#999",
        width: "100%",
        marginVertical: 8,
    },
    footerText: {
        fontSize: 12,
        color: "#888",
        textAlign: "center",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 10
    },
    historyButton: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#FF9800",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
    },
    historyButtonText: {
        color: "#FF9800",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default BookingScreen;
