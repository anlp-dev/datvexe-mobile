import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {PAYMENT_METHODS} from '../../enums/PaymentMethods'
import PaymentService from "../../service/booking/PaymentService";
import {showCustomToast} from "../../components/common/notifice/CustomToast";
import {formatCurrency, formatTime} from "../../utils/format";

const PaymentScreen = ({navigation, route}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const dataBooking = route.params.dataBooking;
  const [urlVnPayQr, setUrlVnPayQr] = useState('');

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const RadioButton = ({ selected }) => (
      <View style={styles.radioContainer}>
        {selected ? (
            <View style={styles.radioButtonSelected}>
              <View style={styles.radioButtonInner} />
            </View>
        ) : (
            <View style={styles.radioButton} />
        )}
      </View>
  );

  const submitPayment = async () => {
    let dataReq = {
      orderId: dataBooking?.code,
      totalPrice: dataBooking?.totalPrice * 1000,
      bankCode: "",
      orderInfo: "Thanh toan ve xe giuong nam ma " +  dataBooking?.code,
      orderType: "Đặt vé xe khách"
    }
    try{
      switch (selectedMethod){
        case 1:
          dataReq.bankCode = "VNPayQR"
          const resDataQR = await PaymentService.getUrlVnPayQrCode(dataReq);
          setUrlVnPayQr(resDataQR.data);
          navigation.navigate("VnPayPayment", {urlVnPayQr: resDataQR.data, dataBooking: dataBooking})
          return;
        case 2:
          dataReq.bankCode = "NCB"
          const resDataVNPay = await PaymentService.getUrlVnPayQrCode(dataReq);
          setUrlVnPayQr(resDataVNPay.data);
          navigation.navigate("VnPayPayment", {urlVnPayQr: resDataVNPay.data, dataBooking: dataBooking})
          return;
        case 3:
          navigation.navigate("BookingSuccessScreen", {dataBooking: dataBooking})
          return;
        case 4:
          const dataBanking = {
            bankCode: "TCB",
            bankName: "Techcombank",
            bankNo: "78989899999999",
            amount: dataBooking?.totalPrice * 1000,
            description: "Thanh toan ve xe giuong nam ma " + dataBooking?.code,
            accountName: "LUU PHUC AN"
          }
          const urlVietQr = `https://img.vietqr.io/image/${dataBanking.bankCode}-${dataBanking.bankNo}-compact2.png?amount=${dataBanking.amount}&addInfo=${encodeURIComponent(dataBanking.description)}`;
          navigation.navigate("VietQRPayment", {urlVietQr: urlVietQr, dataBooking: dataBooking, dataBanking: dataBanking})
          return;
        default:
          return
      }
    }catch (e) {
      showCustomToast(e.message, "error")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLine}>
          {[1, 2, 3, 4].map((item, index) => (
            <React.Fragment key={item}>
              <View style={styles.progressDot}>
                <MaterialIcons name="check" size={16} color="#fff" />
              </View>
              {index < 3 && <View style={styles.progressBar} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <Text style={styles.bookingTime}>Thời gian đặt vé còn: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>

      {/* Payment Methods */}
      <Text style={styles.sectionTitle}>Vui lòng chọn hình thức thanh toán</Text>
      <ScrollView style={styles.methodsContainer}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.methodItem}
            onPress={() => setSelectedMethod(method.id)}
          >
            <MaterialCommunityIcons name={method.icon} size={24} color="#666" />
            <View style={styles.methodText}>
              <Text style={styles.methodTitle}>{method.title}</Text>
              <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
            </View>
            <RadioButton selected={selectedMethod === method.id} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Booking Information */}
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingTitle}>Thông tin đặt chỗ</Text>
        <View style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>Booking #</Text>
          <Text style={styles.bookingValue}>{dataBooking?.code}</Text>
        </View>
        <View style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>Tên tuyến</Text>
          <Text style={styles.bookingValue}>{dataBooking?.busSchedule?.route}</Text>
        </View>
        <View style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>Giờ xuất bến</Text>
          <Text style={styles.bookingValue}>{formatTime(dataBooking?.departureTime)}</Text>
        </View>
        <View style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>Đơn vị vận chuyển</Text>
          <Text style={styles.bookingValue}>Sao Việt</Text>
        </View>
      </View>

      {/* Total and Payment Button */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng</Text>
          <Text style={styles.totalAmount}>{formatCurrency(dataBooking?.totalPrice)}</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.paymentButton,
            !selectedMethod && styles.paymentButtonDisabled
          ]}
          disabled={!selectedMethod}
          onPress={submitPayment}
        >
          <Text style={styles.paymentButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFB800',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#000',
  },
  progressContainer: {
    padding: 16,
  },
  progressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFA07A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#FFB800',
    marginHorizontal: 4,
  },
  bookingTime: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
  sectionTitle: {
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  methodsContainer: {
    flex: 1,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  methodText: {
    flex: 1,
    marginLeft: 16,
  },
  methodTitle: {
    fontSize: 16,
    color: '#333',
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  radioContainer: {
    marginLeft: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
  },
  radioButtonSelected: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFA07A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#FFA07A',
  },
  bookingInfo: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingLabel: {
    color: '#666',
  },
  bookingValue: {
    color: '#333',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff8e5e',
  },
  paymentButton: {
    backgroundColor: '#FFA07A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonDisabled: {
    backgroundColor: '#ccc',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
