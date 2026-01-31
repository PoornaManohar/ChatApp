import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useUser } from '../context/UserContext';

// Auth Screens
import PhoneNumberScreen from '../screens/auth/PhoneNumberScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// Main Screens
import CommunitiesScreen from '../screens/communities/CommunitiesScreen';
import ChatsListScreen from '../screens/chats/ChatsListScreen';
import ChatScreen from '../screens/chats/ChatScreen';
import ContactInfoScreen from '../screens/chats/ContactInfoScreen';
import StatusScreen from '../screens/status/StatusScreen';
import CallsScreen from '../screens/calls/CallsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Updates':
                            iconName = focused ? 'radio-button-on' : 'radio-button-off-outline';
                            break;
                        case 'Calls':
                            iconName = focused ? 'call' : 'call-outline';
                            break;
                        case 'Communities':
                            iconName = focused ? 'people' : 'people-outline';
                            break;
                        case 'Chats':
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                            break;
                        case 'Settings':
                            iconName = focused ? 'settings' : 'settings-outline';
                            break;
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.tabInactive,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.divider,
                },
                headerShown: false,
            })}
            initialRouteName="Chats"
        >
            <Tab.Screen name="Updates" component={StatusScreen} />
            <Tab.Screen name="Calls" component={CallsScreen} />
            <Tab.Screen name="Communities" component={CommunitiesScreen} />
            <Tab.Screen name="Chats" component={ChatsListScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
);

const MainStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
                animation: 'slide_from_right',
            }}
        />
        <Stack.Screen
            name="ContactInfo"
            component={ContactInfoScreen}
            options={{
                animation: 'slide_from_right',
            }}
        />
    </Stack.Navigator>
);

const LoadingScreen = () => (
    <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
    </View>
);

const AppNavigator = () => {
    const { currentUser, isLoading } = useUser();

    if (isLoading) {
        return <LoadingScreen />;
    }

    // Check if user has completed profile setup (has a name)
    const isAuthenticated = currentUser && currentUser.name;

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});

export default AppNavigator;
