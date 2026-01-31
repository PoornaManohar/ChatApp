import { io } from 'socket.io-client';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ---------------------------------------------------------
// 🌍 DEPLOYMENT CONFIGURATION
// ---------------------------------------------------------
// If you have a deployed server (Ngrok, Render, VPS), paste the URL here:
// Example: const DEPLOYED_URL = 'https://my-app.onrender.com';
const DEPLOYED_URL = ''; // 'https://chatapp-production-b7b5.up.railway.app'; // Add your ngrok/server URL here
// ---------------------------------------------------------

// Get the server URL based on the platform
const getServerUrl = () => {
    // 1. Prioritize Deployed URL if set
    if (DEPLOYED_URL) {
        console.log('🌍 Using Deployed Server:', DEPLOYED_URL);
        return DEPLOYED_URL;
    }

    const PORT = 3001;

    // For web, use localhost
    if (Platform.OS === 'web') {
        return `http://localhost:${PORT}`;
    }

    // For Expo Go mobile app, try to get the host from Expo
    // This uses the same IP that Expo uses to connect to the dev server
    try {
        const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
        if (debuggerHost) {
            const host = debuggerHost.split(':')[0];
            console.log('📱 Using Expo host IP:', host);
            return `http://${host}:${PORT}`;
        }
    } catch (e) {
        console.log('Could not get Expo host:', e);
    }

    // Fallback to your local IP
    return `http://192.168.1.24:${PORT}`;
};

class SocketService {
    socket = null;
    userId = null;
    serverUrl = null;

    getServerUrl() {
        if (!this.serverUrl) {
            this.serverUrl = getServerUrl();
        }
        return this.serverUrl;
    }

    connect(userId) {
        this.userId = userId;

        const serverUrl = this.getServerUrl();
        console.log(`🔌 Connecting to: ${serverUrl}`);
        console.log(`📱 Platform: ${Platform.OS}`);

        // Disconnect existing socket if any
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(serverUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
            timeout: 20000,
            forceNew: true,
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected! Socket ID:', this.socket.id);
            this.socket.emit('register', { userId: this.userId });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.log('🔴 Connection error:', error.message);
            console.log('   Server URL was:', serverUrl);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinChat(chatId) {
        if (this.socket?.connected) {
            console.log('📱 Joining room:', chatId);
            this.socket.emit('join', { chatId, userId: this.userId });
        } else {
            console.log('⚠️ Cannot join room - not connected');
        }
    }

    sendMessage(chatId, text, image = null) {
        if (this.socket?.connected) {
            const message = {
                chatId,
                senderId: this.userId,
                text,
                image,
                timestamp: Date.now(),
            };
            console.log('📤 Sending:', text);
            this.socket.emit('message', message);
        } else {
            console.log('⚠️ Cannot send - not connected');
        }
    }

    sendTyping(chatId, isTyping) {
        if (this.socket?.connected) {
            this.socket.emit('typing', { chatId, userId: this.userId, isTyping });
        }
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

export default new SocketService();
