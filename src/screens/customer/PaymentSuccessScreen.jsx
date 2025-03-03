import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentSuccessScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="checkmark-circle" size={64} color="green" />
        <Text style={styles.successText}>Success !</Text>
        <Text style={styles.description}>
          Your payment was successful. A receipt for this purchase has
          been sent to your email.
        </Text>
        <TouchableOpacity style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  card: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  goBackButton: {
    backgroundColor: '#E0C3FC',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
};

export default PaymentSuccessScreen;
