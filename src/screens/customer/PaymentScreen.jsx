import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, CheckBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = () => {
    const [selectedMethod, setSelectedMethod] = useState('credit');
    const [saveCard, setSaveCard] = useState(false);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order summary</Text>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Order Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Order</Text>
                    <Text style={styles.summaryText}>$16.48</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Taxes</Text>
                    <Text style={styles.summaryText}>$0.3</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Delivery fees</Text>
                    <Text style={styles.summaryText}>$1.5</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalAmount}>$18.19</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.deliveryTime}>Estimated delivery time:</Text>
                    <Text style={styles.deliveryTime}>15 - 30mins</Text>
                </View>
            </View>

            {/* Payment Methods */}
            <Text style={styles.paymentTitle}>Payment methods</Text>
            <TouchableOpacity style={[styles.paymentMethod, selectedMethod === 'credit' && styles.selectedMethod]} onPress={() => setSelectedMethod('credit')}>
                <Image source={require('../../assets/Mastercard-logo.svg')} style={styles.cardImage} />
                <Text style={styles.cardText}>Credit card 5105 **** **** 0505</Text>
                <Ionicons name={selectedMethod === 'credit' ? "radio-button-on" : "radio-button-off"} size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.paymentMethod, selectedMethod === 'debit' && styles.selectedMethod]} onPress={() => setSelectedMethod('debit')}>
                <Image source={require('../../assets/Visa-Logo.png')} style={styles.cardImage} />
                <Text style={styles.cardText}>Debit card 3566 **** **** 0505</Text>
                <Ionicons name={selectedMethod === 'debit' ? "radio-button-on" : "radio-button-off"} size={24} color="black" />
            </TouchableOpacity>

            {/* Save Card Checkbox */}
            <View style={styles.checkboxContainer}>
                <CheckBox value={saveCard} onValueChange={setSaveCard} />
                <Text style={styles.checkboxText}>Save card details for future payments</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.finalPrice}>Total price: <Text style={styles.totalPrice}>$18.19</Text></Text>
                <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payButtonText}>Pay Now</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    summaryContainer: { marginBottom: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    summaryText: { fontSize: 16, color: '#666' },
    priceText: { fontWeight: 'bold', flexDirection: 'row', justifyContent: 'space-between', },
    totalText: { fontSize: 18, fontWeight: 'bold', marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', },
    totalPrice: { color: 'red' },
    deliveryTime: { fontSize: 14, color: 'gray', marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', },
    paymentTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    paymentMethod: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 10 },
    selectedMethod: { backgroundColor: '#ddd' },
    cardImage: { width: 50, height: 30, marginRight: 10 },
    cardText: { flex: 1, fontSize: 16 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    checkboxText: { marginLeft: 8, fontSize: 14 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
    finalPrice: { fontSize: 18, fontWeight: 'bold' },
    payButton: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 10 },
    payButtonText: { fontSize: 16, fontWeight: 'bold', color: 'white' }
});

export default PaymentScreen;
