import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {formatCurrency, formatMoney, formatTime} from "../../utils/format";
import {showCustomToast} from "../../components/common/notifice/CustomToast";
import BookingService from "../../service/booking/BookingService";
import {getStatusStyle, getStatusText} from "../../utils/formatStatus";

// Lấy kích thước màn hình để tính toán styles responsive
const { width, height } = Dimensions.get('window');

export default function BookingSuccessScreen({navigation, route}) {
    const dataBooking = route.params.dataBooking;
    const [status, setStatus] = useState("");
    console.log(dataBooking, "dataBooking")

    useEffect(() => {
        const fetchData = async() => {
            try{
                const resData = await BookingService.getById(dataBooking._id);
                setStatus(resData?.data?.status);
            }catch (e) {
                showCustomToast(e.message, "error");
            }
        }
        fetchData();
    }, []);

    const handleOpenLocationScreen = () => {
        navigation.navigate("Booking")
    }

    const handleBackHome = () => {
        navigation.replace("MainTabs")
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Success Message */}
                <View style={styles.successContainer}>
                    <Text style={styles.successText}>
                        Đặt chỗ thành công <Text style={styles.checkmark}>✓</Text>
                    </Text>
                </View>

                {/* Bus Icon */}
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../../assets/icons8-bus-100.png')}
                        style={styles.busImage}
                    />
                    <Text style={styles.tripDetailsTitle}>Chi tiết chuyến đi</Text>
                </View>

                {/* Journey Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Booking #</Text>
                        <Text style={styles.value}>{dataBooking?.code}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Giờ xuất bến</Text>
                        <Text style={styles.value}>{formatTime(dataBooking?.departureTime)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Tên tuyến</Text>
                        <Text style={styles.value}>{dataBooking?.busSchedule?.route}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Đơn vị vận chuyển</Text>
                        <Text style={styles.value}>Sao Việt</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Hạng xe</Text>
                        <Text style={styles.value}>Royal</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Số ghế/giường</Text>
                        <Text style={styles.value}>{dataBooking?.seats.length}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Điểm lên xe</Text>
                        <Text style={styles.value} numberOfLines={2} style={[styles.value, { flex: 1, marginLeft: 8 }]}>{dataBooking?.pickupLocation}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Điểm xuống xe</Text>
                        <Text style={styles.value} numberOfLines={2} style={[styles.value, { flex: 1, marginLeft: 8 }]}>{dataBooking?.dropoffLocation}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Phụ thu</Text>
                        <Text style={styles.value}>{formatCurrency(dataBooking?.surcharge)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Giá vé</Text>
                        <Text style={styles.value}>{formatMoney(dataBooking?.busSchedule?.price)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Trạng thái</Text>
                        <Text style={[styles.value, getStatusStyle(status)]}>{getStatusText(status) || "N/A"}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Tổng</Text>
                        <Text style={styles.value}>{formatCurrency(dataBooking?.totalPrice)}</Text>
                    </View>
                </View>

                {/* Thank You Message */}
                <Text style={styles.thankYouText}>
                    Cảm ơn đã sử dụng dịch vụ của Sao Việt.
                </Text>
            </ScrollView>

            {/* Buttons fixed at bottom */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.searchButton} onPress={() => handleOpenLocationScreen()}>
                    <View style={styles.searchButtonContent}>
                        <Text style={styles.searchButtonText}>Vé của tôi</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ticketButton} onPress={() => handleBackHome()}>
                    <Text style={styles.ticketButtonText}>Về trang chủ</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 120, // Thêm padding cho nút ở cuối
    },
    header: {
        backgroundColor: '#FDB022',
        paddingVertical: 15,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    successContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    successText: {
        fontSize: width > 360 ? 20 : 18,
        color: '#000000',
        fontWeight: '500',
    },
    checkmark: {
        color: '#4CAF50',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    busImage: {
        width: width * 0.25,
        height: width * 0.25,
        resizeMode: 'contain',
        maxWidth: 120,
        maxHeight: 120,
    },
    tripDetailsTitle: {
        fontSize: width > 360 ? 16 : 14,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
    },
    detailsContainer: {
        paddingHorizontal: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    label: {
        fontSize: width > 360 ? 14 : 12,
        color: '#666666',
        flex: 0.4,
    },
    value: {
        fontSize: width > 360 ? 14 : 12,
        color: '#000000',
        fontWeight: '500',
        flex: 0.6,
        textAlign: 'right',
    },
    unpaidStatus: {
        color: '#FF0000',
    },
    thankYouText: {
        textAlign: 'center',
        color: '#666666',
        fontSize: width > 360 ? 14 : 12,
        marginVertical: 20,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingHorizontal: 16,
    },
    searchButton: {
        marginBottom: 12,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    searchButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    searchButtonText: {
        fontSize: width > 360 ? 14 : 12,
        color: '#000000',
    },
    ticketButton: {
        marginBottom: 8,
        paddingVertical: 12,
        backgroundColor: '#FFA07A',
        borderRadius: 8,
        alignItems: 'center',
    },
    ticketButtonText: {
        fontSize: width > 360 ? 14 : 12,
        color: '#000000',
        fontWeight: '500',
    },
});