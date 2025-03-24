import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {showCustomToast} from "../../components/common/notifice/CustomToast";
import UserService from "../../service/user/UserService";
import {useFocusEffect} from "@react-navigation/native";

const NotificationScreen = ({navigation}) => {
    const [activeTab, setActiveTab] = useState('promotions');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true)


    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true)
                    const resData = await UserService.getNotifications();
                    if (resData.status === 200) {
                        setNotifications(resData.data);
                    }
                } catch (e) {
                    showCustomToast(e.message, 'error');
                } finally {
                    setLoading(false)
                }
            };
            fetchData();
        }, [])
    );

    const tabs = [
        {id: 'promotions', label: 'Khuyến mãi'},
        {id: 'events', label: 'Sự kiện'},
    ];


    const getIcon = (type) => {
        switch (type) {
            case 'cancel':
                return 'cancel';
            case 'info':
                return 'info';
            case 'points':
                return 'star';
            case 'upcoming':
                return 'directions-bus';
            case 'success':
                return 'check-circle';
            default:
                return 'notifications';
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'cancel':
                return '#e74c3c';
            case 'success':
                return '#2ecc71';
            case 'points':
                return '#f1c40f';
            default:
                return '#3498db';
        }
    };

    const filteredNotifications = notifications.filter(
        (notification) => notification.tab === activeTab
    );

    return (
        <View style={styles.container}>
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[
                            styles.tab,
                            activeTab === tab.id && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab.id && styles.activeTabText
                        ]}>
                            {tab.label}
                        </Text>
                        {activeTab === tab.id && <View style={styles.activeTabIndicator}/>}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Notifications List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90E2"/>
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            ) : (
                <ScrollView style={styles.notificationsList}>
                    {filteredNotifications.map((notification) => (
                        <View key={notification._id} style={styles.notificationItem}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons
                                    name={getIcon(notification.type)}
                                    size={24}
                                    color={getIconColor(notification.type)}
                                />
                            </View>
                            <View style={styles.contentContainer}>
                                <Text style={styles.title}>{notification.title}</Text>
                                <Text style={styles.message}>{notification.message}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        position: 'relative',
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
    activeTab: {
        backgroundColor: '#fff',
    },
    tabText: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#f39c12',
        fontWeight: 'bold',
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#f39c12',
    },
    notificationsList: {
        flex: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    iconContainer: {
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
    },
});

export default NotificationScreen;
