import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SEAT_LAYOUT } from "../../enums/SeatLayout";

// Component for rendering a single seat
const SeatItem = ({ seat, status, isSelected, passenger, onPress }) => {
  const { id, price } = seat;

  let seatStyle = styles.seat;
  let textStyle = styles.seatText;
  let iconName = "square-outline";
  let iconColor = "#333";

  if (status === "paid") {
    seatStyle = styles.paidSeat;
    textStyle = styles.paidSeatText;
    iconName = "checkmark-circle";
    iconColor = "#fff";
  } else if (status === "unpaid") {
    seatStyle = styles.unpaidSeat;
    textStyle = styles.unpaidSeatText;
    iconName = "time";
    iconColor = "#FF7F50";
  }

  if (isSelected) {
    seatStyle = { ...seatStyle, ...styles.selectedSeat };
  }

  return (
    <TouchableOpacity
      key={id}
      style={[styles.seatContainer, seatStyle]}
      onPress={onPress}
      disabled={status === "available"}
    >
      <View style={styles.seatContent}>
        <Text style={[styles.seatId, textStyle]}>{id}</Text>
        <Text style={[styles.seatPrice, textStyle]}>{price}K</Text>
      </View>
      
      {passenger && (
        <View style={styles.passengerIndicator}>
          <Ionicons
            name="person"
            size={14}
            color={status === "paid" ? "#fff" : "#333"}
          />
        </View>
      )}
      
      <View style={styles.seatStatusIndicator}>
        <Ionicons name={iconName} size={16} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

// Component for trip information header
const TripInfoHeader = ({ trip }) => {
  return (
      <View style={styles.tripInfoContainer}>
        <View style={styles.tripHeader}>
          <View style={styles.routeContainer}>
            <Ionicons name="bus" size={24} color="#FFA07A" />
            <Text style={styles.routeText}>{trip.route}</Text>
          </View>
          <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                      trip.status === "Sắp khởi hành"
                          ? "#FFA07A"
                          : trip.status === "Chưa khởi hành"
                              ? "#FFB999"
                              : "#FFC8B4",
                },
              ]}
          >
            <Text style={styles.statusText}>{trip.status}</Text>
          </View>
        </View>

        <View style={styles.tripDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={20} color="#FFA07A" />
            <Text style={styles.detailText}>
              Giờ khởi hành: {trip.departureTime}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="car" size={20} color="#FFA07A" />
            <Text style={styles.detailText}>Xe: {trip.busNumber}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="person" size={20} color="#FFA07A" />
            <Text style={styles.detailText}>Tài xế: {trip.driver}</Text>
          </View>
        </View>
      </View>
  );
};

// Component for seat map legend
const SeatMapLegend = () => {
  return (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Chú thích:</Text>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendBox}>
            <Ionicons name="square-outline" size={16} color="#333" />
          </View>
          <Text style={styles.legendText}>Trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.paidLegendBox]}>
            <Ionicons name="checkmark-circle" size={16} color="#fff" />
          </View>
          <Text style={styles.legendText}>Đã thanh toán</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.unpaidLegendBox]}>
            <Ionicons name="time" size={16} color="#FF7F50" />
          </View>
          <Text style={styles.legendText}>Chưa thanh toán</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.selectedLegendBox]}>
            <Ionicons name="checkmark-done-circle" size={16} color="#FF5722" />
          </View>
          <Text style={styles.legendText}>Đang chọn</Text>
        </View>
      </View>
    </View>
  );
};

