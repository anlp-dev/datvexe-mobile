import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const VehicleInfoScreen = ({ route, navigation }) => {
    const { busType, dataSchedule } = route.params || {};
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const dataDetail= dataSchedule?.busOperator?.types;

    // Vehicle images
    const vehicleImages = busType === 'BUS20'? [
        require('../../assets/imageCar/24_1.png'),
        require('../../assets/imageCar/24_2.png'),
        require('../../assets/imageCar/24_3.png'),
        require('../../assets/imageCar/24_4.png'),
    ] : [
        require('../../assets/imageCar/34_1.png'),
        require('../../assets/imageCar/34_2.png'),
        require('../../assets/imageCar/34_3.png'),
        require('../../assets/imageCar/34_4.png'),
    ];
    
    // Vehicle amenities based on bus type
    const amenities = busType === 'BUS20' ? [
        { id: 1, name: 'Điều hòa', icon: 'snow-outline' },
        { id: 2, name: 'WiFi miễn phí', icon: 'wifi-outline' },
        { id: 3, name: 'Nước uống', icon: 'water-outline' },
        { id: 4, name: 'Chăn mền', icon: 'bed-outline' },
        { id: 5, name: 'Ổ cắm điện', icon: 'flash-outline' },
        { id: 6, name: 'Nhà vệ sinh', icon: 'water-outline' },
    ] : [
        { id: 1, name: 'Điều hòa', icon: 'snow-outline' },
        { id: 2, name: 'WiFi miễn phí', icon: 'wifi-outline' },
        { id: 3, name: 'Nước uống', icon: 'water-outline' },
        { id: 4, name: 'Chăn mền', icon: 'bed-outline' },
        { id: 5, name: 'Ổ cắm điện', icon: 'flash-outline' },
        { id: 6, name: 'Nhà vệ sinh', icon: 'water-outline' },
        { id: 7, name: 'Tivi', icon: 'tv-outline' },
        { id: 8, name: 'Massage ghế', icon: 'body-outline' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFA07A" barStyle="dark-content" />

            <ScrollView style={styles.scrollView}>
                {/* Image Carousel */}
                <View style={styles.imageCarousel}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(event) => {
                            const slideIndex = Math.floor(
                                event.nativeEvent.contentOffset.x / 
                                event.nativeEvent.layoutMeasurement.width
                            );
                            setActiveImageIndex(slideIndex);
                        }}
                    >
                        {vehicleImages.map((image, index) => (
                            <Image 
                                key={index}
                                source={image}
                                style={styles.vehicleImage}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                    
                    {/* Image Indicators */}
                    <View style={styles.indicatorContainer}>
                        {vehicleImages.map((_, index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.indicator,
                                    index === activeImageIndex && styles.activeIndicator
                                ]} 
                            />
                        ))}
                    </View>
                </View>
                
                {/* Vehicle Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Thông tin xe</Text>
                    
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Loại xe:</Text>
                            <Text style={styles.infoValue}>{dataDetail?.name}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Số ghế:</Text>
                            <Text style={styles.infoValue}>{dataDetail?.seats}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Mẫu xe:</Text>
                            <Text style={styles.infoValue}>{dataDetail?.model}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Năm sản xuất:</Text>
                            <Text style={styles.infoValue}>2024</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Đặc điểm:</Text>
                            <Text style={styles.infoValue}>{dataDetail?.description}</Text>
                        </View>
                    </View>
                </View>
                
                {/* Amenities */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Tiện ích trên xe</Text>
                    
                    <View style={styles.amenitiesContainer}>
                        {amenities.map((item) => (
                            <View key={item.id} style={styles.amenityItem}>
                                <Icon name={item.icon} size={24} color="#FFA07A" />
                                <Text style={styles.amenityName}>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                {/* Safety Features */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>An toàn</Text>
                    
                    <View style={styles.safetyContainer}>
                        <View style={styles.safetyItem}>
                            <Icon name="shield-checkmark-outline" size={24} color="#4CAF50" />
                            <Text style={styles.safetyText}>Tài xế có kinh nghiệm trên 5 năm</Text>
                        </View>
                        <View style={styles.safetyItem}>
                            <Icon name="speedometer-outline" size={24} color="#4CAF50" />
                            <Text style={styles.safetyText}>Giám sát tốc độ liên tục</Text>
                        </View>
                        <View style={styles.safetyItem}>
                            <Icon name="medkit-outline" size={24} color="#4CAF50" />
                            <Text style={styles.safetyText}>Trang bị bộ sơ cứu y tế</Text>
                        </View>
                        <View style={styles.safetyItem}>
                            <Icon name="hammer-outline" size={24} color="#4CAF50" />
                            <Text style={styles.safetyText}>Búa phá kính an toàn</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFA07A',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 16,
    },
    scrollView: {
        flex: 1,
    },
    imageCarousel: {
        height: 250,
        position: 'relative',
    },
    vehicleImage: {
        width: width,
        height: 250,
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 16,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: '#FFA07A',
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    infoSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    infoCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        width: 120,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    amenityItem: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
    },
    amenityName: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    safetyContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
    },
    safetyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    safetyText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 12,
        flex: 1,
    },
});

export default VehicleInfoScreen; 
