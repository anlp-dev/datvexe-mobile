import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
      <Icon name="search" size={24} color="black" />
      <TextInput
        style={styles.searchInput}
        placeholder="Bạn muốn đi đâu?"
        placeholderTextColor="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
  },
})

export default SearchBar;
