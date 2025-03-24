import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { showCustomToast } from '../../common/notifice/CustomToast';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../../service/user/UserService";
import ActionSheet from "react-native-actions-sheet";

const ProfileEditActionSheet = ({ actionSheetRef, userData, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData({
                fullname: userData.fullname || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                dateOfBirth: userData.dateOfBirth ? formatDate(userData.dateOfBirth) : ''
            });
        }
    }, [userData]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Nếu là trường dateOfBirth và đã nhập đủ format DD/MM/YYYY, kiểm tra tính hợp lệ
        if (field === 'dateOfBirth' && value.length === 10) {
            const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            if (dateRegex.test(value)) {
                const [day, month, year] = value.split('/').map(Number);
                const date = new Date(year, month - 1, day);
                if (isNaN(date.getTime())) {
                    showCustomToast("Ngày sinh không hợp lệ!", "error", "top");
                }
            } else {
                showCustomToast("Vui lòng nhập đúng định dạng DD/MM/YYYY!", "error", "top");
            }
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);

            const decode = jwtDecode(await AsyncStorage.getItem("token"));
            const { fullname, email, phone, address, dateOfBirth } = formData;

            const [day, month, year] = dateOfBirth.split('/').map(Number);
            const formattedDate = new Date(year, month - 1, day).toISOString();

            const response = await UserService.updateProfileUser(decode.userId, {
                fullname,
                email,
                phone,
                address,
                dateOfBirth: formattedDate,
            });

            if (response && response.data) {
                setIsLoading(false);
                onUpdateSuccess(response.data);
                showCustomToast("Cập nhật thông tin thành công!", "success", "top");
                actionSheetRef.current?.hide();
            } else {
                throw new Error("Không thể cập nhật thông tin!");
            }
        } catch (error) {
            setIsLoading(false);
            showCustomToast(error.message || "Cập nhật thông tin thất bại!", "error", "top");
        }
    };

    return (
        <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.actionSheetTitle}>Chỉnh sửa thông tin cá nhân</Text>
                    <Text style={styles.actionSheetSubtitle}>Cập nhật thông tin cá nhân của bạn</Text>
                </View>

                <ScrollView style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Họ và tên</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="person" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={formData.fullname}
                                onChangeText={(text) => handleInputChange('fullname', text)}
                                placeholder="Nhập họ và tên"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="email" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                                placeholder="Nhập email"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Số điện thoại</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="phone" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                placeholder="Nhập số điện thoại"
                                keyboardType="phone-pad"
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Địa chỉ</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="location-on" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={formData.address}
                                onChangeText={(text) => handleInputChange('address', text)}
                                placeholder="Nhập địa chỉ"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Ngày sinh</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="calendar-today" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={formData.dateOfBirth}
                                onChangeText={(text) => handleInputChange('dateOfBirth', text)}
                                placeholder="DD/MM/YYYY"
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => actionSheetRef.current?.hide()} activeOpacity={0.7}>
                        <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        disabled={isLoading}
                        onPress={handleSave}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.saveButtonText}>{isLoading ? "Đang lưu..." : "Lưu thay đổi"}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ActionSheet>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    indicator: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginVertical: 8,
    },
    actionSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333333',
    },
    actionSheetSubtitle: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
    formContainer: {
        padding: 16,
        maxHeight: 400,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4A4A4A',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333333',
    },
    actionsContainer: {
        flexDirection: 'row',
        padding: 16,
        paddingTop: 0,
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#4B5563',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    saveButtonDisabled: {
        backgroundColor: '#A0C4F1',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileEditActionSheet;
