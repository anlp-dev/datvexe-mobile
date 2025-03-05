import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const HistoryScreen = ({route}) => {
  // const [tab, setTab] = useState('tickets'); // 'tickets' | 'orders'
  const tab = route.params.tabSelected;
  
  // Dữ liệu giả cho Tickets
  const ticketsHistory = [
    { id: '1', title: 'Vé số 1', details: 'Thông tin vé số 1' },
    { id: '2', title: 'Vé số 2', details: 'Thông tin vé số 2' },
    { id: '3', title: 'Vé số 3', details: 'Thông tin vé số 3' },
  ];

  // Dữ liệu giả cho Orders
  const ordersHistory = [
    { id: '1', title: 'Đơn hàng 1', details: 'Thông tin đơn hàng 1' },
    { id: '2', title: 'Đơn hàng 2', details: 'Thông tin đơn hàng 2' },
    { id: '3', title: 'Đơn hàng 3', details: 'Thông tin đơn hàng 3' },
  ];

  // Hàm render Item cho FlatList
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDetails}>{item.details}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Content */}
      <FlatList
        data={tab === 'bookings' ? ticketsHistory : ordersHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    alignItems: 'center',
    padding: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF6347',
  },
  activeTabText: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDetails: {
    fontSize: 14,
    color: '#555',
  },
});

export default HistoryScreen;
