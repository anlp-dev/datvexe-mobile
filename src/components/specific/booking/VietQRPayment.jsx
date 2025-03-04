import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const VietQRPayment = ({route, navigation}) => {
    const urlVietQr = route.params.urlVietQr;
    const dataBooking = route.params.dataBooking;
    const dataBanking = route.params.dataBanking;

    const handleOpenBookingSuccess = () => {
        navigation.navigate("BookingSuccessScreen", {dataBooking: dataBooking})
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
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
            </ScrollView>

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
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 20,
    },
    qrContainer: {
        width: width * 0.9,
        alignItems: 'center',
        padding: 15,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFA07A',
    },
    qrImage: {
        width: width * 0.8,
        height: height * 0.5,
        maxHeight: 500,
    },
    infoContainer: {
        width: width * 0.9,
        marginTop: 20,
        padding: 20,
        backgroundColor: '#FFF5EE',
        borderRadius: 15,
        alignItems: 'center',
    },
    bankName: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#FF7F50',
        marginBottom: 10,
        textAlign: 'center',
    },
    accountInfo: {
        fontSize: width * 0.04,
        color: '#666',
        marginBottom: 5,
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    footerText: {
        fontSize: width * 0.035,
        color: '#95a5a6',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
    },
    button: {
        width: width * 0.4,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 25,
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
        fontSize: width * 0.04,
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