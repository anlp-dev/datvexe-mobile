import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Animated,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const PickUpLocationStorage = () => {
    // Dữ liệu địa điểm
    const locations = [
        { id: 1, name: 'Hà Nội' },
        { id: 2, name: 'Hồ Chí Minh' },
        { id: 3, name: 'Đà Nẵng' },
        { id: 4, name: 'Cần Thơ' },
        { id: 5, name: 'Hải Phòng' },
    ];

    // Dữ liệu loại hàng
    const productTypes = [
        { id: 1, name: 'Quần áo', pricePerKm: 1000, icon: 'tshirt' },
        { id: 2, name: 'Điện tử', pricePerKm: 2000, icon: 'mobile-alt' },
        { id: 3, name: 'Thực phẩm', pricePerKm: 1500, icon: 'utensils' },
        { id: 4, name: 'Đồ gia dụng', pricePerKm: 1800, icon: 'couch' },
        { id: 5, name: 'Hàng dễ vỡ', pricePerKm: 2500, icon: 'wine-glass' },
    ];

    // Khoảng cách giữa các địa điểm
    const distanceMatrix = {
        '1-2': 1720, // Hà Nội - HCM
        '1-3': 760,  // Hà Nội - Đà Nẵng
        '1-4': 1800, // Hà Nội - Cần Thơ
        '1-5': 120,  // Hà Nội - Hải Phòng
        '2-3': 960,  // HCM - Đà Nẵng
        '2-4': 180,  // HCM - Cần Thơ
        '2-5': 1800, // HCM - Hải Phòng
        '3-4': 1000, // Đà Nẵng - Cần Thơ
        '3-5': 850,  // Đà Nẵng - Hải Phòng
        '4-5': 1900, // Cần Thơ - Hải Phòng
    };

    // States
    const [originLocation, setOriginLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [productType, setProductType] = useState(null);
    const [weight, setWeight] = useState('1');
    const [orderCreated, setOrderCreated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [originName, setOriginName] = useState('');
    const [destinationName, setDestinationName] = useState('');
    const [productName, setProductName] = useState('');
    const [distance, setDistance] = useState(0);

    // Hiệu ứng khi hiển thị thông báo thành công
    useEffect(() => {
        if (showSuccessMessage) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowSuccessMessage(false);
            });
        }
    }, [showSuccessMessage, fadeAnim]);

    // Cập nhật tên địa điểm và sản phẩm khi chọn
    useEffect(() => {
        if (originLocation) {
            const location = locations.find(loc => loc.id === originLocation);
            setOriginName(location ? location.name : '');
        }

        if (destinationLocation) {
            const location = locations.find(loc => loc.id === destinationLocation);
            setDestinationName(location ? location.name : '');
        }

        if (productType) {
            const product = productTypes.find(prod => prod.id === productType);
            setProductName(product ? product.name : '');
        }

        if (originLocation && destinationLocation) {
            const locationKey = `${Math.min(originLocation, destinationLocation)}-${Math.max(originLocation, destinationLocation)}`;
            setDistance(distanceMatrix[locationKey] || 0);
        }
    }, [originLocation, destinationLocation, productType]);

    // Tính giá tiền
    const calculatePrice = () => {
        if (!originLocation || !destinationLocation || !productType) return 0;

        // Xác định khoảng cách
        const locationKey = `${Math.min(originLocation, destinationLocation)}-${Math.max(originLocation, destinationLocation)}`;
        const distance = distanceMatrix[locationKey] || 0;

        if (distance === 0) return 0;

        // Tìm giá tiền cho loại hàng
        const product = productTypes.find(p => p.id === productType);
        const pricePerKm = product ? product.pricePerKm : 0;

        // Tính tổng giá tiền
        return distance * pricePerKm * parseFloat(weight || 1);
    };

    // Xử lý tạo đơn hàng
    const handleCreateOrder = () => {
        if (originLocation && destinationLocation && productType) {
            setLoading(true);
            // Giả lập gửi đơn hàng
            setTimeout(() => {
                setLoading(false);
                setOrderCreated(true);
                setShowSuccessMessage(true);
                // Reset form sau khi tạo đơn
                setTimeout(() => {
                    setOrderCreated(false);
                }, 3000);
            }, 1500);
        }
    };

    // Format số tiền
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
    };

    // Format khoảng cách
    const formatDistance = (distance) => {
        return distance + " km";
    };

    // Render product type card
    const renderProductTypeCard = (product) => {
        const isSelected = productType === product.id;

        return (
            <TouchableOpacity
                key={product.id}
                style={[
                    styles.productCard,
                    isSelected && styles.productCardSelected
                ]}
                onPress={() => setProductType(product.id)}
            >
                <FontAwesome5
                    name={product.icon}
                    size={24}
                    color={isSelected ? '#fff' : '#FFA07A'}
                />
                <Text style={[
                    styles.productCardText,
                    isSelected && styles.productCardTextSelected
                ]}>
                    {product.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#FF8C69" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Thông tin chính */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="local-shipping" size={22} color="#FFA07A" />
                        <Text style={styles.cardTitle}>Thông tin vận chuyển</Text>
                    </View>

                    {/* Địa điểm đi */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="location-on" size={18} color="#FFA07A" />
                            <Text style={styles.label}>Điểm đi</Text>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={originLocation}
                                style={styles.picker}
                                onValueChange={(itemValue) => setOriginLocation(itemValue)}
                            >
                                <Picker.Item label="Chọn điểm đi" value={null} color="#888" />
                                {locations.map((location) => (
                                    <Picker.Item key={location.id} label={location.name} value={location.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Địa điểm đến */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="pin-drop" size={18} color="#FFA07A" />
                            <Text style={styles.label}>Điểm đến</Text>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={destinationLocation}
                                style={styles.picker}
                                onValueChange={(itemValue) => setDestinationLocation(itemValue)}
                            >
                                <Picker.Item label="Chọn điểm đến" value={null} color="#888" />
                                {locations.map((location) => (
                                    <Picker.Item key={location.id} label={location.name} value={location.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Hiển thị khoảng cách */}
                    {distance > 0 && (
                        <View style={styles.distanceContainer}>
                            <MaterialIcons name="timeline" size={16} color="#FFA07A" />
                            <Text style={styles.distanceText}>
                                Khoảng cách: <Text style={styles.distanceValue}>{formatDistance(distance)}</Text>
                            </Text>
                        </View>
                    )}

                    {/* Loại hàng - dạng card */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="category" size={18} color="#FFA07A" />
                            <Text style={styles.label}>Loại hàng</Text>
                        </View>
                        <View style={styles.productTypeContainer}>
                            {productTypes.map(renderProductTypeCard)}
                        </View>
                    </View>

                    {/* Khối lượng */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="fitness-center" size={18} color="#FFA07A" />
                            <Text style={styles.label}>Khối lượng (kg)</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                            placeholder="Nhập khối lượng"
                        />
                    </View>
                </View>

                {/* Thông tin chi tiết */}
                {(originLocation && destinationLocation && productType) ? (
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Chi tiết vận chuyển</Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Điểm đi:</Text>
                            <Text style={styles.summaryValue}>{originName}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Điểm đến:</Text>
                            <Text style={styles.summaryValue}>{destinationName}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Loại hàng:</Text>
                            <Text style={styles.summaryValue}>{productName}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Khối lượng:</Text>
                            <Text style={styles.summaryValue}>{weight} kg</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Khoảng cách:</Text>
                            <Text style={styles.summaryValue}>{formatDistance(distance)}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Tổng phí vận chuyển:</Text>
                            <Text style={styles.priceValue}>{formatPrice(calculatePrice())}</Text>
                        </View>
                    </View>
                ) : null}

                {/* Nút tạo đơn */}
                <TouchableOpacity
                    style={[
                        styles.createOrderButton,
                        (!originLocation || !destinationLocation || !productType) ? styles.disabledButton : {}
                    ]}
                    onPress={handleCreateOrder}
                    disabled={!originLocation || !destinationLocation || !productType || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.createOrderButtonText}>
                            {orderCreated ? "Đã tạo đơn thành công!" : "Tạo đơn vận chuyển"}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Thông báo hiệu ứng khi tạo đơn thành công */}
                {showSuccessMessage && (
                    <Animated.View style={[styles.successMessage, {opacity: fadeAnim}]}>
                        <MaterialIcons name="check-circle" size={24} color="#fff" />
                        <Text style={styles.successMessageText}>Đơn hàng đã được tạo thành công!</Text>
                    </Animated.View>
                )}

                {/* Thông tin bổ sung */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoHeader}>
                        <MaterialIcons name="info" size={20} color="#FFA07A" />
                        <Text style={styles.infoTitle}>Thông tin vận chuyển</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <MaterialIcons name="schedule" size={18} color="#FFA07A" />
                        <Text style={styles.infoText}>Thời gian vận chuyển: 1-3 ngày</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <MaterialIcons name="location-searching" size={18} color="#FFA07A" />
                        <Text style={styles.infoText}>Hỗ trợ theo dõi đơn hàng trực tuyến</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <MaterialIcons name="security" size={18} color="#FFA07A" />
                        <Text style={styles.infoText}>Bảo hiểm hàng hóa lên đến 100% giá trị</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <MaterialIcons name="support-agent" size={18} color="#FFA07A" />
                        <Text style={styles.infoText}>Hỗ trợ khách hàng 24/7</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5EE', // Seashell - màu nền nhẹ phù hợp với Light Salmon
    },
    header: {
        backgroundColor: '#FFA07A', // Light Salmon - màu chính
        padding: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: '#FF8C69', // Salmon
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 15,
        marginTop: 20,
        padding: 20,
        shadowColor: '#FFA07A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    inputGroup: {
        marginBottom: 18,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        marginLeft: 6,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#FFE4E1', // MistyRose
        borderRadius: 10,
        backgroundColor: '#FFFAFA', // Snow
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    input: {
        borderWidth: 1,
        borderColor: '#FFE4E1', // MistyRose
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FFFAFA', // Snow
    },
    productTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        borderWidth: 1,
        borderColor: '#FFE4E1', // MistyRose
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#FFFAFA', // Snow
    },
    productCardSelected: {
        backgroundColor: '#FFA07A', // Light Salmon
        borderColor: '#FFA07A',
    },
    productCardText: {
        marginTop: 6,
        fontWeight: '500',
        color: '#333',
    },
    productCardTextSelected: {
        color: '#fff',
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F5', // LavenderBlush
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    distanceText: {
        marginLeft: 6,
        color: '#333',
    },
    distanceValue: {
        fontWeight: 'bold',
        color: '#FFA07A', // Light Salmon
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 15,
        marginTop: 15,
        padding: 20,
        shadowColor: '#FFA07A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#555',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#FFE4E1', // MistyRose
        marginVertical: 10,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    priceLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    priceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFA07A', // Light Salmon
    },
    createOrderButton: {
        backgroundColor: '#FF8C69', // Salmon (đậm hơn Light Salmon một chút)
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        margin: 15,
        alignItems: 'center',
        shadowColor: '#FFA07A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#FFD1C1', // Màu nhạt hơn của Light Salmon
        shadowOpacity: 0.1,
    },
    createOrderButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    successMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF7F50', // Coral
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
    },
    successMessageText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    infoContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 15,
        marginVertical: 15,
        padding: 20,
        shadowColor: '#FFA07A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
});

export default PickUpLocationStorage;