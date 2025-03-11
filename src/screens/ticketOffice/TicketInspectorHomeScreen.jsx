import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CalendarStrip from "react-native-calendar-strip";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TicketInspectorHomeScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Mock data for routes and schedules
  const [routes] = useState([
    { id: "1", name: "Hà Nội - Đà Nẵng" },
    { id: "2", name: "Hà Nội - Hải Phòng" },
    { id: "3", name: "Hà Nội - Sài Gòn" },
    { id: "4", name: "Hà Nội - Huế" },
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
            onPress: async () => {await AsyncStorage.removeItem("token"); navigation.navigate("Login")}
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
        return "#FFA07A";
      case "Chưa khởi hành":
        return "#ffc107";
      case "Đã khởi hành":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const renderRouteItem = ({ item }) => (
      <TouchableOpacity
          style={[
            styles.routeChip,
            selectedRoute === item.id && styles.selectedRouteChip,
          ]}
          onPress={() => {
            setSelectedRoute(selectedRoute === item.id ? null : item.id);
          }}
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

  const renderScheduleItem = ({ item }) => (
      <TouchableOpacity
          style={styles.scheduleCard}
          onPress={() => navigation.navigate("TicketInspectorTripDetail", { trip: item })}
      >
        <View style={styles.scheduleHeader}>
          <View style={styles.routeContainer}>
            <View style={styles.routeIconContainer}>
              <Ionicons name="bus" size={24} color="#FFA07A" />
            </View>
            <View>
              <Text style={styles.routeText}>{item.route}</Text>
              <Text style={styles.busNumberText}>{item.busNumber}</Text>
            </View>
          </View>
          <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + "20" },
              ]}
          >
            <Text
                style={[styles.statusText, { color: getStatusColor(item.status) }]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="people" size={20} color="#FFA07A" />
              <Text style={styles.detailText}>{item.passengers} Hành khách</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="person" size={20} color="#FFA07A" />
              <Text style={styles.detailText}>{item.driver}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <View style={styles.timeWrapper}>
              <Ionicons name="time" size={20} color="#FFA07A" />
              <Text style={styles.timeText}>{item.departureTime}</Text>
            </View>
            <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigation.navigate("TicketInspectorTripDetail", { trip: item })}
            >
              <Text style={styles.detailButtonText}>Kiểm tra vé</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFA07A" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
  );

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Chào, Soát vé</Text>
              <Text style={styles.dateText}>
                {selectedDate.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications" size={28} color="white" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <CalendarStrip
            scrollable
            style={styles.calendar}
            calendarColor="#FFF"
            calendarHeaderStyle={styles.calendarHeader}
            dateNumberStyle={styles.calendarDate}
            dateNameStyle={styles.calendarName}
            highlightDateNumberStyle={styles.calendarHighlightDate}
            highlightDateNameStyle={styles.calendarHighlightName}
            disabledDateNameStyle={styles.calendarDisabledName}
            disabledDateNumberStyle={styles.calendarDisabledNumber}
            iconContainer={{ flex: 0.1 }}
            onDateSelected={(date) => setSelectedDate(date.toDate())}
            selectedDate={selectedDate}
            useIsoWeekday={false}
            minDate={new Date()}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
            customDatesStyles={[
              {
                startDate: selectedDate,
                dateContainerStyle: { backgroundColor: "#FFF0ED" },
              },
            ]}
        />

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm tuyến, xe, tài xế..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
            ) : null}
          </View>
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

        <FlatList
            data={getCurrentSchedules()}
            renderItem={renderScheduleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
              <Text style={styles.listHeader}>Lịch Trình Xe Chạy</Text>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={48} color="#FFA07A" />
                <Text style={styles.emptyText}>
                  Không có chuyến xe nào trong ngày này
                </Text>
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
    backgroundColor: "#FFA07A",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  dateText: {
    color: "white",
    fontSize: 16,
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
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  calendar: {
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: "#000",
    fontSize: 12,
  },
  calendarDate: {
    color: "#000",
    fontSize: 12,
  },
  calendarName: {
    color: "#000",
    fontSize: 12,
  },
  calendarHighlightDate: {
    color: "#FFA07A",
    fontWeight: "bold",
    fontSize: 12,
  },
  calendarHighlightName: {
    color: "#FFA07A",
    fontWeight: "bold",
    fontSize: 12,
  },
  calendarDisabledName: {
    color: "#ccc",
    fontSize: 12,
  },
  calendarDisabledNumber: {
    color: "#ccc",
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  routesContainer: {
    marginBottom: 10,
  },
  routesList: {
    paddingHorizontal: 15,
  },
  routeChip: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedRouteChip: {
    backgroundColor: "#FFA07A",
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
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  scheduleCard: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF0ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  busNumberText: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  scheduleDetails: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0ED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  detailButtonText: {
    color: "#FFA07A",
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
