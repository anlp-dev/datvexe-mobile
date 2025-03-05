import {Text, TouchableOpacity, StyleSheet} from "react-native";
import React from "react";

const DateItem = ({ date, dayName, isSelected, setSelectedDate }) => (
    <TouchableOpacity
        onPress={() => setSelectedDate(date)}
        style={[
            styles.dateItem,
            isSelected && styles.selectedDateItem
        ]}
    >
        <Text style={[
            styles.dateNumber,
            isSelected && styles.selectedDateText
        ]}>{date}</Text>
        <Text style={[
            styles.dateIndex,
            isSelected && styles.selectedDateText
        ]}>{dayName}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
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
})

export default DateItem;