// Component for floor selection
const FloorSelector = ({ currentFloor, onFloorChange }) => {
  return (
    <View style={styles.floorSelectorContainer}>
      <Text style={styles.floorSelectorTitle}>Chọn tầng:</Text>
      <View style={styles.floorSelection}>
        <TouchableOpacity
          style={[
            styles.floorButton,
            currentFloor === 1 && styles.activeFloorButton,
          ]}
          onPress={() => onFloorChange(1)}
        >
          <Ionicons 
            name={currentFloor === 1 ? "layers" : "layers-outline"} 
            size={18} 
            color={currentFloor === 1 ? "white" : "#333"} 
          />
          <Text
            style={[
              styles.floorButtonText,
              currentFloor === 1 && styles.activeFloorButtonText,
            ]}
          >
            Tầng 1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.floorButton,
            currentFloor === 2 && styles.activeFloorButton,
          ]}
          onPress={() => onFloorChange(2)}
        >
          <Ionicons 
            name={currentFloor === 2 ? "layers" : "layers-outline"} 
            size={18} 
            color={currentFloor === 2 ? "white" : "#333"} 
          />
          <Text
            style={[
              styles.floorButtonText,
              currentFloor === 2 && styles.activeFloorButtonText,
            ]}
          >
            Tầng 2
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Component for passenger item
const PassengerItem = ({ passenger, onPaymentStatusChange }) => {
  return (
      <View style={styles.passengerCard}>
        <View style={styles.passengerHeader}>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{passenger.name}</Text>
            <Text style={styles.passengerPhone}>{passenger.phone}</Text>
          </View>
          <View style={styles.seatBadge}>
            <Text style={styles.seatBadgeText}>{passenger.seatId}</Text>
          </View>
        </View>
        <View style={styles.passengerFooter}>
          <View
              style={[
                styles.paymentStatusBadge,
                passenger.paymentStatus === "paid"
                    ? styles.paidStatusBadge
                    : styles.unpaidStatusBadge,
              ]}
          >
            <Text
                style={[
                  styles.paymentStatusText,
                  passenger.paymentStatus === "paid"
                      ? styles.paidStatusText
                      : styles.unpaidStatusText,
                ]}
            >
              {passenger.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </Text>
          </View>
          {passenger.paymentStatus === "unpaid" && (
              <TouchableOpacity
                  style={styles.paymentButton}
                  onPress={() => onPaymentStatusChange(passenger.id)}
              >
                <Text style={styles.paymentButtonText}>Xác nhận thanh toán</Text>
              </TouchableOpacity>
          )}
        </View>
      </View>
  );
};

// Custom ActionSheet component for Android (since ActionSheetIOS is iOS only)
const ActionSheet = ({ visible, options, cancelButtonIndex, onPress, onDismiss }) => {
  if (!visible || Platform.OS === 'ios') return null;

  return (
      <View style={styles.actionSheetContainer}>
        <TouchableOpacity style={styles.actionSheetBackdrop} onPress={onDismiss}>
          <View style={styles.actionSheetContent}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                      styles.actionSheetOption,
                      index === cancelButtonIndex && styles.actionSheetCancelOption,
                    ]}
                    onPress={() => {
                      onPress(index);
                      onDismiss();
                    }}
                >
                  <Text
                      style={[
                        styles.actionSheetOptionText,
                        index === cancelButtonIndex && styles.actionSheetCancelText,
                      ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </View>
  );
};

export default function TicketInspectorTripDetailScreen({ route, navigation }) {
  const { trip } = route.params;
  const [currentFloor, setCurrentFloor] = useState(1);
  const [passengers, setPassengers] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);

  // Load passenger data
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const mockPassengers = [
      {
        id: "1",
        name: "Nguyễn Văn X",
        phone: "0987654321",
        seatId: "1",
        paymentStatus: "paid", // paid, unpaid
      },
      {
        id: "2",
        name: "Trần Thị Y",
        phone: "0912345678",
        seatId: "2",
        paymentStatus: "paid",
      },
      {
        id: "3",
        name: "Lê Văn Z",
        phone: "0909123456",
        seatId: "B1",
        paymentStatus: "unpaid",
      },
      {
        id: "4",
        name: "Phạm Thị W",
        phone: "0978123456",
        seatId: "C2",
        paymentStatus: "paid",
      },
      {
        id: "5",
        name: "Hoàng Văn V",
        phone: "0918765432",
        seatId: "D3",
        paymentStatus: "unpaid",
      },
    ];
    setPassengers(mockPassengers);
  }, []);

  const getPassengerBySeatId = (seatId) => {
    return passengers.find((passenger) => passenger.seatId === seatId);
  };

  const getSeatStatus = (seatId) => {
    const passenger = getPassengerBySeatId(seatId);
    if (!passenger) return "available";
    return passenger.paymentStatus === "paid" ? "paid" : "unpaid";
  };

  const handleSeatPress = (seatId) => {
    const passenger = getPassengerBySeatId(seatId);
    if (passenger) {
      setSelectedSeat(seatId);
      setSelectedPassenger(passenger);

      if (Platform.OS === 'ios') {
        const options = [
          `Tên: ${passenger.name}`,
          `SĐT: ${passenger.phone}`,
          `Ghế: ${passenger.seatId}`,
          `Trạng thái: ${passenger.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}`,
          passenger.paymentStatus === "unpaid" ? "Xác nhận thanh toán" : "",
          "Đóng",
        ].filter(Boolean);

        ActionSheetIOS.showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex: options.length - 1,
              destructiveButtonIndex: passenger.paymentStatus === "unpaid" ? options.length - 2 : undefined,
              title: "Thông tin hành khách",
            },
            (buttonIndex) => {
              if (buttonIndex === options.length - 2 && passenger.paymentStatus === "unpaid") {
                handlePaymentStatusChange(passenger.id);
              }
            }
        );
      } else {
        // For Android, show custom ActionSheet
        setActionSheetVisible(true);
      }
    }
  };

  const handleActionSheetPress = (index) => {
    if (selectedPassenger && selectedPassenger.paymentStatus === "unpaid" && index === 4) {
      handlePaymentStatusChange(selectedPassenger.id);
    }
    setActionSheetVisible(false);
  };

  const handlePaymentStatusChange = (passengerId) => {
    Alert.alert(
        "Xác nhận thanh toán",
        "Bạn có chắc chắn muốn chuyển trạng thái thanh toán của khách hàng này?",
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              setPassengers(
                  passengers.map((p) =>
                      p.id === passengerId
                          ? { ...p, paymentStatus: "paid" }
                          : p
                  )
              );
            },
          },
        ]
    );
  };

  const renderSeat = (seat) => {
    const status = getSeatStatus(seat.id);
    const isSelected = selectedSeat === seat.id;
    const passenger = getPassengerBySeatId(seat.id);

    return (
        <SeatItem
            key={seat.id}
            seat={seat}
            status={status}
            isSelected={isSelected}
            passenger={passenger}
            onPress={() => handleSeatPress(seat.id)}
        />
    );
  };

  const renderFloorSeats = () => {
    if (trip.busType === "BUS20") {
      // Grid layout for BUS20
      return (
          <View style={styles.seatGrid}>
            {SEAT_LAYOUT[trip.busType][currentFloor].map((seat) => renderSeat(seat))}
          </View>
      );
    } else {
      // Enhanced column layout for BUS34
      return (
          <View style={styles.bus34Container}>
            <View style={styles.driverSection}>
              <View style={styles.steeringWheel}>
                <Ionicons name="car" size={24} color="#333" />
              </View>
            </View>
            <View style={styles.seatsContainer}>
              {[1, 2, 3].map((col) => (
                  <View key={col} style={styles.bus34Column}>
                    {SEAT_LAYOUT[trip.busType][currentFloor]
                        .filter((seat) => seat.id.endsWith(col.toString()))
                        .map((seat) => renderSeat(seat))}
                  </View>
              ))}
            </View>
          </View>
      );
    }
  };

  // Prepare ActionSheet options for Android
  const actionSheetOptions = selectedPassenger
      ? [
        `Tên: ${selectedPassenger.name}`,
        `SĐT: ${selectedPassenger.phone}`,
        `Ghế: ${selectedPassenger.seatId}`,
        `Trạng thái: ${selectedPassenger.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}`,
        selectedPassenger.paymentStatus === "unpaid" ? "Xác nhận thanh toán" : "",
        "Đóng",
      ].filter(Boolean)
      : [];

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Trip Info */}
          <TripInfoHeader trip={trip} />

          {/* Seat Map */}
          <View style={styles.seatMapContainer}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="grid-outline" size={24} color="#FF7F50" />
              <Text style={styles.sectionTitle}>Sơ đồ ghế</Text>
            </View>

            {/* Legend */}
            <SeatMapLegend />

            {/* Floor Selection */}
            <FloorSelector
                currentFloor={currentFloor}
                onFloorChange={setCurrentFloor}
            />

            {/* Seat Map */}
            <View style={styles.seatMapWrapper}>{renderFloorSeats()}</View>
          </View>

          {/* Passenger List */}
          <View style={styles.passengerListContainer}>
            <Text style={styles.sectionTitle}>Danh sách hành khách</Text>
            <FlatList
                data={passengers}
                renderItem={({ item }) => (
                    <PassengerItem
                        passenger={item}
                        onPaymentStatusChange={handlePaymentStatusChange}
                    />
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      Không có hành khách nào cho chuyến này
                    </Text>
                  </View>
                }
            />
          </View>
        </ScrollView>

        {/* Custom ActionSheet for Android */}
        <ActionSheet
            visible={actionSheetVisible}
            options={actionSheetOptions}
            cancelButtonIndex={actionSheetOptions.length - 1}
            onPress={handleActionSheetPress}
            onDismiss={() => setActionSheetVisible(false)}
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tripInfoContainer: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  tripDetails: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
  },
  seatMapContainer: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  legendContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  legendBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  paidLegendBox: {
    backgroundColor: "#FFA07A",
    borderColor: "#FF7F50",
  },
  unpaidLegendBox: {
    backgroundColor: "#FFD3C1",
    borderColor: "#FFAB91",
  },
  selectedLegendBox: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#FF5722",
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
  floorSelectorContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  floorSelectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  floorSelection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  floorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    minWidth: 120,
  },
  activeFloorButton: {
    backgroundColor: "#FFA07A",
    borderColor: "#FF7F50",
  },
  floorButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  activeFloorButtonText: {
    color: "white",
  },
  seatMapWrapper: {
    padding: 10,
    marginBottom: 15,
  },
  seatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  column: {
    width: "30%",
  },
  bus34Container: {
    backgroundColor: "#f5f5f9",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  driverSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  steeringWheel: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  bus34Column: {
    width: "30%",
    alignItems: "center",
  },
  seatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  seatContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  seatContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  seat: {
    backgroundColor: "white",
  },
  paidSeat: {
    backgroundColor: "#FFA07A",
    borderColor: "#FF7F50",
  },
  unpaidSeat: {
    backgroundColor: "#FFD3C1",
    borderColor: "#FFAB91",
  },
  selectedSeat: {
    borderWidth: 2,
    borderColor: "#FF5722",
    transform: [{ scale: 1.05 }],
  },
  seatText: {
    color: "#333",
    fontSize: 14,
  },
  paidSeatText: {
    color: "white",
    fontSize: 14,
  },
  unpaidSeatText: {
    color: "#333",
    fontSize: 14,
  },
  seatId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  seatPrice: {
    fontSize: 16,
  },
  passengerIndicator: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  seatStatusIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  passengerListContainer: {
    backgroundColor: "white",
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  passengerCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  passengerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  passengerPhone: {
    fontSize: 14,
    color: "#666",
  },
  seatBadge: {
    backgroundColor: "#FFF0EB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  seatBadgeText: {
    color: "#FFA07A",
    fontWeight: "bold",
    fontSize: 14,
  },
  passengerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  paymentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  paidStatusBadge: {
    backgroundColor: "#FFF0EB",
  },
  unpaidStatusBadge: {
    backgroundColor: "#FFF8E1",
  },
  paymentStatusText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  paidStatusText: {
    color: "#FFA07A",
  },
  unpaidStatusText: {
    color: "#FFB347",
  },
  paymentButton: {
    backgroundColor: "#FFA07A",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  paymentButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  // ActionSheet styles for Android
  actionSheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    justifyContent: "flex-end",
  },
  actionSheetBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  actionSheetContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  actionSheetOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  actionSheetCancelOption: {
    backgroundColor: "#f8f8f8",
  },
  actionSheetOptionText: {
    fontSize: 16,
    color: "#333",
  },
  actionSheetCancelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFA07A",
  },
});
