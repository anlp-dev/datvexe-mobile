import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

const VietQRPayment = ({route, navigation}) => {
    const urlVietQr = route.params.urlVietQr;
    const dataBooking = route.params.dataBooking;
    const dataBanking = route.params.dataBanking;

    const handleOpenBookingSuccess = () => {
        navigation.navigate("BookingSuccessScreen", {dataBooking: dataBooking})
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.qrContainer}>
                <Image
                    source={{ uri: urlVietQr }}
                    resizeMode="contain"
                    style={styles.qrImage}
                />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.bankName}>{dataBanking.bankName}</Text>
                <Text style={styles.accountInfo}>STK: {dataBanking.bankNo}</Text>
                <Text style={styles.accountInfo}>Chủ TK: {dataBanking.accountName}</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Powered by VietQR</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.homeButton]}
                    onPress={() => navigation.replace("MainTabs")}
                >
                    <Text style={[styles.buttonText, styles.homeButtonText]}>Về trang chủ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.continueButton]}
                    onPress={() => handleOpenBookingSuccess()}
                >
                    <Text style={[styles.buttonText, styles.continueButtonText]}>Tiếp tục</Text>
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
        padding: 20,
        backgroundColor: '#FFA07A',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    qrContainer: {
        alignItems: 'center',
        padding: 15,
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFA07A',
    },
    qrImage: {
        width: 400,
        height: 450,
    },
    infoContainer: {
        margin: 20,
        padding: 20,
        backgroundColor: '#FFF5EE',
        borderRadius: 15,
        alignItems: 'center',
    },
    bankName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF7F50',
        marginBottom: 10,
    },
    accountInfo: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#95a5a6',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        marginBottom: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        minWidth: 130,
        alignItems: 'center',
    },
    homeButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FFA07A',
    },
    continueButton: {
        backgroundColor: '#FFA07A',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    homeButtonText: {
        color: '#FFA07A',
    },
    continueButtonText: {
        color: '#fff',
    }
});

export default VietQRPayment;