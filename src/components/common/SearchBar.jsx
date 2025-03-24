import React from "react";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from "@react-navigation/native";

const SearchBar = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate("LocationScreen")}>
            <Icon name="search" size={24} color="black"/>
            <TextInput
                style={styles.searchInput}
                placeholder="Bạn muốn đi đâu?"
                placeholderTextColor="black"
                editable={false}
            />
        </TouchableOpacity>
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
