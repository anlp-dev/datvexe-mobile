import React from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import ActionSheet from "react-native-actions-sheet";

const ActionSheetLocation = ({actionSheetRefLocation, currentLocationType, dataLocation, selectLocation}) => {
    const renderLocationItem = ({item}) => {
        return (
            <View>
                <Text style={styles.cityHeader}>{item.tenTinh}</Text>
                {
                    item.benXe.map((station) => (
                        <TouchableOpacity
                            key={station._id || Math.random().toString()}
                            style={styles.stationItem}
                            onPress={() => selectLocation(station)}
                        >
                            <Text style={styles.stationText}>{station.tenBenXe}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        );
    };

    return (
        <ActionSheet ref={actionSheetRefLocation} gestureEnabled={true}>
            <View style={{height: 300}}>  {/* Thêm chiều cao để đảm bảo hiển thị */}
                <Text style={styles.locationActionSheetTitle}>
                    {currentLocationType === "start" ? "Chọn điểm xuất phát" : "Chọn điểm đến"}
                </Text>
                <FlatList
                    data={dataLocation}
                    renderItem={renderLocationItem}
                    keyExtractor={(item) => item._id || Math.random().toString()}
                    style={styles.locationList}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </ActionSheet>
    )
}

const styles = StyleSheet.create({
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
})

export default ActionSheetLocation;