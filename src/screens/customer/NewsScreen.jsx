import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { showCustomToast } from '../../components/common/notifice/CustomToast';

const NewsScreen = ({ navigation }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = () => {
        // Giả lập việc tải tin tức từ API
        setLoading(true);
        setTimeout(() => {
            const mockNews = [
                {
                    id: 1,
                    title: 'Sao Việt mở thêm tuyến xe mới từ TP.HCM đi Đà Lạt',
                    summary: 'Từ ngày 15/7/2023, Sao Việt sẽ khai trương tuyến xe mới từ TP.HCM đi Đà Lạt với nhiều ưu đãi hấp dẫn.',
                    date: '10/07/2023',
                    image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGElMjBsYXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                    content: 'Từ ngày 15/7/2023, Sao Việt sẽ khai trương tuyến xe mới từ TP.HCM đi Đà Lạt với nhiều ưu đãi hấp dẫn. Khách hàng đặt vé trong tuần đầu tiên sẽ được giảm 30% giá vé và tích lũy gấp đôi điểm thưởng. Xe khởi hành từ bến xe Miền Đông mới, với lịch trình 6h, 9h, 13h, 16h, 20h và 23h hàng ngày. Đội xe mới trang bị ghế ngả 135 độ, wifi miễn phí, ổ cắm điện và USB sạc điện thoại tại mỗi ghế.'
                },
                {
                    id: 2,
                    title: 'Chương trình khuyến mãi "Hè vui vẻ" với nhiều ưu đãi hấp dẫn',
                    summary: 'Sao Việt triển khai chương trình khuyến mãi "Hè vui vẻ" từ 01/06 đến 31/08/2023 với nhiều ưu đãi hấp dẫn.',
                    date: '01/06/2023',
                    image: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c3VtbWVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                    content: 'Sao Việt triển khai chương trình khuyến mãi "Hè vui vẻ" từ 01/06 đến 31/08/2023 với nhiều ưu đãi hấp dẫn. Khi đặt vé qua ứng dụng, khách hàng sẽ nhận được mã giảm giá 10% cho lần đặt vé tiếp theo. Ngoài ra, khách hàng còn có cơ hội tham gia quay số trúng thưởng với giải thưởng là 10 chiếc điện thoại iPhone 14 và 50 vé xe khứ hồi miễn phí.'
                },
                {
                    id: 3,
                    title: 'Sao Việt nâng cấp đội xe với 20 xe giường nằm cao cấp mới',
                    summary: 'Sao Việt vừa đầu tư thêm 20 xe giường nằm cao cấp mới nhằm nâng cao chất lượng dịch vụ.',
                    date: '15/05/2023',
                    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YnVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                    content: 'Sao Việt vừa đầu tư thêm 20 xe giường nằm cao cấp mới nhằm nâng cao chất lượng dịch vụ. Các xe mới được trang bị công nghệ hiện đại, hệ thống giải trí đa phương tiện, ghế massage và hệ thống điều hòa thông minh. Đặc biệt, các xe mới đều đạt tiêu chuẩn khí thải Euro 5, góp phần bảo vệ môi trường. Dự kiến, đội xe mới sẽ được đưa vào hoạt động từ tháng 6/2023.'
                },
                {
                    id: 4,
                    title: 'Sao Việt hợp tác với các đơn vị lữ hành triển khai gói du lịch trọn gói',
                    summary: 'Sao Việt hợp tác với các đơn vị lữ hành uy tín triển khai các gói du lịch trọn gói kết hợp vé xe và dịch vụ lưu trú.',
                    date: '01/04/2023',
                    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhdmVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                    content: 'Sao Việt hợp tác với các đơn vị lữ hành uy tín triển khai các gói du lịch trọn gói kết hợp vé xe và dịch vụ lưu trú. Khách hàng có thể dễ dàng đặt vé xe kết hợp với đặt phòng khách sạn, tour du lịch tại điểm đến với mức giá ưu đãi. Hiện tại, Sao Việt đã triển khai các gói du lịch đến các điểm du lịch nổi tiếng như Đà Lạt, Nha Trang, Phú Quốc, Đà Nẵng, Hội An, Huế, Sapa, Hạ Long.'
                },
                {
                    id: 5,
                    title: 'Sao Việt ra mắt tính năng đặt vé theo nhóm với nhiều ưu đãi',
                    summary: 'Sao Việt vừa ra mắt tính năng đặt vé theo nhóm, giúp khách hàng dễ dàng đặt nhiều vé cùng lúc và nhận được nhiều ưu đãi.',
                    date: '15/03/2023',
                    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJpZW5kcyUyMGdyb3VwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                    content: 'Sao Việt vừa ra mắt tính năng đặt vé theo nhóm, giúp khách hàng dễ dàng đặt nhiều vé cùng lúc và nhận được nhiều ưu đãi. Khi đặt từ 5 vé trở lên, khách hàng sẽ được giảm 5% tổng giá trị đơn hàng. Đặc biệt, với các đoàn từ 20 người trở lên, Sao Việt còn cung cấp dịch vụ xe đưa đón tận nơi miễn phí trong bán kính 5km từ bến xe.'
                }
            ];
            setNews(mockNews);
            setLoading(false);
            setRefreshing(false);
        }, 1500);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchNews();
    };

    const handleNewsPress = (newsItem) => {
        navigation.navigate('NewsDetailScreen', { newsItem });
    };

    const renderNewsItem = (item) => (
        <TouchableOpacity 
            key={item.id} 
            style={styles.newsItem}
            onPress={() => handleNewsPress(item)}
        >
            <Image 
                source={{ uri: item.image }} 
                style={styles.newsImage}
                resizeMode="cover"
            />
            <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
                <View style={styles.newsFooter}>
                    <Text style={styles.newsDate}>{item.date}</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#4A90E2" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#4A90E2"]}
                />
            }
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tin tức & Khuyến mãi</Text>
                <Text style={styles.headerSubtitle}>Cập nhật thông tin mới nhất từ Sao Việt</Text>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.loadingText}>Đang tải tin tức...</Text>
                </View>
            ) : (
                <View style={styles.newsContainer}>
                    {news.map(renderNewsItem)}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
        color: '#6B7280',
    },
    newsContainer: {
        padding: 16,
    },
    newsItem: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    newsImage: {
        width: '100%',
        height: 180,
    },
    newsContent: {
        padding: 16,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    newsSummary: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 12,
        lineHeight: 20,
    },
    newsFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    newsDate: {
        fontSize: 12,
        color: '#6B7280',
    },
});

export default NewsScreen; 
