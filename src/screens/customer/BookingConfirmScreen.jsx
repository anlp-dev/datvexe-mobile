import React, {useCallback, useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    Switch,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    Modal
} from 'react-native';
import {AntDesign, MaterialIcons, Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {TYPE_BUS} from "../../enums/EnumsType";
import TripService from "../../service/trip/TripService";
import {showCustomToast} from "../../components/common/notifice/CustomToast";
import AuthService from "../../service/AuthService";
import {formatCurrency, formatCurrencyToNumber, formatDate, formatDateMonth} from "../../utils/format";
import BookingService from "../../service/booking/BookingService";
import {Button} from "react-native-paper";

const BookingConfirmScreen = ({navigation}) => {
    const route = useRoute();
    const [seatIdSelected, setSeatIdSelected] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [busType, setBusType] = useState('');
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [dataSchedule, setDataSchedule] = useState({});
    const [userData, setUserData] = useState({});
    const [note, setNote] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [usedPoints, setUsedPoints] = useState(0);
    const [availablePoints, setAvailablePoints] = useState(); // Example points
    const [promotionCodes, setPromotionCodes] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [disableBtn, setDisableBtn] = useState(false);
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const resData = await AuthService.getUser();
                    setUserData(resData.data);
                    setAvailablePoints(resData.data.loyaltyPoints)
                    fetchDiscount();
                } catch (e) {
                    showCustomToast(e.message);
                }
            }
            fetchData();
        }, [])
    )

    const fetchDiscount = async () => {
        try {
            const response = await BookingService.getDiscount();
            if (response.status === 200) {
                setPromotionCodes(response.data)
            } else {
                showCustomToast(response.message, "info");
            }
        } catch (e) {
            showCustomToast(e.message);
        }
    }

    useEffect(() => {
        if (route && route.params && route.params.dataSchedule
            && route.params.selectedSeats && route.params.totalPrice && route.params.busType) {
            setDataSchedule(route.params.dataSchedule)
            setSeatIdSelected(route.params.selectedSeats)
            setTotalPrice(route.params.totalPrice)
            setOriginalPrice(route.params.totalPrice)
            setBusType(route.params.busType)
        }
    }, [route]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const handlePaymentScreen = async () => {
        try {
            setDisableBtn(true);
            const dataReq = {
                user: userData._id,
                busSchedule: dataSchedule._id,
                totalPrice: totalPrice,
                originalPrice: originalPrice,
                usedPoints: usedPoints,
                promotionCode: selectedPromotion ? selectedPromotion.code : null,
                seats: seatIdSelected,
                pickupLocation: dataSchedule.benXeKhoiHanh.tenBenXe,
                dropoffLocation: dataSchedule.benXeDichDen.tenBenXe,
                departureTime: dataSchedule.timeStart,
                exportInvoice: isEnabled,
                note: note,
                usePoint: usedPoints,
                selectPromotion: selectedPromotion?.id
            }
            const resData = await TripService.themMoiBooking(dataReq);
            if (resData.status === 200) {
                navigation.replace("PaymentScreen", {dataBooking: resData.data[0]});
            } else {
                showCustomToast("Error", "error")
            }

        } catch (e) {
            showCustomToast(e.message, "error");
        }finally {
            setDisableBtn(false)
        }
    }

    const toggleSwitch = () => {
        setIsEnabled((previousState) => !previousState);
    }

    const handlePromotionPress = () => {
        setShowPromotionModal(true);
    }

    const handlePointsPress = () => {
        const pointsValue = Math.floor(availablePoints / 1000); // 1000 points = 1 VND

        if (pointsValue <= 0) {
            showCustomToast("Bạn không có đủ điểm để đổi", "info");
            return;
        }

        Alert.alert(
            "Sử dụng điểm thưởng",
            `Bạn có ${availablePoints} điểm (tương đương ${formatCurrency(pointsValue)}). Bạn có muốn sử dụng điểm để giảm giá không?`,
            [
                {
                    text: "Không",
                    style: "cancel"
                },
                {
                    text: "Có",
                    onPress: () => {
                        const newTotalPrice = Math.max(0, originalPrice - pointsValue);
                        setTotalPrice(newTotalPrice);
                        setUsedPoints(availablePoints);
                        showCustomToast(`Đã sử dụng ${availablePoints} điểm để giảm giá ${formatCurrency(pointsValue)}`, "success");
                    }
                }
            ]
        );
    }


    const applyPromotion = (promotion) => {
        if (!promotion) {
            setTotalPrice(originalPrice);
            setSelectedPromotion(null);
            setShowPromotionModal(false);
            return;
        }

        const discountAmount = (originalPrice * promotion.discount) / 100;
        const newTotalPrice = originalPrice - discountAmount;
        setTotalPrice(newTotalPrice);
        setSelectedPromotion(promotion);
        setShowPromotionModal(false);
        showCustomToast(`Đã áp dụng mã giảm giá ${promotion.code}`, "success");
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Scrollable Content */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Timer */}
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                        Thời gian đặt vé còn: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </Text>
                </View>

                {/* Location Selection */}
                <TouchableOpacity style={styles.locationSelector}>
                    <Text style={styles.locationText}>{dataSchedule.route}</Text>
                    <Text style={styles.locationSubText}>{TYPE_BUS.find(t => t.code === busType)?.name}</Text>
                    <View style={styles.locationRight}>
                        <Text style={styles.dateText}>Sao Việt</Text>
                        <Text style={styles.dateSubText}>{formatDateMonth(dataSchedule.date)}</Text>
                    </View>
                </TouchableOpacity>

                {/* Membership Card */}
                <View style={styles.membershipCard}>
                    <Text>Membership</Text>
                    <Text style={styles.membershipText}>Kim cương</Text>
                    <MaterialIcons name="verified-user" size={24} color="#FFD700"/>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Họ và tên *</Text>
                        <TextInput
                            style={styles.input}
                            value={userData.fullname}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Số điện thoại *</Text>
                        <TextInput
                            style={styles.input}
                            value={userData.phone}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={userData.email}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ghi chú</Text>
                        <TextInput
                            style={styles.input}
                            value={note}
                            onChangeText={(text) => setNote(text)}
                            placeholder="Vui lòng nhập ghi chú"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                {/* Additional Options */}
                <View style={styles.optionsContainer}>
                    <View style={styles.optionRow}>
                        <Text>Tôi cần xuất hoá đơn</Text>
                        <Switch
                            value={isEnabled}
                            onValueChange={toggleSwitch}
                        />
                    </View>

                    {/* Points Section */}
                    <Text style={styles.sectionTitle}>Ưu đãi của bạn</Text>
                    <View style={styles.pointsContainer}>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.buttonCard}
                                onPress={handlePromotionPress}
                            >
                                <View style={styles.buttonIconContainer}>
                                    <Ionicons name="gift-outline" size={24} color="#FF6347"/>
                                </View>
                                <View style={styles.buttonTextContainer}>
                                    <Text style={styles.buttonTitle}>Khuyến mãi</Text>
                                    <Text style={styles.buttonSubtitle} numberOfLines={1} ellipsizeMode="tail">
                                        {selectedPromotion ? `${selectedPromotion.code}` : `${promotionCodes.length} mã khuyến mãi`}
                                    </Text>
                                </View>
                                <View style={styles.buttonArrow}>
                                    <AntDesign name="right" size={16} color="#999"/>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonCard}
                                onPress={handlePointsPress}
                            >
                                <View style={styles.buttonIconContainer}>
                                    <Ionicons name="star-outline" size={24} color="#FFD700"/>
                                </View>
                                <View style={styles.buttonTextContainer} aria-disabled={usedPoints <= 0}>
                                    <Text style={styles.buttonTitle}>Điểm thưởng</Text>
                                    <Text style={styles.buttonSubtitle} numberOfLines={1} ellipsizeMode="tail">
                                        {usedPoints > 0
                                            ? `${usedPoints} điểm`
                                            : `${availablePoints} điểm`}
                                    </Text>
                                </View>
                                <View style={styles.buttonArrow}>
                                    <AntDesign name="right" size={16} color="#999"/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Add padding at bottom to ensure content doesn't get hidden behind footer */}
                <View style={styles.bottomPadding}/>
            </ScrollView>

            {/* Footer stays fixed at bottom */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Tổng</Text>
                    <Text style={styles.totalAmount}>{totalPrice ? formatCurrency(totalPrice) : "0đ"}</Text>
                </View>
                <Button style={styles.continueButton} onPress={handlePaymentScreen} disabled={disableBtn} loading={disableBtn}>
                    <Text style={styles.continueButtonText}>Tiếp tục</Text>
                </Button>
            </View>

            {/* Promotion Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPromotionModal}
                onRequestClose={() => setShowPromotionModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn mã khuyến mãi</Text>
                            <TouchableOpacity onPress={() => setShowPromotionModal(false)}>
                                <AntDesign name="close" size={24} color="#000"/>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.promotionList}>
                            {promotionCodes.length > 0 ? (
                                promotionCodes.map((promo) => (
                                    <TouchableOpacity
                                        key={promo.id}
                                        style={styles.promotionItem}
                                        onPress={() => applyPromotion(promo)}
                                    >
                                        <View style={styles.promotionLeft}>
                                            <Text style={styles.promotionCode}>{promo.code}</Text>
                                            <Text style={styles.promotionDesc}>{promo.description}</Text>
                                        </View>
                                        <View style={styles.promotionRight}>
                                            <Text style={styles.promotionDiscount}>-{promo.discount}%</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.noPromotions}>Không có mã khuyến mãi nào</Text>
                            )}
                        </ScrollView>

                        {selectedPromotion && (
                            <TouchableOpacity
                                style={styles.removePromotionButton}
                                onPress={() => applyPromotion(null)}
                            >
                                <Text style={styles.removePromotionText}>Xóa mã khuyến mãi</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setShowPromotionModal(false)}
                        >
                            <Text style={styles.closeModalText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFC107',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    progressDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
    },
    inactiveDot: {
        backgroundColor: '#E0E0E0',
    },
    progressLine: {
        width: 40,
        height: 2,
        backgroundColor: '#E0E0E0',
    },
    activeLine: {
        backgroundColor: '#4CAF50',
    },
    scrollView: {
        flex: 1,
    },
    timerContainer: {
        padding: 12,
        backgroundColor: '#FFF3E0',
        alignItems: 'center'
    },
    timerText: {
        color: '#FF9800',
    },
    locationSelector: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationSubText: {
        color: '#666',
    },
    locationRight: {
        alignItems: 'flex-end',
    },
    dateText: {
        fontWeight: 'bold',
    },
    dateSubText: {
        color: '#666',
    },
    membershipCard: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF8E1',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    membershipText: {
        color: '#FFA000',
        fontWeight: 'bold',
    },
    formContainer: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        color: '#666',
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 4,
    },
    optionsContainer: {
        padding: 16,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    pointsContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    buttonCard: {
        backgroundColor: '#fff',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    buttonIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    buttonTextContainer: {
        flex: 1,
    },
    buttonTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    buttonSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    buttonArrow: {
        padding: 2,
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 8,
    },
    touchableRow: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    pointsText: {
        marginLeft: 8,
        flex: 1,
        fontWeight: '500',
    },
    rowRightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomPadding: {
        height: 20,
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF9800',
    },
    continueButton: {
        backgroundColor: '#FFA07A',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    promotionList: {
        maxHeight: 300,
    },
    promotionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    promotionLeft: {
        flex: 1,
    },
    promotionCode: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    promotionDesc: {
        color: '#666',
        fontSize: 14,
    },
    promotionRight: {
        backgroundColor: '#FFA07A',
        padding: 8,
        borderRadius: 4,
    },
    promotionDiscount: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noPromotions: {
        textAlign: 'center',
        padding: 20,
        color: '#666',
    },
    removePromotionButton: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    removePromotionText: {
        color: '#FF6347',
    },
    closeModalButton: {
        backgroundColor: '#FFA07A',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    closeModalText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default BookingConfirmScreen;
