import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity, Alert} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {formatCurrency, formatDate, formatTime} from "../../utils/format";
import {getStatusStyle, getStatusText} from "../../utils/formatStatus";
import {MaterialIcons} from "@expo/vector-icons";
import CancellationActionSheet from "../../components/common/actionsheet/CancelActionSheet";

const TripDetailScreen = ({route, navigation}) => {
    const idDataBooking = route.params.data;
    const [dataBooking, setDataBooking] = useState(route.params.data);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route && route.params && route.params.data) {
            setDataBooking(route.params.data);
        }
    }, []);

    console.log(dataBooking, 'data booking');

    const handleCancelTicket = (reason) => {
        setLoading(true);

        // Here you would implement your API call to cancel the booking
        // Example:
        // cancelBooking(dataBooking.id, reason.id)
        //   .then(() => {
        //     // Update booking status
        //     setDataBooking({...dataBooking, status: 'cancelled'});
        //     Alert.alert('Thành công', 'Vé đã được hủy thành công');
        //   })
        //   .catch((error) => {
        //     Alert.alert('Lỗi', 'Không thể hủy vé. Vui lòng thử lại sau.');
        //     console.error(error);
        //   })
        //   .finally(() => {
        //     setLoading(false);
        //     setCancelModalVisible(false);
        //   });

        // For demo purposes, we'll simulate an API call:
        setTimeout(() => {
            setDataBooking({...dataBooking, status: 'cancelled'});
            Alert.alert('Thành công', `Vé đã được hủy với lý do: ${reason.reason}`);
            setLoading(false);
            setCancelModalVisible(false);
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {/* Payment Information */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Thông tin thanh toán</Text>
                        <View style={styles.row}>
                            <Text>Booking #</Text>
                            <Text>{dataBooking.code}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Loại xe</Text>
                            <Text>Royal</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Tên tuyến</Text>
                            <Text>{dataBooking.busSchedule.route}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Giờ đi</Text>
                            <Text>{formatTime(dataBooking.departureTime)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Số ghế/suất/tầng</Text>
                            <View style={styles.seatsContainer}>
                                {dataBooking.seats.map((item, index) => (
                                    <View key={index} style={styles.seatLabel}>
                                        <Text>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Text>Phụ thu</Text>
                            <Text
                                style={styles.greenText}>{dataBooking.surcharge ? formatCurrency(dataBooking.surcharge) : "0đ"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Khuyến mãi</Text>
                            <Text style={styles.greenText}>0đ</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Tổng</Text>
                            <Text
                                style={{fontWeight: "bold"}}>{dataBooking.totalPrice ? formatCurrency(dataBooking.totalPrice) : "0đ"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Trạng thái</Text>
                            <Text
                                style={[getStatusStyle(dataBooking.status)]}>{getStatusText(dataBooking.status)}</Text>
                        </View>
                    </View>

                    {/* Journey Details */}
                    <View style={styles.card}>
                        <Text style={styles.journeyTitle}>Thông tin chuyến đi: * Xuất bến
                            lúc {formatTime(dataBooking.departureTime)}</Text>

                        <View style={styles.journeyContent}>
                            <View style={styles.timelineContainer}>
                                <Text>Từ đi chuyến: {dataBooking.pickupLocation}</Text>
                                <View style={styles.timeline}>
                                    <View style={styles.timelineItem}>
                                        <Text>{formatDate(dataBooking.busSchedule.timeStart)}</Text>
                                        <Text>{dataBooking.pickupLocation}</Text>
                                        <Text style={styles.grayText}>{dataBooking.busSchedule.timeRoute}h</Text>
                                    </View>
                                    <View style={styles.timelineItem}>
                                        <Text>{formatDate(dataBooking.busSchedule.timeEnd)}</Text>
                                        <Text>{dataBooking.dropoffLocation}</Text>
                                    </View>
                                </View>
                                <Text>Từ đi chuyến: {dataBooking.dropoffLocation}</Text>
                            </View>

                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={dataBooking.code}
                                    size={100}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        {dataBooking.status === 'pending' ? (
                            <TouchableOpacity
                                style={styles.cancelButton}
                                activeOpacity={0.7}
                                onPress={() => setCancelModalVisible(true)}
                                disabled={loading}
                            >
                                <MaterialIcons name="cancel" size={20} color="#fff" style={styles.payIcon}/>
                                <Text style={styles.payButtonText}>
                                    {loading ? 'Đang xử lý...' : 'Hủy vé'}
                                </Text>
                            </TouchableOpacity>
                        ) : null}

                        {dataBooking.status === 'pending' || dataBooking.status === 'completed' ? (
                            <TouchableOpacity style={styles.payButton} activeOpacity={0.7}>
                                <MaterialIcons name="payment" size={20} color="#fff" style={styles.payIcon}/>
                                <Text style={styles.payButtonText}>Thanh toán ngay</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </ScrollView>
            </View>

            {/* Cancellation ActionSheet */}
            <CancellationActionSheet
                visible={cancelModalVisible}
                onClose={() => setCancelModalVisible(false)}
                onConfirm={handleCancelTicket}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    card: {
        backgroundColor: 'white',
        margin: 10,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    greenText: {
        color: 'green',
    },
    redText: {
        color: 'red',
    },
    seatsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8, // khoảng cách giữa các seats
    },
    seatLabel: {
        backgroundColor: '#FFF3CD',
        padding: 4,
        borderRadius: 4,
        marginRight: 4,
    },
    buttonContainer: {
        flexDirection: "column", // Xếp nút theo chiều dọc
        alignItems: "center", // Căn giữa theo chiều ngang
        borderRadius: 12,
        margin: 10,
    },
    cancelButton: {
        width: "100%", // Chiếm toàn bộ chiều ngang
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#9a9797",
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 10, // Cách nút bên dưới một khoảng
        shadowColor: "#ff6b6b",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    payButton: {
        width: "100%", // Chiếm toàn bộ chiều ngang
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff8956",
        paddingVertical: 14,
        borderRadius: 10,
        shadowColor: "#ff9500",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    payIcon: {
        marginRight: 8,
    },
    payButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    journeyTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    journeyContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    timelineContainer: {
        flex: 1,
        marginRight: 15,
    },
    timeline: {
        marginLeft: 20,
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        paddingLeft: 20,
        marginVertical: 10,
    },
    timelineItem: {
        marginVertical: 10,
    },
    grayText: {
        color: '#666',
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingRight: 20,
    },
    qrLabel: {
        marginBottom: 10,
        fontSize: 14,
        color: '#666',
    },
});

export default TripDetailScreen;