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

            return () => {
                socketService.disconnect();
            };
        }
    }, [currentUser]);

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
        try {
            const response = await fetch(`${socketService.getServerUrl()}/api/auth/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Check User Error:', error);
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
                if (!user.id && user._id) user.id = user.phone.replace(/\D/g, '');

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
                if (!user.id && user._id) user.id = user.phone.replace(/\D/g, '');

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

    const value = {
        currentUser,
        isConnected,
        isLoading,
        onlineUsers,
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
