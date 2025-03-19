import AsyncStorage from '@react-native-async-storage/async-storage';

class ChatService {
    // Fetch chat history with admin
    async getChatHistory() {
        try {
           
        } catch (error) {
            throw error;
        }
    }

    // Send message to admin
    async sendMessage(message) {
        try {
           
        } catch (error) {
            throw error;
        }
    }

    // Mock for demo purposes - returns fake chat history
    async getMockChatHistory() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            status: 200,
            data: [
                {
                    id: '1',
                    message: 'Xin chào, tôi có thể giúp gì cho bạn?',
                    sender: 'admin',
                    timestamp: new Date(Date.now() - 86400000).toISOString(), // yesterday
                    read: true
                },
                {
                    id: '2',
                    message: 'Tôi muốn hỏi về chính sách đổi vé',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 85400000).toISOString(),
                    read: true
                },
                {
                    id: '3',
                    message: 'Bạn có thể đổi vé trước 24 giờ so với giờ khởi hành mà không mất phí. Nếu đổi trong vòng 24 giờ, sẽ phát sinh phí 10% giá vé.',
                    sender: 'admin',
                    timestamp: new Date(Date.now() - 85000000).toISOString(),
                    read: true
                }
            ]
        };
    }

    // Mock for demo purposes - returns success for sent message
    async sendMockMessage(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
            status: 200,
            data: {
                id: Date.now().toString(),
                message,
                sender: 'user',
                timestamp: new Date().toISOString(),
                read: false
            }
        };
    }
}

export default new ChatService(); 
