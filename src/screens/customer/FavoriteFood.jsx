import { View, Text, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const FavoritFood = () => {

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productCImage}>
        <Image source={item.image} style={styles.productImage} />
      </View>
      <View style={styles.productText}>
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
      </View>
      <View style={styles.productFooter}>
        <Text style={styles.rating}>⭐ {item.rating}</Text> 
        <Ionicons name="heart" size={20} color="gray" />
        <Ionicons name="cart-outline" size={20} color="gray" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Foodgo</Text>
        <Image source={require('../../assets/image_customer/Chi.png')} style={styles.profileImage} />
      </View>
      <Text style={styles.subtitle}>Order your favourite food!</Text>

      {/* Search and Notifications */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        {['All', 'Burger', 'Pizza'].map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Text>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product List */}
      <FlatList
        data={foodItems}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Hiển thị 2 cột
        columnWrapperStyle={styles.productGrid} // Căn chỉnh khoảng cách giữa các cột
        renderItem={renderItem}
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn
      />
    </View>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', color: '#333' },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  subtitle: { fontSize: 18, color: '#666' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  searchInput: { flex: 1, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8 },
  iconButton: { marginLeft: 12, padding: 8, backgroundColor: '#E9D5FF', borderRadius: 8 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  categoryButton: { backgroundColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  productGrid: { justifyContent: 'space-between', paddingHorizontal: 10 },

  productCard: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 5, 
    width: '48%', 
    marginBottom: 16 
  },

  productCImage: { alignItems: 'center', marginBottom: 10 },
  productImage: { width: 100, height: 100, resizeMode: 'contain' },
  productText: { alignItems: 'center' },
  productTitle: { fontSize: 16, fontWeight: 'bold'},
  productDescription: { color: '#666' },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  rating: { color: '#FBBF24' }
};

const foodItems = [
  { name: 'Cheeseburger', description: "Wendy's Burger", rating: 4.9, image: require('../../assets/Cheeseburger.png') },
  { name: 'Pizza', description: "Veggie Pizza", rating: 4.8, image: require('../../assets/Cheeseburger.png') },
  { name: 'Hamburger', description: "Chicken Burger", rating: 4.6, image: require('../../assets/chicken_burger.png') },
  { name: 'Pizza', description: "Vegetable Pizza", rating: 4.5, image: require('../../assets/chicken_burger.png') },
  { name: 'Cheeseburger', description: "Wendy's Burger", rating: 4.9, image: require('../../assets/Cheeseburger.png') },
  { name: 'Pizza', description: "Veggie Pizza", rating: 4.8, image: require('../../assets/Cheeseburger.png') }
];

export default FavoritFood;
