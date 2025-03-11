import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Share
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { showCustomToast } from '../../components/common/notifice/CustomToast';

const NewsDetailScreen = ({ route, navigation }) => {
    const { newsItem } = route.params;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${newsItem.title}\n\n${newsItem.summary}\n\nXem thêm tại ứng dụng Sao Việt!`,
            });
        } catch (error) {
            showCustomToast("Không thể chia sẻ bài viết", "error");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image 
                source={{ uri: newsItem.image }} 
                style={styles.headerImage}
                resizeMode="cover"
            />
            
            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{newsItem.title}</Text>
                    <Text style={styles.date}>{newsItem.date}</Text>
                </View>
                
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <MaterialIcons name="share" size={20} color="#4A90E2" />
                        <Text style={styles.actionText}>Chia sẻ</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="bookmark-border" size={20} color="#4A90E2" />
                        <Text style={styles.actionText}>Lưu</Text>
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.summary}>{newsItem.summary}</Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.content}>{newsItem.content}</Text>
                
                <View style={styles.relatedSection}>
                    <Text style={styles.relatedTitle}>Tin liên quan</Text>
                    
                    <TouchableOpacity style={styles.relatedItem}>
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YnVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60' }} 
                            style={styles.relatedImage}
                        />
                        <View style={styles.relatedContent}>
                            <Text style={styles.relatedItemTitle} numberOfLines={2}>Sao Việt nâng cấp đội xe với 20 xe giường nằm cao cấp mới</Text>
                            <Text style={styles.relatedDate}>15/05/2023</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.relatedItem}>
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c3VtbWVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60' }} 
                            style={styles.relatedImage}
                        />
                        <View style={styles.relatedContent}>
                            <Text style={styles.relatedItemTitle} numberOfLines={2}>Chương trình khuyến mãi "Hè vui vẻ" với nhiều ưu đãi hấp dẫn</Text>
                            <Text style={styles.relatedDate}>01/06/2023</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerImage: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 16,
    },
    titleContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#6B7280',
    },
    actions: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#4A90E2',
    },
    summary: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 16,
    },
    content: {
        fontSize: 16,
        color: '#1F2937',
        lineHeight: 24,
        marginBottom: 24,
    },
    relatedSection: {
        marginTop: 16,
    },
    relatedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    relatedItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        overflow: 'hidden',
    },
    relatedImage: {
        width: 100,
        height: 80,
    },
    relatedContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    relatedItemTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    relatedDate: {
        fontSize: 12,
        color: '#6B7280',
    },
});

export default NewsDetailScreen; 
