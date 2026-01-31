import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Alert,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../context/UserContext';

const ProfileSetupScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { register } = useUser();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const phone = route.params?.phone;

    const handleFinish = useCallback(async () => {
        Keyboard.dismiss();

        if (!name.trim()) {
            Alert.alert('Name Required', 'Please enter your name to continue.');
            return;
        }

        if (!password || password.length < 4) {
            Alert.alert('Password Required', 'Please enter a password (min 4 chars).');
            return;
        }

        setIsLoading(true);
        try {
            await register(phone, name.trim(), password);
            // Navigation handled by AppNavigator status change
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create account.');
        } finally {
            setIsLoading(false);
        }
    }, [name, password, phone, register]);

    const isButtonEnabled = name.trim().length > 0 && password.length > 0;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile info</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.subtitle}>
                        Please provide your name and an optional profile photo
                    </Text>

                    {/* Avatar */}
                    <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.7}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=0' }}
                            style={styles.avatar}
                        />
                        <View style={styles.cameraIconContainer}>
                            <Ionicons name="camera" size={18} color={colors.textLight} />
                        </View>
                    </TouchableOpacity>

                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={inputRef}
                            style={styles.nameInput}
                            placeholder="Type your name here"
                            placeholderTextColor={colors.textTertiary}
                            value={name}
                            onChangeText={setName}
                            maxLength={25}
                            autoCorrect={false}
                            autoCapitalize="words"
                        />
                        <TouchableOpacity style={styles.emojiButton}>
                            <Ionicons name="happy-outline" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Password Input */}
                    <View style={[styles.inputContainer, { marginTop: 24 }]}>
                        <TextInput
                            style={styles.nameInput}
                            placeholder="Create a password"
                            placeholderTextColor={colors.textTertiary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.emojiButton}>
                            <Ionicons name="lock-closed-outline" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Button */}
                <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + spacing.xl }]}>
                    <TouchableOpacity
                        style={[styles.nextButton, !isButtonEnabled && styles.nextButtonDisabled]}
                        onPress={handleFinish}
                        disabled={!isButtonEnabled || isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.textLight} size="small" />
                        ) : (
                            <Text style={styles.nextButtonText}>Done</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
        marginRight: 36, // Balance back button
    },
    headerSpacer: {
        width: 36,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: spacing.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.surfaceLight,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.background,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        paddingVertical: spacing.sm,
    },
    nameInput: {
        flex: 1,
        fontSize: 17,
        color: colors.textPrimary,
        padding: 0,
    },
    emojiButton: {
        padding: spacing.xs,
    },
    buttonContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },
    nextButton: {
        backgroundColor: colors.primary,
        borderRadius: 25,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    nextButtonDisabled: {
        backgroundColor: colors.iconGray,
    },
    nextButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.textLight,
    },
});

export default ProfileSetupScreen;
