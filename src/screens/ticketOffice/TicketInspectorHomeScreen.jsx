import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Alert,
    StatusBar,
    Image,
    Dimensions,
    RefreshControl,
    Animated,
    ImageBackground,
} from "react-native";
import {Ionicons, MaterialCommunityIcons, FontAwesome5} from "@expo/vector-icons";
import CalendarStrip from "react-native-calendar-strip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LinearGradient} from "expo-linear-gradient";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const {width} = Dimensions.get("window");
const PRIMARY_COLOR = "#FFA07A";
const SECONDARY_COLOR = "#FF8C61";
const LIGHT_COLOR = "#FFF0ED";

export default function TicketInspectorHomeScreen({navigation}) {
    const insets = useSafeAreaInsets();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [scrollY] = useState(new Animated.Value(0));
    const [headerStyle, setHeaderStyle] = useState("style3"); // Changed default to style3
    const [showOptions, setShowOptions] = useState(false);

    // Mock data for routes and schedules
    const [routes] = useState([
        {id: "1", name: "Hà Nội - Đà Nẵng"},
        {id: "2", name: "Hà Nội - Hải Phòng"},
        {id: "3", name: "Hà Nội - Sài Gòn"},
        {id: "4", name: "Hà Nội - Huế"},
    ]);

    const [schedules] = useState({
        "2025-03-11": [
            {
                id: "1",
                route: "Hà Nội - Đà Nẵng",
                routeId: "1",
                departureTime: "07:00",
                status: "Sắp khởi hành",
                busNumber: "BS-123",
                passengers: 32,
                busType: "BUS34",
                driver: "Nguyễn Văn A",
            },
            {
                id: "2",
                route: "Hà Nội - Hải Phòng",
                routeId: "2",
                departureTime: "13:30",
                status: "Chưa khởi hành",
                busNumber: "BS-456",
                passengers: 28,
                busType: "BUS20",
                driver: "Trần Văn B",
            },
        ],
        "2025-03-12": [
            {
                id: "3",
                route: "Hà Nội - Sài Gòn",
                routeId: "3",
                departureTime: "08:00",
                status: "Sắp khởi hành",
                busNumber: "BS-789",
                passengers: 40,
                busType: "BUS34",
                driver: "Lê Văn C",
            },
            {
                id: "4",
                route: "Hà Nội - Huế",
                routeId: "4",
                departureTime: "09:30",
                status: "Chưa khởi hành",
                busNumber: "BS-101",
                passengers: 25,
                busType: "BUS20",
                driver: "Phạm Văn D",
            },
        ],
    });

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate data fetching
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handleLogout = () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đăng xuất",
                    onPress: async () => {
                        await AsyncStorage.removeItem("token");
                        navigation.navigate("Login");
                    }
                }
            ]
        );
    };

    const getCurrentSchedules = () => {
        const dateKey = selectedDate.toISOString().split("T")[0];
        let filteredSchedules = schedules[dateKey] || [];

        // Filter by search query
        if (searchQuery) {
            filteredSchedules = filteredSchedules.filter(
                schedule =>
                    schedule.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    schedule.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    schedule.driver.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by selected route
        if (selectedRoute) {
            filteredSchedules = filteredSchedules.filter(
                schedule => schedule.routeId === selectedRoute
            );
        }

        return filteredSchedules;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Sắp khởi hành":
                return "#4CAF50";
            case "Chưa khởi hành":
                return "#FF9800";
            case "Đã khởi hành":
                return "#9E9E9E";
            default:
                return "#9E9E9E";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Sắp khởi hành":
                return "timer-sand";
            case "Chưa khởi hành":
                return "clock-outline";
            case "Đã khởi hành":
                return "bus";
            default:
                return "help-circle-outline";
        }
    };

    const renderRouteItem = ({item}) => (
        <TouchableOpacity
            style={[
                styles.routeChip,
                selectedRoute === item.id && styles.selectedRouteChip,
            ]}
            onPress={() => {
                setSelectedRoute(selectedRoute === item.id ? null : item.id);
            }}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.routeChipText,
                    selectedRoute === item.id && styles.selectedRouteChipText,
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderScheduleItem = ({item}) => (
        <Animated.View style={styles.scheduleCardContainer}>
            <TouchableOpacity
                style={styles.scheduleCard}
                onPress={() => navigation.navigate("TicketInspectorTripDetail", {trip: item})}
                activeOpacity={0.7}
            >
                <View style={styles.scheduleHeader}>
                    <View style={styles.routeContainer}>
                        <LinearGradient
                            colors={[PRIMARY_COLOR, SECONDARY_COLOR]}
                            style={styles.routeIconContainer}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                        >
                            <Ionicons name="bus" size={22} color="white"/>
                        </LinearGradient>
                        <View>
                            <Text style={styles.routeText}>{item.route}</Text>
                            <Text style={styles.busNumberText}>{item.busNumber} • {item.busType}</Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.statusBadge,
                            {backgroundColor: getStatusColor(item.status) + "20"},
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={getStatusIcon(item.status)}
                            size={14}
                            color={getStatusColor(item.status)}
                            style={styles.statusIcon}
                        />
                        <Text
                            style={[styles.statusText, {color: getStatusColor(item.status)}]}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider}/>

                <View style={styles.scheduleDetails}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="people" size={18} color={PRIMARY_COLOR}/>
                            <Text style={styles.detailText}>{item.passengers} Hành khách</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="person" size={18} color={PRIMARY_COLOR}/>
                            <Text style={styles.detailText}>{item.driver}</Text>
                        </View>
                    </View>
                    <View style={styles.timeContainer}>
                        <View style={styles.timeWrapper}>
                            <Ionicons name="time" size={18} color={PRIMARY_COLOR}/>
                            <Text style={styles.timeText}>{item.departureTime}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.detailButton}
                            onPress={() => navigation.navigate("TicketInspectorTripDetail", {trip: item})}
                        >
                            <Text style={styles.detailButtonText}>Kiểm tra vé</Text>
                            <Ionicons name="chevron-forward" size={14} color="white"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [headerStyle === "style1" ? 100 : headerStyle === "style2" ? 110 : 120, 80],
        extrapolate: 'clamp',
    });

    const handleQuickAction = (action) => {
        switch (action) {
            case 'checkTickets':
                // Navigate to QR scanner screen for ticket checking
                navigation.navigate("QRScannerScreen");
                break;
            case 'routes':
                // Show routes
                setSelectedRoute(null);
                Alert.alert("Tuyến đường", "Đã hiển thị tất cả các tuyến đường");
                break;
            case 'schedule':
                // Show schedule for today
                setSelectedDate(new Date());
                Alert.alert("Lịch trình", "Đã chuyển về lịch trình hôm nay");
                break;
            default:
                break;
        }
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    // Render different header styles
    const renderHeader = () => {
        return (
            <Animated.View style={[
                styles.headerContainer,
                {
                    opacity: headerOpacity,
                    height: headerHeight,
                    paddingTop: insets.top,
                }
            ]}>
                <LinearGradient
                    colors={['#FF8C61', PRIMARY_COLOR]}
                    style={styles.headerGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                >
                    <View style={styles.headerContent3}>
                        <View style={styles.headerTopRow}>
                            <View style={styles.dateContainer}>
                                <View style={styles.dateCircle}> 
                                    <Text style={styles.dateDay}>{selectedDate.getDate()}</Text>
                                    <Text style={styles.dateMonth}>
                                        {selectedDate.toLocaleDateString("vi-VN", {month: "short"})}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.headerTitle}>Soát vé</Text>
                                    <Text style={styles.dateText}>
                                        {selectedDate.toLocaleDateString("vi-VN", {
                                            weekday: "long",
                                        })}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    style={styles.headerStyleButton}
                                    onPress={toggleOptions}
                                >
                                    <Ionicons name="menu" size={22} color="white"/>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.notificationButton}>
                                    <Ionicons name="notifications" size={24} color="white"/>
                                    <View style={styles.notificationBadge}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                    <Ionicons name="log-out-outline" size={24} color="white"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        )
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content"/>

            {renderHeader()}

            <View style={[
                styles.searchContainer,
                {marginTop: headerStyle === "style1" ? -15 : headerStyle === "style2" ? -15 : -20}
            ]}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color={PRIMARY_COLOR}/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm tuyến, xe, tài xế..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#A0A0A0"
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={20} color="#A0A0A0"/>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <View style={styles.calendarContainer}>
                <CalendarStrip
                    scrollable
                    style={styles.calendar}
                    calendarColor={'transparent'}
                    calendarHeaderStyle={styles.calendarHeader}
                    dateNumberStyle={styles.calendarDate}
                    dateNameStyle={styles.calendarName}
                    highlightDateNumberStyle={styles.calendarHighlightDate}
                    highlightDateNameStyle={styles.calendarHighlightName}
                    disabledDateNameStyle={styles.calendarDisabledName}
                    disabledDateNumberStyle={styles.calendarDisabledNumber}
                    iconContainer={{flex: 0.1}}
                    selectedDate={selectedDate}
                    onDateSelected={setSelectedDate}
                    highlightDateContainerStyle={styles.highlightDateContainer}
                />
            </View>

            <View style={styles.routesContainer}>
                <FlatList
                    data={routes}
                    renderItem={renderRouteItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.routesList}
                />
            </View>

            <Animated.FlatList
                data={getCurrentSchedules()}
                renderItem={renderScheduleItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[PRIMARY_COLOR]}
                        tintColor={PRIMARY_COLOR}
                    />
                }
                ListHeaderComponent={
                    <Text style={styles.listHeader}>Lịch Trình Xe Chạy</Text>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={60} color={PRIMARY_COLOR}/>
                        <Text style={styles.emptyText}>
                            Không có chuyến xe nào trong ngày này
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => setSelectedDate(new Date())}
                        >
                            <Text style={styles.emptyButtonText}>Quay lại hôm nay</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    headerContainer: {
        overflow: 'hidden',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    headerGradient: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'flex-end',
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        color: "white",
        fontSize: 26,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    dateText: {
        color: "white",
        fontSize: 14,
        marginTop: 5,
        opacity: 0.9,
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    notificationButton: {
        position: "relative",
        marginRight: 15,
    },
    logoutButton: {
        padding: 5,
    },
    notificationBadge: {
        position: "absolute",
        right: -2,
        top: -2,
        backgroundColor: "#FF0000",
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    headerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 160, 122, 0.85)',
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    headerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: 'white',
    },
    avatarText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: 'white',
        fontSize: 14,
        opacity: 0.9,
    },
    headerStatsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 15,
        padding: 15,
        justifyContent: 'space-between',
        marginTop: 15,
    },
    headerStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    headerStatNumber: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerStatLabel: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
    },
    headerStatDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 10,
    },

    // Style 3 header styles
    headerContent3: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    headerWavePattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        overflow: 'hidden',
    },
    headerWave: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -50,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateCircle: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    dateDay: {
        color: PRIMARY_COLOR,
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 18,
    },
    dateMonth: {
        color: PRIMARY_COLOR,
        fontSize: 10,
        lineHeight: 10,
    },
    headerQuickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    quickActionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        width: width / 3.5,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    quickActionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    quickActionText: {
        color: '#333',
        fontSize: 12,
        fontWeight: '500',
    },
    headerStyleButton: {
        marginRight: 15,
    },

    // Rest of the styles
    calendarContainer: {
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop: 10,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    calendar: {
        height: 90,
        paddingTop: 10,
        paddingBottom: 10,
    },
    calendarHeader: {
        color: "#333",
        fontSize: 12,
        fontWeight: "600",
    },
    calendarDate: {
        color: "#333",
        fontSize: 14,
    },
    calendarName: {
        color: "#666",
        fontSize: 12,
    },
    calendarHighlightDate: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    calendarHighlightName: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
    calendarDisabledName: {
        color: "#ccc",
        fontSize: 12,
    },
    calendarDisabledNumber: {
        color: "#ccc",
        fontSize: 14,
    },
    highlightDateContainer: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
    },
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        zIndex: 10,
    },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: "#333",
    },
    routesContainer: {
        marginVertical: 10,
    },
    routesList: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    routeChip: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#EEEEEE",
    },
    selectedRouteChip: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
    },
    routeChipText: {
        color: "#333",
        fontWeight: "500",
        fontSize: 14,
    },
    selectedRouteChipText: {
        color: "white",
        fontSize: 14,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    listHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
        letterSpacing: 0.5,
    },
    scheduleCardContainer: {
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
    },
    scheduleCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    scheduleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    routeContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    routeIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    routeText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        letterSpacing: 0.3,
    },
    busNumberText: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    statusIcon: {
        marginRight: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 14,
    },
    scheduleDetails: {
        marginTop: 4,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    detailText: {
        marginLeft: 8,
        fontSize: 13,
        color: "#666",
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    detailButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
    },
    detailButtonText: {
        color: "white",
        fontWeight: "bold",
        marginRight: 5,
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        marginTop: 20,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    emptyButton: {
        marginTop: 20,
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 14,
    },
    emptyButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    optionsMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    optionsOverlay: {
        flex: 1,
    },
    optionsContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
    },
    optionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    optionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    optionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 8,
    },
    optionText: {
        color: '#666',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
    },
    optionTextActive: {
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
    },
});
