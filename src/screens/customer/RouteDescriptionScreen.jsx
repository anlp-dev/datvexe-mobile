import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons';
import {formatDate, formatTime} from "../../utils/format";

const RouteDescriptionScreen = ({ route, navigation }) => {
    const { dataSchedule } = route.params || {};
    
    // Sample route stops - in a real app, this would come from the API
    const routeStops = [
        { id: 1, name: 'Bến xe Miền Đông', time: '06:00', type: 'start' },
        { id: 2, name: 'Trạm dừng Dầu Giây', time: '07:30', type: 'stop' },
        { id: 3, name: 'Trạm dừng Bảo Lộc', time: '10:00', type: 'stop' },
        { id: 4, name: 'Trạm dừng Di Linh', time: '11:30', type: 'stop' },
        { id: 5, name: 'Bến xe Đà Lạt', time: '13:00', type: 'end' },
    ];

    console.log(dataSchedule)

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFA07A" barStyle="dark-content" />
            <ScrollView style={styles.scrollView}>
                <View style={styles.routeCard}>
                    <View style={styles.routeHeader}>
                        <Text style={styles.routeTitle}>
                            {dataSchedule?.route || ''}
                        </Text>
                        <Text style={styles.routeSubtitle}>
                            {formatDate(dataSchedule?.timeStart) || '06:00'} - {formatDate(dataSchedule?.timeEnd) || '13:00'}
                        </Text>
                    </View>
                    
                    <View style={styles.routeMap}>
                        <Image 
                            source={require('../../assets/banner2.png')} 
                            style={styles.mapImage}
                            resizeMode="cover"
                        />
                    </View>
                    
                    <View style={styles.routeStops}>
                        <Text style={styles.sectionTitle}>Các điểm dừng</Text>

                        <View style={styles.stopItem}>
                            <View style={styles.stopTimeline}>
                                <View style={styles.startDot} />
                                <View style={styles.stopLine} />
                            </View>
                            <View style={styles.stopInfo}>
                                <Text style={styles.stopName}>{dataSchedule.benXeKhoiHanh.tenBenXe}</Text>
                            </View>
                        </View>
                        <View style={styles.stopItem}>
                            <View style={styles.stopTimeline}>
                                <View style={styles.stopDot} />
                                <View style={styles.stopLine} />
                            </View>
                            <View style={styles.stopInfo}>
                                <Text style={styles.stopName}>Trạm dừng nghỉ KM68</Text>
                            </View>
                        </View>
                        <View style={styles.stopItem}>
                            <View style={styles.stopTimeline}>
                                <View style={styles.endDot} />
                            </View>
                            <View style={styles.stopInfo}>
                                <Text style={styles.stopName}>{dataSchedule.benXeDichDen.tenBenXe}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.routeNotes}>
                        <Text style={styles.sectionTitle}>Lưu ý</Text>
                        <View style={styles.noteItem}>
                            <Icon name="information-circle-outline" size={20} color="#FFA07A" />
                            <Text style={styles.noteText}>Hành khách nên có mặt tại bến xe trước 30 phút</Text>
                        </View>
                        <View style={styles.noteItem}>
                            <Icon name="time-outline" size={20} color="#FFA07A" />
                            <Text style={styles.noteText}>Thời gian di chuyển có thể thay đổi tùy theo tình hình giao thông</Text>
                        </View>
                        <View style={styles.noteItem}>
                            <Icon name="cafe-outline" size={20} color="#FFA07A" />
                            <Text style={styles.noteText}>Xe sẽ dừng nghỉ tại các trạm dừng khoảng 15-20 phút</Text>
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
    routeCard: {
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
    routeHeader: {
        marginBottom: 16,
    },
    routeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    routeSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    routeMap: {
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    routeStops: {
        marginBottom: 16,
    },
    stopItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    stopTimeline: {
        width: 24,
        alignItems: 'center',
    },
    stopDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFA07A',
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 1,
    },
    startDot: {
        backgroundColor: '#4CAF50',
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    endDot: {
        backgroundColor: '#F44336',
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    stopLine: {
        width: 2,
        height: 40,
        backgroundColor: '#FFA07A',
        position: 'absolute',
        top: 12,
        bottom: 0,
    },
    stopInfo: {
        flex: 1,
        marginLeft: 12,
    },
    stopName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    stopTime: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    routeNotes: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
    },
    noteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    noteText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
});

export default RouteDescriptionScreen; 
