import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../services/socketService';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Load saved user on app start
    useEffect(() => {
        loadSavedUser();
    }, []);

    // Load chats whenever user changes
    useEffect(() => {
        if (currentUser) {
            loadRecentChats(currentUser.id);
        } else {
            setRecentChats([]);
        }
    }, [currentUser]);

    const loadRecentChats = async (userId) => {
        try {
            const saved = await AsyncStorage.getItem(`recentChats_${userId}`);
            if (saved) {
                setRecentChats(JSON.parse(saved));
            } else {
                setRecentChats([]);
            }
        } catch (error) {
            console.log('Error loading chats:', error);
        }
    };

    const addToRecentChats = useCallback(async (newChat) => {
        if (!currentUser) return;

        setRecentChats(prev => {
            // Remove if exists to re-add at top
            const filtered = prev.filter(c => c.id !== newChat.id);
            const updated = [newChat, ...filtered];
            AsyncStorage.setItem(`recentChats_${currentUser.id}`, JSON.stringify(updated));
            return updated;
        });
    }, [currentUser]);

    // Connect to socket when user is set
    useEffect(() => {
        if (currentUser) {
            const socket = socketService.connect(currentUser.id);

            socket.on('connect', () => {
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
            });

            socket.on('online-users', (users) => {
                setOnlineUsers(users);
            });

            // Listen for new messages to update the list even if not in the chat
            socket.on('new-message', async (message) => {
                console.log('📩 New message received:', message);

                // Determine who the other person is
                const [userA, userB] = message.chatId.split('_');
                const otherId = userA === currentUser.id ? userB : userA;

                const chatUpdate = {
                    id: message.chatId,
                    chatId: message.chatId,
                    otherUserId: otherId,
                    name: `User ${otherId}`, // In real app, fetch name from cache/DB
                    avatar: `https://i.pravatar.cc/150?u=${otherId}`,
                    lastMessage: message.text,
                    time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    unread: 0, // Increment if not in chat screen? (requires more state, skip for now)
                };

                await addToRecentChats(chatUpdate);
            });

            return () => {
                socketService.disconnect();
            };
        }
    }, [currentUser, addToRecentChats]);

    const loadSavedUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('currentUser');
            if (savedUser) {
                setCurrentUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.log('Error loading user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkUser = useCallback(async (phone) => {
        console.log('🔎 checkUser called for:', phone);
        try {
            const url = `${socketService.getServerUrl()}/api/auth/check`;
            console.log('🔗 Fetching:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            console.log('📩 Response Status:', response.status);
            const data = await response.json();
            console.log('📦 Data received:', data);
            return data;
        } catch (error) {
            console.error('❌ Check User Error:', error);
            throw error;
        }
    }, []);

    const register = useCallback(async (phone, name, password) => {
        try {
            const response = await fetch(`${socketService.getServerUrl()}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, name, password }),
            });
            const data = await response.json();

            if (data.success) {
                const user = data.user;
                // Add an ID for local use if mongo _id is different string
                // But server returns consistent user object.
                // Just ensure id is set for socket connection
                if (!user.id && user._id) user.id = user.phone; // Keep + for consistency with chatIds

                await AsyncStorage.setItem('currentUser', JSON.stringify(user));
                setCurrentUser(user);
                return user;
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Register Error:', error);
            throw error;
        }
    }, []);

    const login = useCallback(async (phone, password) => {
        try {
            const response = await fetch(`${socketService.getServerUrl()}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password }),
            });
            const data = await response.json();

            if (data.success) {
                const user = data.user;
                if (!user.id && user._id) user.id = user.phone; // Keep + for consistency with chatIds

                await AsyncStorage.setItem('currentUser', JSON.stringify(user));
                setCurrentUser(user);
                return user;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('currentUser');
            socketService.disconnect();
            setCurrentUser(null);
            setIsConnected(false);
        } catch (error) {
            console.log('Error logging out:', error);
        }
    }, []);

    const updateProfile = useCallback(async (updates) => {
        if (currentUser) {
            const updatedUser = { ...currentUser, ...updates };
            try {
                await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            } catch (error) {
                console.log('Error updating profile:', error);
            }
        }
    }, [currentUser]);

    const isUserOnline = useCallback((userId) => {
        return onlineUsers.includes(userId);
    }, [onlineUsers]);

    const [recentChats, setRecentChats] = useState([]);

    // Load saved user and chats on app start
    useEffect(() => {
        loadSavedUser();
        loadRecentChats();
    }, []);



    const value = {
        currentUser,
        isConnected,
        isLoading,
        onlineUsers,
        recentChats,
        addToRecentChats,
        checkUser,
        register,
        login,
        logout,
        updateProfile,
        isUserOnline,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
