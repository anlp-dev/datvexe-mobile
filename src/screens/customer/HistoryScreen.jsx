import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Image,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import {MaterialIcons, FontAwesome5, Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {showCustomToast} from "../../components/common/notifice/CustomToast";
import BookingService from "../../service/booking/BookingService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import {useFocusEffect} from "@react-navigation/native";
import {formatCurrency, formatTime} from "../../utils/format";

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const HistoryScreen = ({route, navigation}) => {
    const [loading, setLoading] = useState(false);
    const tab = route.params?.tabSelected || 'bookings';
    const [bookingHistoryData, setBookingHistoryData] = useState([]);

    // Dữ liệu giả cho lịch sử đặt vé
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    )


    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Đã hết phiên đăng nhập, vui lòng đăng nhập lại.");
            const decoded = jwtDecode(token);
            const resData = await BookingService.getHistoryBooking(decoded.userId);
            if(resData.status === 200){
                showCustomToast("Lấy dữ liệu thành công", "success");
                setBookingHistoryData(resData.data);
                console.log(resData.data)
            }else{
                showCustomToast("Lỗi khi lấy dữ liệu", "error");
            }
        } catch (e) {
            showCustomToast(e.message, "error");
        } finally {
            setLoading(false);
        }
    }

    // Hàm lấy màu dựa trên trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#4CAF50';
            case 'cancelled':
                return '#F44336';
            default:
                return '#757575';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Đã hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const renderItem = ({item}) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TripDetailScreen', {data: item})}
        >
            {/* Phần trên của vé */}
            <View style={styles.ticketTop}>
                <LinearGradient
                    colors={item.status === 'completed' ? ['#E8F5E9', '#C8E6C9'] : ['#FFEBEE', '#FFCDD2']}
                    style={styles.ticketGradient}
                >
                    {/* Logo và mã vé */}
                    <View style={styles.ticketHeader}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Ionicons name="bus" size={18}
                                          color={item.status === 'completed' ? '#4CAF50' : '#F44336'}/>
                            </View>
                            <View>
                                <Text style={styles.companyName}>Sao Việt</Text>
                                <Text style={styles.bookingIdText}>Mã vé: {item?.code}</Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
                            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                        </View>
                    </View>

                    {/* Tuyến đường */}
                    <View style={styles.routeContainer}>
                        <Text style={styles.routeText}>{item?.busSchedule?.route}</Text>
                    </View>

                    {/* Thông tin chi tiết */}
                    <View style={styles.ticketDetails}>
                        <View style={styles.detailItem}>
                            <MaterialIcons name="access-time" size={14} color="#555"/>
                            <View>
                                <Text style={styles.detailLabel}>Giờ xuất bến</Text>
                                <Text style={styles.detailValue}>{formatTime(item.departureTime)}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <MaterialIcons name="airline-seat-recline-normal" size={14} color="#555"/>
                            <View>
                                <Text style={styles.detailLabel}>Tổng số ghế</Text>
                                <Text style={styles.detailValue}>{item.seats.length}</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Phần đường đứt nét */}
            <View style={styles.dashedLine}>
                {Array.from({length: 20}).map((_, index) => (
                    <View key={index} style={styles.dashItem}/>
                ))}
            </View>

            {/* Phần dưới của vé */}
            <View style={styles.ticketBottom}>
                <LinearGradient
                    colors={item.status === 'completed' ? ['#C8E6C9', '#E8F5E9'] : ['#FFCDD2', '#FFEBEE']}
                    style={styles.ticketBottomGradient}
                >
                    <View style={styles.priceContainer}>
                        <View>
                            <Text style={styles.priceLabel}>Tổng tiền</Text>
                            <Text style={styles.priceValue}>{formatCurrency(item.totalPrice)}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Vòng tròn bên trái */}
            <View style={[styles.circle, styles.leftCircle]}/>

            {/* Vòng tròn bên phải */}
            <View style={[styles.circle, styles.rightCircle]}/>
        </TouchableOpacity>
    );

    // Empty list component
    const ListEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={80} color="#ccc"/>
            <Text style={styles.emptyText}>Không có dữ liệu lịch sử</Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('HomeScreen')}
            >
                <Text style={styles.emptyButtonText}>Đặt vé ngay</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content"/>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90E2"/>
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            ) : (
                <FlatList
                    data={bookingHistoryData}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={ListEmptyComponent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f3f5',
    },
    headerContainer: {
        marginBottom: 16,
    },
    headerGradient: {
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        marginTop: 20,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 4},
        elevation: 4,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    ticketTop: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    ticketBottom: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden',
    },
    ticketGradient: {
        padding: 10,
        paddingBottom: 8,
    },
    ticketBottomGradient: {
        padding: 8,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: {width: 0, height: 1},
        elevation: 2,
    },
    companyName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    bookingIdText: {
        fontSize: 10,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    routeContainer: {
        marginVertical: 6,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingHorizontal: 8,
    },
    routeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    ticketDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 6,
    },
    detailLabel: {
        fontSize: 10,
        color: '#666',
        marginLeft: 6,
    },
    detailValue: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
        marginLeft: 6,
    },
    dashedLine: {
        height: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    dashItem: {
        width: 6,
        height: 1,
        backgroundColor: '#ccc',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 10,
        color: '#666',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 6,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 10,
    },
    circle: {
        position: 'absolute',
        width: 16,
        height: 16,
        backgroundColor: '#f0f3f5',
        borderRadius: 8,
        top: '50%',
        marginTop: -8,
        zIndex: 10,
    },
    leftCircle: {
        left: -8,
    },
    rightCircle: {
        right: -8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HistoryScreen;
