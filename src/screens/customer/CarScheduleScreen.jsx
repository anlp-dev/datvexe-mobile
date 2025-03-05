import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useState, useMemo, useEffect, useRef} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {TYPE_BUS} from "../../enums/EnumsType";
import DateItem from "../../components/specific/booking/DateItem";
import {formatDate} from "../../utils/format";

const CarScheduleScreen = ({navigation}) => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [type, setType] = useState();
  const scrollViewRef = useRef(null);
  const route = useRoute();
  const dataSchedule = route?.params.dataSchedule;

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      const itemWidth = 61; // 45(minWidth) + 16(marginHorizontal)
      const scrollPosition = (currentDate.getDate() - 1) * itemWidth;

      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          x: scrollPosition,
          animated: true
        });
      }, 100);
    }
  }, []);

  const dates = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = getDaysInMonth(year, month);

    return Array.from({ length: totalDays }, (_, i) => ({
      date: i + 1,
      dayName: new Date(year, month, i + 1).toLocaleDateString('vi-VN', { weekday: 'short' })
    }));
  }, []);

  const renderScheduleItem = ({ item: schedule }) => (
      <TouchableOpacity onPress={() => navigation.navigate("SeatSelectionScreen", {busType: schedule.busOperator.types.code, dataSchedule: schedule})}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.companyName}>
                {schedule.busOperator.name} - {TYPE_BUS.find(t => t.code === schedule.busOperator.types.code)?.name}
              </Text>
              <Text style={styles.routeName}>{schedule.route}</Text>
              <View style={styles.typeContainer}>
                <Text style={styles.typeText}>{schedule.tripCode}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.seatsText}>{schedule.availableSeats} chỗ trống</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.normalPrice}>
                {schedule.price.toLocaleString()}đ
              </Text>
              <Text style={styles.vatText}>đã bao gồm VAT</Text>
            </View>
          </View>

          <View style={styles.timelineContainer}>
            <View style={styles.timeline}>
              <View style={styles.timelinePoint}>
                <View style={styles.timelineDot} />
                <View>
                  <Text style={styles.timeText}>{formatDate(schedule.timeStart)}</Text>
                  <Text style={styles.locationText}>
                    {schedule.benXeKhoiHanh.tenBenXe}
                  </Text>
                </View>
              </View>
              <View style={styles.timelineLine} />
              <View style={styles.timelinePoint}>
                <View style={styles.timelineDot} />
                <View>
                  <Text style={styles.timeText}>{formatDate(schedule.timeEnd)}</Text>
                  <Text style={styles.locationText}>
                    {schedule.benXeDichDen.tenBenXe}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.durationText}>{schedule.timeRoute}h</Text>
          </View>
        </View>
      </TouchableOpacity>
  );

  const ListHeader = () => (
      <View style={styles.headerWrapper}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>
            {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        <ScrollView
            ref={scrollViewRef}
            horizontal
            style={styles.datePicker}
            showsHorizontalScrollIndicator={false}
        >
          {dates.map(({ date, dayName }) => (
              <DateItem
                  key={date}
                  date={date}
                  dayName={dayName}
                  isSelected={selectedDate === date}
                  setSelectedDate={setSelectedDate}
              />
          ))}
          <TouchableOpacity style={styles.calendarButton}>
            <Icon name="calendar" size={24} color="#000" />
          </TouchableOpacity>
        </ScrollView>
      </View>
  );

  return (
      <SafeAreaView style={styles.container}>
        <ListHeader/>
        <FlatList
            data={dataSchedule}
            renderItem={renderScheduleItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.scheduleList}
        />

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={styles.bottomNavText}>Giờ xuất bến</Text>
            <Icon name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={styles.bottomNavText}>Giá</Text>
            <Icon name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={[styles.bottomNavText, styles.promoText]}>
              Khuyến mãi
            </Text>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="options" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerWrapper: {
    height: 115,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  monthHeader: {
    padding: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFC107",
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "500",
  },
  datePicker: {
    height: 0,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dateItem: {
    alignItems: "center",
    marginHorizontal: 8,
    minWidth: 45,
    padding: 8,
    borderRadius: 8,
  },
  selectedDateItem: {
    backgroundColor: '#FFA07A',
  },
  dateNumber: {
    fontSize: 16,
    marginBottom: 4,
  },
  dateIndex: {
    fontSize: 12,
    color: "#666",
  },
  selectedDateText: {
    color: '#FFF',
    fontWeight: '500',
  },
  calendarButton: {
    marginLeft: 8,
    justifyContent: "center",
  },
  scheduleList: {
    padding: 16,
    paddingTop: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "500",
  },
  routeName: {
    fontSize: 14,
    color: "#666",
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  typeText: {
    fontSize: 14,
  },
  dot: {
    marginHorizontal: 4,
  },
  seatsText: {
    fontSize: 14,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  normalPrice: {
    color: "#FFC107",
    fontSize: 16,
    fontWeight: "500",
  },
  vatText: {
    fontSize: 12,
    color: "#666",
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeline: {
    flex: 1,
  },
  timelinePoint: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineLine: {
    width: 1,
    height: 16,
    backgroundColor: "#DDD",
    marginLeft: 4,
    marginVertical: 4,
  },
  timelineDot: {
    marginHorizontal: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    marginTop: 6,
    marginRight: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  durationText: {
    fontSize: 14,
    color: "#666",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  bottomNavItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomNavText: {
    marginRight: 4,
    fontSize: 14,
  },
  promoText: {
    color: "#FF4444",
  },
  promoBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  promoBadgeText: {
    color: "white",
    fontSize: 12,
  },
});

export default CarScheduleScreen;