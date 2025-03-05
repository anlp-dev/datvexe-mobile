import React, {useState, useEffect} from "react";
import {View, ActivityIndicator, StyleSheet, SafeAreaView, Text, Button, Alert} from "react-native";
import {WebView} from "react-native-webview";
import PaymentService from "../../../service/booking/PaymentService";
import {showCustomToast} from "../../common/notifice/CustomToast";

const VNPayPayment = ({navigation, route}) => {
    const [loading, setLoading] = useState(false);
    const urlVnPayQr = route.params.urlVnPayQr;
    const dataBooking = route.params.dataBooking;
    const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán (success/fail)

    // useEffect(() => {
    //     setLoading(true);
    //     if (route?.params?.urlVnPayQr) {
    //         setPaymentUrl(route.params.urlVnPayQr);
    //     }
    //     setLoading(false);
    // }, [route]);

    const handleNavigationStateChange = async(navState) => {
        try{
            const {url} = navState;
            console.log("Current URL:", url);

            const params = new URLSearchParams(url.split("?")[1]);
            const responseCode = params.get("vnp_ResponseCode");

            if (responseCode === "00") {
                setPaymentStatus(true)
                const dataReq = {
                    id: dataBooking._id,
                    status: "payed",
                    paymentMethod: "VNPay"
                }
                const resData = await PaymentService.updateStatusPayment(dataReq);
                if(resData.status === 200) {
                    navigation.replace("BookingSuccessScreen", {dataBooking: dataBooking})
                }else{
                    showCustomToast(resData.message);
                }
            }
        }catch (e) {
           console.log(e.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {!paymentStatus ? (
                <WebView
                    source={{uri: urlVnPayQr}}
                    onNavigationStateChange={handleNavigationStateChange}
                />
            ) : (
                ""
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    resultContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    successText: {
        fontSize: 20,
        color: "green",
        fontWeight: "bold",
    },
    failText: {
        fontSize: 20,
        color: "red",
        fontWeight: "bold",
    },
});

export default VNPayPayment;
