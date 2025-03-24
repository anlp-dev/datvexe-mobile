import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    Alert
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showCustomToast} from '../../components/common/notifice/CustomToast';
import EditPasswordActionSheet from "../../components/specific/setting/EditPasswordActionSheet";

const SettingsScreen = ({navigation}) => {
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        locationServices: true,
        saveLoginInfo: true,
        biometricLogin: false,
        autoUpdate: true,
        dataUsage: false
    });
    const changePasswordActionSheet = useRef(null);

    useEffect(() => {
        // Tải cài đặt từ AsyncStorage khi component mount
        const loadSettings = async () => {
            try {
                const savedSettings = await AsyncStorage.getItem('userSettings');
                if (savedSettings) {
                    setSettings(JSON.parse(savedSettings));
                }
            } catch (error) {
                console.error('Lỗi khi tải cài đặt:', error);
            }
        };

        loadSettings();
    }, []);

    const handleToggleSetting = async (key) => {
        try {
            const newSettings = {
                ...settings,
                [key]: !settings[key]
            };

            setSettings(newSettings);

            // Lưu cài đặt mới vào AsyncStorage
            await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));

            // Hiển thị thông báo thành công
            showCustomToast(`Đã ${newSettings[key] ? 'bật' : 'tắt'} ${getSettingLabel(key)}`, 'success');
        } catch (error) {
            console.error('Lỗi khi lưu cài đặt:', error);
            showCustomToast('Không thể lưu cài đặt', 'error');
        }
    };

    const getSettingLabel = (key) => {
        const labels = {
            notifications: 'Thông báo',
            darkMode: 'Chế độ tối',
            locationServices: 'Dịch vụ vị trí',
            saveLoginInfo: 'Thay đổi mật khẩu',
            biometricLogin: 'Đăng nhập sinh trắc học',
            autoUpdate: 'Tự động cập nhật',
            dataUsage: 'Tiết kiệm dữ liệu'
        };
        return labels[key] || key;
    };

    const handleClearCache = () => {
        Alert.alert(
            'Xóa bộ nhớ cache',
            'Bạn có chắc chắn muốn xóa bộ nhớ cache? Điều này sẽ đăng xuất bạn khỏi ứng dụng.',
            [
                {text: 'Hủy', style: 'cancel'},
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Xóa tất cả dữ liệu trong AsyncStorage
                            await AsyncStorage.clear();
                            showCustomToast('Đã xóa bộ nhớ cache', 'success');

                            // Chuyển hướng về màn hình đăng nhập
                            navigation.reset({
                                index: 0,
                                routes: [{name: 'Login'}],
                            });
                        } catch (error) {
                            console.error('Lỗi khi xóa cache:', error);
                            showCustomToast('Không thể xóa bộ nhớ cache', 'error');
                        }
                    }
                }
            ]
        );
    };

    const renderSettingItem = (key, icon, color) => (
        <View style={styles.settingItem} key={key}>
            {key === "saveLoginInfo" ? (
                <TouchableOpacity style={styles.settingLeft} onPress={() => changePasswordActionSheet?.current?.show()}>
                    <View style={[styles.iconContainer, {backgroundColor: `${color}15`}]}>
                        <MaterialIcons name={icon} size={24} color={color}/>
                    </View>
                    <Text style={styles.settingText}>{getSettingLabel(key)}</Text>
                </TouchableOpacity>
            ) : (
                <>
                    <View style={styles.settingLeft}>
                        <View style={[styles.iconContainer, {backgroundColor: `${color}15`}]}>
                            <MaterialIcons name={icon} size={24} color={color}/>
                        </View>
                        <Text style={styles.settingText}>{getSettingLabel(key)}</Text>
                    </View>
                    <Switch
                        value={settings[key]}
                        onValueChange={() => handleToggleSetting(key)}
                        trackColor={{false: '#D1D5DB', true: '#4A90E2'}}
                        thumbColor={settings[key] ? '#FFFFFF' : '#FFFFFF'}
                    />
                </>
            )}


        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tùy chọn chung</Text>
                {renderSettingItem('notifications', 'notifications', '#4A90E2')}
                {renderSettingItem('darkMode', 'brightness-2', '#6B7280')}
                {renderSettingItem('locationServices', 'location-on', '#10B981')}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bảo mật</Text>
                {renderSettingItem('saveLoginInfo', 'security', '#F59E0B')}
                {renderSettingItem('biometricLogin', 'fingerprint', '#8B5CF6')}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dữ liệu & Cập nhật</Text>
                {renderSettingItem('autoUpdate', 'system-update', '#EC4899')}
                {renderSettingItem('dataUsage', 'data-usage', '#3B82F6')}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nâng cao</Text>
                <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
                    <View style={styles.actionButtonContent}>
                        <View style={[styles.iconContainer, {backgroundColor: '#EF444415'}]}>
                            <MaterialIcons name="delete-sweep" size={24} color="#EF4444"/>
                        </View>
                        <Text style={styles.actionButtonText}>Xóa bộ nhớ cache</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#BCC5D3"/>
                </TouchableOpacity>
            </View>

            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
                <Text style={styles.copyrightText}>© 2026 Sao Việt. Tất cả các quyền được bảo lưu.</Text>
            </View>
            <EditPasswordActionSheet actionSheetRef={changePasswordActionSheet}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingText: {
        fontSize: 16,
        color: '#1F2937',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    actionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        color: '#1F2937',
    },
    versionContainer: {
        alignItems: 'center',
        marginVertical: 24,
        paddingBottom: 16,
    },
    versionText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});

export default SettingsScreen; 
