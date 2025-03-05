import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import React from "react";

const ActionSheetPickPassenger = ({actionSheetPassenger, decreasePassenger, passengerCnt, increasePassenger}) => {
  return (
      <ActionSheet ref={actionSheetPassenger} gestureEnabled={true}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.passengerTitle}>Số lượng người:</Text>
          <View style={styles.passengerControls}>
            <TouchableOpacity
                style={styles.passengerButton}
                onPress={decreasePassenger}
            >
              <Text style={styles.passengerButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.passengerCnt}>{passengerCnt}</Text>
            <TouchableOpacity
                style={styles.passengerButton}
                onPress={increasePassenger}
            >
              <Text style={styles.passengerButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
  )
}

const styles = StyleSheet.create({
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
})

export default ActionSheetPickPassenger;
