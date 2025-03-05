import ActionSheet from "react-native-actions-sheet";
import {View, Text, StyleSheet} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const ActionSheetPickDate = ({actionSheetRef, date, onChange}) => {
  return (
      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.title}>Chọn ngày</Text>
          <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
          />
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
})

export default ActionSheetPickDate;
