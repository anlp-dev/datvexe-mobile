import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    SafeAreaView,
    ScrollView,
    TouchableWithoutFeedback,
    Animated
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CancellationReasons = [
    { id: 1, reason: 'Đã đổi lịch trình' },
    { id: 2, reason: 'Đã tìm được phương tiện khác' },
    { id: 3, reason: 'Phải hủy vì lý do cá nhân' },
    { id: 4, reason: 'Gặp vấn đề với giá vé' },
    { id: 5, reason: 'Đặt nhầm ngày/giờ' },
    { id: 6, reason: 'Lý do khác' },
];

const CancellationActionSheet = ({ visible, onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState(null);
    const slideAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleConfirm = () => {
        if (selectedReason) {
            onConfirm(selectedReason);
            setSelectedReason(null);
        }
    };

    const handleClose = () => {
        setSelectedReason(null);
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <Animated.View
                            style={[
                                styles.actionSheet,
                                {
                                    transform: [{
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [300, 0],
                                        }),
                                    }],
                                },
                            ]}
                        >
                            <View style={styles.headerContainer}>
                                <View style={styles.indicator} />
                                <Text style={styles.actionSheetTitle}>Chọn lý do hủy vé</Text>
                                <Text style={styles.actionSheetSubtitle}>Vui lòng chọn lý do để chúng tôi cải thiện dịch vụ</Text>
                            </View>

                            <ScrollView style={styles.reasonsContainer}>
                                {CancellationReasons.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.reasonItem}
                                        onPress={() => setSelectedReason(item)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.radioContainer}>
                                            <View
                                                style={[
                                                    styles.radioOuter,
                                                    selectedReason?.id === item.id && styles.radioOuterSelected
                                                ]}
                                            >
                                                {selectedReason?.id === item.id && (
                                                    <View style={styles.radioInner} />
                                                )}
                                            </View>
                                            <Text style={styles.reasonText}>{item.reason}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.confirmButton,
                                        !selectedReason && styles.confirmButtonDisabled
                                    ]}
                                    disabled={!selectedReason}
                                    onPress={handleConfirm}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.confirmButtonText}>Xác nhận hủy vé</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    actionSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        maxHeight: '80%',
    },
    headerContainer: {
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    indicator: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginVertical: 8,
    },
    actionSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333333',
    },
    actionSheetSubtitle: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
    reasonsContainer: {
        padding: 16,
    },
    reasonItem: {
        paddingVertical: 12,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#DDDDDD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioOuterSelected: {
        borderColor: '#007BFF',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#007BFF',
    },
    reasonText: {
        fontSize: 16,
        color: '#333333',
    },
    actionsContainer: {
        padding: 16,
        paddingTop: 0,
    },
    confirmButton: {
        backgroundColor: '#FFA07A',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    confirmButtonDisabled: {
        backgroundColor: '#FFBDC0',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CancellationActionSheet;