import React from 'react';
import { View, Modal, StyleSheet, Text } from 'react-native';
import * as Progress from 'react-native-progress';

/**
 * LoadingHelper - Component hiển thị loading với nền trong suốt
 *
 * @param {Object} props
 * @param {boolean} props.visible - Hiển thị hoặc ẩn loading
 * @param {Array} props.colors - Mảng các màu sắc cho CircleSnail
 * @param {number} props.size - Kích thước của CircleSnail
 * @param {string} props.text - Văn bản hiển thị dưới CircleSnail
 * @param {boolean} props.overlay - Hiển thị loading với nền overlay hay không
 * @param {Object} props.containerStyle - Style tùy chỉnh cho container
 * @param {Object} props.textStyle - Style tùy chỉnh cho text
 * @returns {JSX.Element|null}
 */
const LoadingHelper = ({
                           visible = false,
                           colors = ['red', 'green', 'blue'],
                           size = 40,
                           text = 'Đang tải...',
                           overlay = true,
                           containerStyle = {},
                           textStyle = {},
                       }) => {
    if (!visible) return null;

    const loadingContent = (
        <View style={styles.loaderContainer}>
            <Progress.CircleSnail color={colors} size={size} />
            {text ? <Text style={[styles.text, textStyle]}>{text}</Text> : null}
        </View>
    );

    if (!overlay) {
        return <View style={[styles.container, containerStyle]}>{loadingContent}</View>;
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalBackground}>
                <View style={[styles.modalContainer, containerStyle]}>
                    {loadingContent}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ cho toàn màn hình
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: 'transparent', // Nền trong suốt cho container
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        minHeight: 100,
    },
    text: {
        marginTop: 10,
        fontSize: 14,
        color: '#FFFFFF', // Đổi màu chữ thành trắng để hiển thị tốt trên nền trong suốt
        textAlign: 'center',
        fontWeight: '500', // Làm đậm chữ để dễ đọc
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Thêm đổ bóng cho chữ
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default LoadingHelper;