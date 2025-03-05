import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import authService from "../../service/AuthService";
import {showCustomToast} from "../../components/common/notifice/CustomToast";

const EditProfile = ({navigation}) => {
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res_data = await authService.getUser();
                setUserInfo(res_data.data);
            } catch (e) {
                showCustomToast(e.message, "error");
            }
        }
        fetchData();
    }, []);



    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <MaterialIcons name="person" size={40} color="#6B7280"/>
                </View>
                <Text style={styles.name}>{userInfo.fullname}</Text>
                <Text style={styles.phone}>{userInfo.phone}</Text>
            </View>

            {/* Personal Information Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
                    <TouchableOpacity>
                        <Text style={styles.editButton}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoList}>
                    <InfoItem
                        icon={<MaterialIcons name="calendar-today" size={20} color="#6B7280"/>}
                        label="Ngày sinh"
                        value={userInfo.dateOfBirth}
                    />
                    <InfoItem
                        icon={<MaterialIcons name="location-on" size={20} color="#6B7280"/>}
                        label="Địa chỉ"
                        value={userInfo.address}
                    />
                    <InfoItem
                        icon={<MaterialIcons name="email" size={20} color="#6B7280"/>}
                        label="Thư điện tử"
                        value={userInfo.email}
                    />
                    <InfoItem
                        icon={<MaterialIcons name="directions-bus" size={20} color="#6B7280"/>}
                        label="Mục đích đi lại"
                        value="Đi học - Về quê"
                    />
                </View>
            </View>

            {/* Payment Information Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
                    <TouchableOpacity>
                        <Text style={styles.editButton}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoList}>
                    <InfoItem
                        icon={<MaterialIcons name="email" size={20} color="#6B7280"/>}
                        label="Thư điện tử"
                        value=""
                    />
                    <InfoItem
                        icon={<MaterialCommunityIcons name="office-building" size={20} color="#6B7280"/>}
                        label="Tên công ty"
                        value=""
                    />
                    <InfoItem
                        icon={<MaterialCommunityIcons name="file-document" size={20} color="#6B7280"/>}
                        label="Mã số thuế"
                        value=""
                    />
                    <InfoItem
                        icon={<MaterialIcons name="location-on" size={20} color="#6B7280"/>}
                        label="Địa chỉ công ty"
                        value=""
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const InfoItem = ({icon, label, value}) => (
    <View style={styles.infoItem}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{label}: {value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: '#6B7280',
    },
    section: {
        padding: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
    },
    editButton: {
        color: '#3B82F6',
    },
    infoList: {
        gap: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 24,
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
});

export default EditProfile;