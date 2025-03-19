import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {showCustomToast} from '../../components/common/notifice/CustomToast';
import socket from '../../config/socket';
import {LinearGradient} from 'expo-linear-gradient';
import moment from 'moment';
import 'moment/locale/vi';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from "@react-native-async-storage/async-storage";

moment.locale('vi');

const AdminChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef(null);
    const lastSentMessage = useRef(''); // Track last sent message to avoid duplicates
    const lastSentTimestamp = useRef(null); // Track timestamp of last sent message

    useEffect(() => {
        loadSocket();
        
        // Listen for incoming messages
        socket.on('receive_message', (messageData) => {
            // Avoid duplicating messages that were just sent by this user
            const isEcho = messageData.message === lastSentMessage.current && 
                           new Date().getTime() - lastSentTimestamp.current < 3000; // Within 3 seconds
            
            if (!isEcho) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    ...messageData
                }]);
            }
        });

        // Set loading to false immediately since we're not waiting for history
        setIsLoading(false);

        // Cleanup on unmount
        return () => {
            socket.off('receive_message');
            socket.disconnect();
        };
    }, []);

    const loadSocket = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                showCustomToast('Vui lòng đăng nhập lại', 'error');
                return;
            }
            
            const decode = jwtDecode(token);
            
            // Connect to socket
            socket.connect();
            
            // Admin joins chat with this user
            socket.emit('join_chat', decode.userId);
            
            console.log('Admin connected to chat with user:', decode.userId);
        } catch (error) {
            console.log('Socket connection error:', error);
            showCustomToast('Lỗi kết nối chat', 'error');
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                showCustomToast('Vui lòng đăng nhập lại', 'error');
                return;
            }
            
            const decode = jwtDecode(token);
            setIsSending(true);

            // Track this message to avoid duplicates
            lastSentMessage.current = newMessage;
            lastSentTimestamp.current = new Date().getTime();

            // Send message with correct format
            socket.emit("send_message", {
                userId: decode.userId,
                sender: { role: 'USER' }, // Match backend format with role
                message: newMessage
            });

            // Add message to local state
            const messageData = {
                id: Date.now().toString(),
                message: newMessage,
                sender: { role: 'USER' },
                timestamp: new Date().toISOString(),
                read: false
            };

            setMessages(prev => [...prev, messageData]);
            setNewMessage('');
        } catch (error) {
            showCustomToast('Lỗi kết nối', 'error');
            console.log(error);
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (timestamp) => {
        const messageDate = moment(timestamp);
        const now = moment();

        if (now.diff(messageDate, 'days') === 0) {
            return messageDate.format('HH:mm');
        } else if (now.diff(messageDate, 'days') === 1) {
            return 'Hôm qua ' + messageDate.format('HH:mm');
        } else {
            return messageDate.format('DD/MM/YYYY HH:mm');
        }
    };

    const MessageItem = ({item}) => {
        // Check if sender is an object with role property
        const isUser = typeof item.sender === 'object' 
            ? item.sender.role === 'USER' 
            : item.sender === 'user';

        return (
            <View
                style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.adminMessageContainer]}>
                {!isUser && (
                    <View style={styles.avatarContainer}>
                        <MaterialIcons name="support-agent" size={20} color="#fff"/>
                    </View>
                )}

                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.adminBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.adminMessageText]}>
                        {item.message}
                    </Text>
                    <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.adminTimeText]}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4A90E2"/>
                        <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={({item}) => <MessageItem item={item}/>}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.messagesList}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
                        onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Nhập tin nhắn..."
                        multiline
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color="#fff"/>
                        ) : (
                            <MaterialIcons name="send" size={24} color="#fff"/>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#8F9BB3',
        fontSize: 16,
    },
    messagesList: {
        padding: 16,
        paddingBottom: 20,
    },
    messageContainer: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    adminMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        borderRadius: 16,
        padding: 12,
        paddingBottom: 8,
    },
    userBubble: {
        backgroundColor: '#4A90E2',
        borderBottomRightRadius: 4,
    },
    adminBubble: {
        backgroundColor: '#F0F2F5',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        marginBottom: 4,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    adminMessageText: {
        color: '#1A2138',
    },
    timeText: {
        fontSize: 11,
        alignSelf: 'flex-end',
    },
    userTimeText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    adminTimeText: {
        color: '#8F9BB3',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E4E9F2',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F2F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        maxHeight: 100,
        fontSize: 15,
    },
    sendButton: {
        marginLeft: 12,
        backgroundColor: '#4A90E2',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AdminChatScreen; 
