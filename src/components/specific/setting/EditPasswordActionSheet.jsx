import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { showCustomToast } from '../../common/notifice/CustomToast';
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../../service/user/UserService";
import ActionSheet from "react-native-actions-sheet";

const EditPasswordActionSheet = ({ actionSheetRef }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            showCustomToast("Vui lòng nhập đầy đủ thông tin!", "error", "top");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            showCustomToast("Mật khẩu mới và xác nhận mật khẩu không khớp!", "error", "top");
            return;
        }
        try {
            setIsLoading(true);
            const response = await UserService.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (response.status === 200) {
                setIsLoading(false);
                showCustomToast("Thay đổi mật khẩu thành công!", "success");
                actionSheetRef.current?.hide();
            } else {
                throw new Error("Không thể thay đổi mật khẩu!");
            }
        } catch (error) {
            setIsLoading(false);
            showCustomToast(error.message || "Thay đổi mật khẩu thất bại!", "error");
        }
    };

    return (
        <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.actionSheetTitle}>Thay đổi mật khẩu</Text>
                    <Text style={styles.actionSheetSubtitle}>Cập nhật mật khẩu mới cho tài khoản của bạn</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.currentPassword}
                            onChangeText={(text) => handleInputChange('currentPassword', text)}
                            placeholder="Nhập mật khẩu hiện tại"
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.newPassword}
                            onChangeText={(text) => handleInputChange('newPassword', text)}
                            placeholder="Nhập mật khẩu mới"
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.confirmPassword}
                            onChangeText={(text) => handleInputChange('confirmPassword', text)}
                            placeholder="Xác nhận mật khẩu mới"
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => actionSheetRef.current?.hide()}>
                        <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        disabled={isLoading}
                        onPress={handleSave}
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
    actionSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    actionSheetSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    formContainer: {
        padding: 16,
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
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        fontSize: 16,
        color: '#333',
    },
    actionsContainer: {
        flexDirection: 'row',
        padding: 16,
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

export default EditPasswordActionSheet;
