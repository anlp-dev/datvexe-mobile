import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TextInput,
    FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import ActionSheet from "react-native-actions-sheet";
import {useRoute} from "@react-navigation/native";
import TripService from "../../service/trip/TripService";
import {showCustomToast} from "../../components/common/notifice/CustomToast";
import ActionSheetLocation from "../../components/specific/locationScr/actionsheet/ActionSheetLocation";
import ActionSheetPickDate from "../../components/specific/locationScr/actionsheet/ActionSheetPickDate";
import ActionSheetPickPassenger from "../../components/specific/locationScr/actionsheet/ActionSheetPickPassenger";
import {Button} from 'react-native-paper';

const LocationScreen = ({navigation}) => {
    const currentDate = new Date();
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [dataLocation, setDataLocation] = useState([]);
    const actionSheetRefLocation = useRef(null);
    const actionSheetRef = useRef(null);
    const actionSheetPassenger = useRef(null);
    const [passenger, setPassenger] = useState(1);
    const [passengerCnt, setPassengerCnt] = useState(passenger);
    const [locationStart, setLocationStart] = useState(null);
    const [locationEnd, setLocationEnd] = useState(null);
    const [currentLocationType, setCurrentLocationType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TripService.loadDiaDiem();
                setDataLocation(response.data);
            } catch (e) {
                showCustomToast(e.message);
            }
        };
        fetchData();
    }, []);

    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
        actionSheetRef.current?.hide();
    };

    const increasePassenger = () => {
        setPassengerCnt(passengerCnt + 1);
    };

    const decreasePassenger = () => {
        if (passengerCnt > 1) {
            setPassengerCnt(passengerCnt - 1);
        }
    };

    const handleLocationSelect = (locationType) => {
        setCurrentLocationType(locationType);
        actionSheetRefLocation.current?.show();
    };

    const selectLocation = (location) => {
        if (currentLocationType === "start") {
            setLocationStart(location);
        } else {
            setLocationEnd(location);
        }
        actionSheetRefLocation.current?.hide();
    };

    const handleCarSchedule = async () => {
        try {
            const benXeKhoiHanh = locationStart.maBenXe;
            const benXeDichDen = locationEnd.maBenXe;
            const dataReq = {benXeKhoiHanh, benXeDichDen, date, passengerCnt};
            const resData = await TripService.loadSchedule(dataReq);
            if (resData.status === 200) {
                setData(resData.data);
                showCustomToast(resData.message, "success")
                setIsLoading(true);
                navigation.navigate("CarScheduleScreen", {dataSchedule: resData.data});
            } else {
                showCustomToast("Loi khi lay du lieu !", "error")
            }
        } catch (e) {
            showCustomToast(e.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Pickup Location */}
                <TouchableOpacity
                    style={styles.locationItem}
                    onPress={() => handleLocationSelect("start")}
                >
                    <View style={styles.locationContent}>
                        <Icon name="radio-button-checked" size={24} color="#000"/>
                        <View style={styles.locationTextContainer}>
                            <Text style={styles.locationText}>
                                {locationStart ? locationStart.tenBenXe :  "Chọn điểm xuất phát"}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Drop-off Location */}
                <TouchableOpacity
                    style={styles.locationItem}
                    onPress={() => handleLocationSelect("end")}
                >
                    <View style={styles.locationContent}>
                        <Icon name="location-on" size={24} color="#000"/>
                        <View style={styles.locationTextContainer}>
                            <Text style={styles.locationText}>
                                {locationEnd ? locationEnd.tenBenXe : "Chọn điểm đến"}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <ActionSheetLocation actionSheetRefLocation={actionSheetRefLocation}
                                     currentLocationType={currentLocationType}
                                     dataLocation={dataLocation}
                                     selectLocation={selectLocation}/>

                {/* Rest of the component remains the same */}
                <TouchableOpacity
                    style={styles.dateItem}
                    onPress={() => actionSheetRef.current?.show()}
                >
                    <Icon name="event" size={24} color="#000"/>
                    <TextInput
                        style={styles.dateText}
                        value={
                            date.toISOString().split("T")[0] ===
                            currentDate.toISOString().split("T")[0]
                                ? "Ngày hôm nay"
                                : date.toISOString().split("T")[0]
                        }
                        editable={false}
                    />
                </TouchableOpacity>

                <ActionSheetPickDate actionSheetRef={actionSheetRef}
                                     date={date}
                                     onChange={onChange}/>

                <TouchableOpacity
                    style={styles.passengerItem}
                    onPress={() => actionSheetPassenger.current?.show()}
                >
                    <Icon name="person" size={24} color="#000"/>
                    <Text style={styles.passengerText}>{passengerCnt}</Text>
                </TouchableOpacity>

                <ActionSheetPickPassenger actionSheetPassenger={actionSheetPassenger}
                                          decreasePassenger={decreasePassenger}
                                          passengerCnt={passengerCnt}
                                          increasePassenger={increasePassenger}/>

                <Button
                    style={styles.searchButton}
                    onPress={handleCarSchedule}
                    loading={isLoading}
                >
                    <Text style={styles.searchButtonText}>Tìm kiếm</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 16,
    },
    locationItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    locationContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    locationTextContainer: {
        marginLeft: 16,
    },
    locationText: {
        fontSize: 16,
    },
    dateItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    dateText: {
        marginLeft: 16,
        fontSize: 16,
        color: "#000",
    },
    passengerItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    passengerText: {
        marginLeft: 16,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: "#FFA07A",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 24,
    },
    searchButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    actionSheetContent: {
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    passengerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    passengerControls: {
        flexDirection: "row",
        alignItems: "center",
    },
    passengerButton: {
        backgroundColor: "#FFA07A",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 20,
    },
    passengerButtonText: {
        fontSize: 20,
        color: "#fff",
    },
    passengerCnt: {
        fontSize: 20,
        marginHorizontal: 10,
    },
    locationActionSheet: {
        padding: 100,
    },
    locationActionSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    locationList: {
        flex: 1,
    },
    locationGroup: {
        marginBottom: 30,
    },
    cityHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    stationItem: {
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    stationText: {
        fontSize: 16,
        color: '#333',
    },
});

export default LocationScreen;
