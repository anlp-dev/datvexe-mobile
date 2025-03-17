import React, {useEffect, useState, useRef, useCallback} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Linking,
    Alert,
    Share
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import authService from "../../service/AuthService";
import {showCustomToast} from "../../components/common/notifice/CustomToast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Button} from 'react-native-paper';
import ProfileEditActionSheet from "../../components/specific/profile/ProfileEditActionSheet";
import BookingService from "../../service/booking/BookingService";
import {useFocusEffect} from "@react-navigation/native";

const ProfileScreen = ({navigation}) => {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const profileActionSheetRef = useRef(null);
    const aboutActionSheetRef = useRef(null);
    const supportActionSheetRef = useRef(null);
    const settingsActionSheetRef = useRef(null);
    const pointsActionSheetRef = useRef(null);
    const [discount, setDiscount] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const res_data = await authService.getUser();
                    if (res_data) {
                        setUserData(res_data.data);
                        fetchDataDiscount();
                    } else {
                        showCustomToast("Lấy thông tin người dùng thất bại !", "error");
                    }
                } catch (e) {
                    showCustomToast(e.message, "error");
                }
            }
            fetchData();
        }, [])
    )

    const fetchDataDiscount = async () => {
        try {
            const res_discount = await BookingService.getDiscount();
            if (res_discount.status === 200) {
                setDiscount(res_discount.data);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleOpenEditProfile = () => {
        profileActionSheetRef.current?.show();
    }

    const handleUpdateProfileSuccess = (updatedData) => {
        setUserData(prev => ({
            ...prev,
            ...updatedData
        }));
    }

    const handleOpenAboutInfo = () => {
        Alert.alert(
            "Thông tin Sao Việt",
            "Sao Việt là ứng dụng đặt vé xe khách hàng đầu Việt Nam, cung cấp dịch vụ đặt vé xe khách trực tuyến thuận tiện, nhanh chóng và an toàn.\n\nPhiên bản: 1.0.0\nLiên hệ: support@saoviet.vn",
            [
                {text: "Đóng", style: "cancel"},
                {
                    text: "Truy cập website",
                    onPress: () => Linking.openURL("https://saoviet.vn")
                }
            ]
        );
    }

    const handleOpenSupport = () => {
        Alert.alert(
            "Hỗ trợ khách hàng",
            "Bạn cần hỗ trợ? Vui lòng chọn một trong các phương thức liên hệ dưới đây:",
            [
                {text: "Đóng", style: "cancel"},
                {
                    text: "Gọi hotline",
                    onPress: () => Linking.openURL("tel:1900123456")
                },
                {
                    text: "Gửi email",
                    onPress: () => Linking.openURL("mailto:support@saoviet.vn")
                },
                {
                    text: "Chat trực tuyến",
                    onPress: () => navigation.navigate("ChatSupport")
                }
            ]
        );
    }

    const handleOpenSettings = () => {
        navigation.navigate("SettingsScreen");
    }

    const handleLogOutProfile = async () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
            [
                {text: "Hủy", style: "cancel"},
                {
                    text: "Đăng xuất",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await AsyncStorage.removeItem("token");
                            showCustomToast("Đăng xuất thành công!!!", "success");
                            if (navigation) {
                                navigation.reset({
                                    index: 0,
                                    routes: [{name: 'Login'}],
                                });
                            }
                        } catch (e) {
                            console.log(e.message);
                        } finally {
                            setIsLoading(false);
                            if (navigation) {
                                navigation.replace("Login");
                            }
                        }
                    }
                }
            ]
        );
    }

    // Hàm xử lý cho Quick Access Grid
    const handleOpenDiamondPoints = () => {
        Alert.alert(
            "Kim cương của bạn",
            "Bạn hiện có 151.250 điểm kim cương.\n\nKim cương được tích lũy khi bạn đặt vé và có thể dùng để đổi các ưu đãi hấp dẫn.",
            [
                {text: "Đóng", style: "cancel"},
                {
                    text: "Xem ưu đãi",
                    onPress: () => navigation.navigate("PromotionsScreen")
                }
            ]
        );
    }

    const handleOpenPromotions = () => {
        Alert.alert(
            "Khuyến mãi",
            "Hiện tại bạn không có mã khuyến mãi nào.\n\nHãy đặt vé thường xuyên để nhận được các mã khuyến mãi hấp dẫn!",
            [
                {text: "Đóng", style: "cancel"},
                {
                    text: "Tìm vé",
                    onPress: () => navigation.navigate("LocationScreen")
                }
            ]
        );
    }

    const handleOpenReferral = () => {
        const referralCode = "SV" + userData.phone?.substring(userData.phone.length - 6) || "SV123456";

        Alert.alert(
            "Giới thiệu bạn bè",
            `Mã giới thiệu của bạn: ${referralCode}\n\nMỗi khi bạn bè đăng ký và nhập mã này, cả hai sẽ nhận được 10.000 điểm kim cương!`,
            [
                {text: "Đóng", style: "cancel"},
                {
                    text: "Sao chép mã",
                    onPress: () => {
                        showCustomToast("Đã sao chép mã giới thiệu!", "success");
                    }
                },
                {
                    text: "Chia sẻ",
                    onPress: () => handleShareReferral(referralCode)
                }
            ]
        );
    }

    const handleShareReferral = async (referralCode) => {
        try {
            await Share.share({
                message: `Hãy dùng mã giới thiệu ${referralCode} của tôi để đăng ký ứng dụng Sao Việt và cả hai chúng ta sẽ nhận được 10.000 điểm kim cương! Tải ứng dụng tại: https://saoviet.vn/app`,
            });
        } catch (error) {
            showCustomToast("Không thể chia sẻ mã giới thiệu", "error");
        }
    }

    console.log(discount)

    const handleOpenNews = () => {
        navigation.navigate("NewsScreen");
    }

    const getRank = (points) => {
        if (points < 50000) {
            return "Bạc";
        } else if (50000 <= points && points < 100000) {
            return "Vàng";
        } else {
            return "Kim Cương";
        }
    }

    const menuItems = [
        {
            id: "info",
            title: "Thông tin Sao Việt",
            icon: "info",
            color: "#4A90E2",
            clickBtn: handleOpenAboutInfo,
            loadingBtn: false
        },
        {
            id: "support",
            title: "Hỗ trợ",
            icon: "help",
            color: "#50E3C2",
            clickBtn: handleOpenSupport,
            loadingBtn: false
        },
        {
            id: "settings",
            title: "Cài đặt",
            icon: "settings",
            color: "#F5A623",
            clickBtn: handleOpenSettings,
            loadingBtn: false
        },
        {
            id: "logout",
            title: "Đăng xuất",
            icon: "logout",
            color: "#FF5B5B",
            clickBtn: handleLogOutProfile,
            loadingBtn: isLoading
        },
    ];


    // Cập nhật QuickAccessItem để nhận onPress
    const QuickAccessItem = ({icon, title, value, color, onPress}) => (
        <TouchableOpacity style={styles.quickAccessItem} onPress={onPress}>
            <LinearGradient
                colors={[color, color + "80"]}
                style={styles.quickAccessIconContainer}
            >
                {icon}
            </LinearGradient>
            <Text style={styles.quickAccessTitle}>{title}</Text>
            <Text style={styles.quickAccessValue}>{value}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content"/>
            <ScrollView>
                {/* User Profile Section */}
                <View style={styles.profileContainer}>
                    <TouchableOpacity style={styles.profileSection} onPress={handleOpenEditProfile}>
                        <View style={styles.profileLeft}>
                            <View style={styles.avatarContainer}>
                                <MaterialIcons
                                    name="account-circle"
                                    size={50}
                                    color="#4A90E2"
                                />
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.userName}>{userData.fullname}</Text>
                                <Text style={styles.userPhone}>{userData.phone}</Text>
                            </View>
                        </View>
                        <MaterialIcons name="edit" size={24} color="#4A90E2"/>
                    </TouchableOpacity>
                </View>

                {/* Quick Access Grid */}
                <View style={styles.quickAccessContainer}>
                    <View style={styles.quickAccessGrid}>
                        <QuickAccessItem
                            icon={<MaterialIcons name="stars" size={24} color="#FFF"/>}
                            title={getRank(userData?.loyaltyPoints)}
                            value={userData?.loyaltyPoints}
                            color="#FFB236"
                            onPress={handleOpenDiamondPoints}
                        />
                        <QuickAccessItem
                            icon={<MaterialIcons name="local-offer" size={24} color="#FFF"/>}
                            title="Khuyến mãi"
                            value={discount.length}
                            color="#FF5B5B"
                            onPress={handleOpenPromotions}
                        />
                        <QuickAccessItem
                            icon={<MaterialIcons name="group" size={24} color="#FFF"/>}
                            title="Giới thiệu"
                            value="Bạn bè"
                            color="#4A90E2"
                            onPress={handleOpenReferral}
                        />
                        <QuickAccessItem
                            icon={
                                <MaterialIcons name="notifications" size={24} color="#FFF"/>
                            }
                            title="Tin tức"
                            value="Sao Việt"
                            color="#50E3C2"
                            onPress={handleOpenNews}
                        />
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <Button key={item.id} style={styles.menuItem} onPress={item.clickBtn} loading={item.loadingBtn}>
                            <View style={styles.menuItemLeft}>
                                <View
                                    style={[
                                        styles.menuIconContainer,
                                        {backgroundColor: item.color + "15"},
                                    ]}
                                >
                                    <MaterialIcons
                                        name={item.icon}
                                        size={24}
                                        color={item.color}
                                    />
                                </View>
                                <Text style={styles.menuItemTitle}>{item.title}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#BCC5D3"/>
                        </Button>
                    ))}
                </View>
            </ScrollView>

            {/* Profile Edit Action Sheet */}
            <ProfileEditActionSheet
                actionSheetRef={profileActionSheetRef}
                userData={userData}
                onUpdateSuccess={handleUpdateProfileSuccess}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
    },
    header: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFF",
        textAlign: "center",
    },
    profileContainer: {
        padding: 16,
        backgroundColor: "#FFF",
        borderRadius: 16,
        margin: 16,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    profileLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarContainer: {
        backgroundColor: "#F0F7FF",
        borderRadius: 25,
        padding: 5,
    },
    profileInfo: {
        marginLeft: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A2138",
    },
    userPhone: {
        fontSize: 14,
        color: "#8F9BB3",
        marginTop: 4,
    },
    quickAccessContainer: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        margin: 16,
        marginTop: 0,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    quickAccessGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    quickAccessItem: {
        width: "50%",
        padding: 12,
        alignItems: "flex-start",
    },
    quickAccessIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    quickAccessTitle: {
        fontSize: 14,
        color: "#8F9BB3",
        marginBottom: 4,
    },
    quickAccessValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A2138",
    },
    menuContainer: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        margin: 16,
        marginTop: 0,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 12,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    menuItemTitle: {
        fontSize: 16,
        color: "#1A2138",
        fontWeight: "500",
    },
});

export default ProfileScreen;
