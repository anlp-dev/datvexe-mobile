import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartProductScreen = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Cheeseburger', description: "Wendy's Burger", price: 26.99, quantity: 4, image: require('../../assets/Cheeseburger.png') },
    { id: 2, name: 'Pizza', description: "Veggie Pizza", price: 9, quantity: 1, image: require('../../assets/pizza.png') },
    { id: 3, name: 'Vegetable Pizza', description: "Vegetable Pizza", price: 12, quantity: 2, image: require('../../assets/Cheeseburger.png') },
    
  ]);

  // Hàm tăng số lượng sản phẩm
  const increaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Hàm giảm số lượng sản phẩm, nếu về 0 thì xóa khỏi giỏ hàng
  const decreaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems
        .map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0) // Loại bỏ sản phẩm nếu quantity = 0
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={styles.portionControls}>
        <TouchableOpacity style={styles.portionButton} onPress={() => decreaseQuantity(item.id)}>
          <Text style={styles.portionButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.portionValue}>{item.quantity}</Text>
        <TouchableOpacity style={styles.portionButton} onPress={() => increaseQuantity(item.id)}>
          <Text style={styles.portionButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Foodgo</Text>
        <Image source={require('../../assets/image_customer/Chi.png')} style={styles.profileImage} />
      </View>
      <Text style={styles.subtitle}>Order in your Cart!</Text>

      {/* Cart Title */}
      <View style={styles.cartHeader}>
        <Text style={styles.cartTitle}>Your cart</Text>
        <Ionicons name="cart" size={24} color="black" />
      </View>

      {/* Cart List */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }} // Tránh che phủ nội dung cuối
      />

      {/* Order Button */}
      <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderButtonText}>ORDER NOW</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', fontStyle: 'italic', color: '#333' },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  subtitle: { fontSize: 18, color: '#666', marginTop: 8 },
  cartHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingBottom:50 },
  cartTitle: { fontSize: 24, fontWeight: 'bold', fontStyle: 'italic' },

  cartItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F4F6', 
    padding: 10, 
    borderRadius: 12, 
    marginTop: 10 
  },
  itemImage: { width: 50, height: 50, borderRadius: 10 },
  itemDetails: { flex: 1, marginLeft: 10 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemDescription: { fontSize: 14, color: '#666' },

  portionControls: { flexDirection: 'row', alignItems: 'center', width: '20%' },
  portionButton: { backgroundColor: '#648DDB', padding: 8, borderRadius: 8 },
  portionButtonText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  portionValue: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 10 },

  itemPrice: { fontSize: 14, fontWeight: 'bold', marginLeft: 10, width: '15%' },

  orderButton: { 
    backgroundColor: '#648DDB', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 20 
  },
  orderButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' }
};

export default CartProductScreen;
