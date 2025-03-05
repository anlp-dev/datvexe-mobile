import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CalendarStrip from "react-native-calendar-strip";

export default function DriverHomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trips, setTrips] = useState({
    "2025-01-30": [
      {
        id: "1",
        route: "Hà Nội - Đà Nẵng",
        departureTime: "07:00",
        status: "Sắp khởi hành",
        busNumber: "BS-123",
        passengers: 32,
        cargo: "500kg",
      },
      {
        id: "2",
        route: "Hà Nội - Hải Phòng",
        departureTime: "13:30",
        status: "Chưa khởi hành",
        busNumber: "BS-456",
        passengers: 28,
        cargo: "350kg",
      },
    ],
    "2025-01-31": [
      {
        id: "3",
        route: "Hà Nội - Sài Gòn",
        departureTime: "08:00",
        status: "Sắp khởi hành",
        busNumber: "BS-789",
        passengers: 40,
        cargo: "600kg",
      },
    ],
  });

  const getCurrentTrips = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    return trips[dateKey] || [];
  };

  const getTotalStats = () => {
    const currentTrips = getCurrentTrips();
    return {
      trips: currentTrips.length,
      passengers: currentTrips.reduce((sum, trip) => sum + trip.passengers, 0),
      cargo: currentTrips.reduce((sum, trip) => sum + parseInt(trip.cargo), 0),
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Sắp khởi hành":
        return "#28a745";
      case "Chưa khởi hành":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const renderTripItem = ({ item }) => (
    <TouchableOpacity style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.routeContainer}>
          <View style={styles.routeIconContainer}>
            <Ionicons name="bus" size={24} color="#FF6B00" />
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

      <View style={styles.tripDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="people" size={24} color="#FF6B00" />
            <Text style={styles.detailText}>{item.passengers} Hành khách</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cube" size={24} color="#FF6B00" />
            <Text style={styles.detailText}>{item.cargo} Hàng</Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.timeWrapper}>
            <Ionicons name="time" size={20} color="#FF6B00" />
            <Text style={styles.timeText}>{item.departureTime}</Text>
          </View>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Chi tiết</Text>
            <Ionicons name="chevron-forward" size={16} color="#FF6B00" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const stats = getTotalStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Chào, Lái Xe</Text>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={28} color="white" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
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
        maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 ngày từ hiện tại
        dayComponentHeight={80}
        customDatesStyles={[
          {
            startDate: selectedDate,
            dateContainerStyle: { backgroundColor: "#FFF3E0" },
          },
        ]}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="bus" size={24} color="#FF6B00" />
            <Text style={styles.statText}>{stats.trips} Chuyến</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people" size={24} color="#FF6B00" />
            <Text style={styles.statText}>{stats.passengers} Hành khách</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="cube" size={24} color="#FF6B00" />
            <Text style={styles.statText}>{stats.cargo}kg Hàng</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={getCurrentTrips()}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.listHeader}>Lịch Trình Của Bạn</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#FF6B00" />
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
    backgroundColor: "#FF6B00",
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
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: "#FF0000",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FF6B00",
  },
  calendar: {
    height: 100,
    paddingTop: 20,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: "#FF6B00",
  },
  calendarDate: {
    color: "#444",
  },
  calendarName: {
    color: "#444",
  },
  calendarHighlightDate: {
    color: "#FF6B00",
  },
  calendarHighlightName: {
    color: "#FF6B00",
  },
  calendarDisabledName: {
    color: "#AAA",
  },
  calendarDisabledNumber: {
    color: "#AAA",
  },
  statsContainer: {
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E9ECEF",
    marginHorizontal: 10,
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#444",
  },
  tripCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeIconContainer: {
    backgroundColor: "#FFF3E0",
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  busNumberText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tripDetails: {
    padding: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B00",
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  detailButtonText: {
    color: "#FF6B00",
    fontWeight: "600",
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
