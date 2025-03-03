import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { useRoute, useNavigation } from '@react-navigation/native';

const ProductDetailScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { item } = route.params;

return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/chicken_burger.png')} style={styles.productImage} resizeMode="contain" />
      </View>
      
      {/* Product Info */}
      <Text style={styles.productTitle}>Chicken Humberger</Text>
      <Text style={styles.productRating}>⭐ 4.8 - 26 mins</Text>
      <Text style={styles.productDescription}>The Cheeseburger Wendy's Burger is a classic fast food burger that packs a punch of flavor in every bite. Made with a juicy beef patty cooked to perfection, it's topped with melted American cheese, crispy lettuce, ripe tomato, and crunchy pickles.</Text>
      
      {/* Portion Selector */}
      <View style={styles.portionContainer}>
        <Text style={styles.portionText}>Portion</Text>
        <View style={styles.portionControls}>
          <TouchableOpacity style={styles.portionButton}>
            <Text style={styles.portionButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.portionValue}>2</Text>
          <TouchableOpacity style={styles.portionButton}>
            <Text style={styles.portionButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Order Button */}
      <View style={styles.footer}>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>$8.24</Text>
        </View>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>ORDER NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
    container: { flex: 1, backgroundColor: 'white', padding: 16 },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
    imageContainer: { alignItems: 'center', marginTop: 60 },
    productImage: { width: 250, height: 250 },
    productTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 16 },
    productRating: { fontSize: 16, color: '#666', marginTop: 4 },
    productDescription: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'justifyContent', paddingHorizontal: 20 },
    portionContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
    portionText: { fontSize: 16, fontWeight: 'bold' },
    portionControls: { flexDirection: 'row', alignItems: 'center' },
    portionButton: { backgroundColor: '#EADDFF', padding: 8, borderRadius: 8 },
    portionButtonText: { fontSize: 20, color: '#7C3AED' },
    portionValue: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 10 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 },
    priceTag: { backgroundColor: '#EADDFF', padding: 12, borderRadius: 10 },
    priceText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    orderButton: { backgroundColor: '#648DDB', padding: 12, borderRadius: 10, flex: 1, alignItems: 'center', marginLeft: 20, },
    orderButtonText: { fontSize: 16, fontWeight: 'bold', color: 'white' }
  };
  

export default ProductDetailScreen;
