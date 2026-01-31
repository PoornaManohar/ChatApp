import React, { useState, useCallback, useRef, memo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    TextInput,
    Alert,
    ActivityIndicator,
    Animated,
    Keyboard,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../context/UserContext';

const COUNTRY_CODES = [
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
];

// Memoized country option to prevent re-renders
const CountryOption = memo(({ country, isSelected, onSelect }) => (
    <TouchableOpacity
        style={[styles.countryOption, isSelected && styles.countryOptionSelected]}
        onPress={() => onSelect(country)}
        activeOpacity={0.6}
    >
        <Text style={styles.flag}>{country.flag}</Text>
        <Text style={styles.countryName}>{country.country}</Text>
        <Text style={styles.countryCodeOption}>{country.code}</Text>
        {isSelected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
    </TouchableOpacity>
));

const PhoneNumberScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { login, checkUser } = useUser();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[2]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(false); // New State to toggle Password input
    const inputRef = useRef(null);
    const passwordRef = useRef(null);

    const handleContinue = useCallback(async () => {
        Keyboard.dismiss();

        if (phoneNumber.length < 10) {
            Alert.alert('Invalid Phone Number', 'Please enter a valid phone number with at least 10 digits.');
            return;
        }

        const fullNumber = `${selectedCountry.code}${phoneNumber}`;

        setIsLoading(true);
        try {
            if (isLoginMode) {
                // Perform Login
                if (!password) {
                    Alert.alert('Password Required', 'Please enter your password.');
                    setIsLoading(false);
                    return;
                }
                await login(fullNumber, password);
                // Navigation handled by AuthStack automatically or...
                // Actually AppNavigator switches stack based on currentUser.
            } else {
                // Check if user exists
                const result = await checkUser(fullNumber);
                if (result.exists) {
                    setIsLoginMode(true); // Show password field
                } else {
                    // New User -> Go to Profile Setup to Sign Up
                    navigation.navigate('ProfileSetup', { phone: fullNumber });
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [phoneNumber, password, selectedCountry.code, login, checkUser, isLoginMode, navigation]);

    const handlePhoneChange = useCallback((text) => {
        const cleaned = text.replace(/\D/g, '');
        setPhoneNumber(cleaned);
        setIsLoginMode(false); // Reset to check mode if number changes
    }, []);

    const handleSelectCountry = useCallback((country) => {
        setSelectedCountry(country);
        setShowCountryPicker(false);
    }, []);

    const toggleCountryPicker = useCallback(() => {
        Keyboard.dismiss();
        setShowCountryPicker(prev => !prev);
    }, []);

    const isButtonEnabled = phoneNumber.length >= 10;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Main Content */}
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="logo-whatsapp" size={56} color={colors.primary} />
                    </View>
                    <Text style={styles.title}>
                        {isLoginMode ? 'Welcome Back' : 'Enter your phone number'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isLoginMode
                            ? 'Enter your password to log in.'
                            : 'WhatsApp will need to verify your phone number.'}
                    </Text>
                </View>

                {/* Input Section */}
                <View style={styles.inputSection}>
                    {/* Country Selector - Disable if Login Mode? No, let them change it */}
                    {!isLoginMode && ( // Hide country picker logic if login mode to keep UI clean, or keep it. Keeping it allows correction.
                        <>
                            <TouchableOpacity
                                style={styles.countrySelector}
                                onPress={toggleCountryPicker}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.countrySelectorFlag}>{selectedCountry.flag}</Text>
                                <Text style={styles.countrySelectorText}>{selectedCountry.country}</Text>
                                <Ionicons
                                    name={showCountryPicker ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={colors.primary}
                                />
                            </TouchableOpacity>

                            {/* Country Picker */}
                            {showCountryPicker && (
                                <View style={styles.countryPicker}>
                                    {COUNTRY_CODES.map((country) => (
                                        <CountryOption
                                            key={country.code}
                                            country={country}
                                            isSelected={country.code === selectedCountry.code}
                                            onSelect={handleSelectCountry}
                                        />
                                    ))}
                                </View>
                            )}
                        </>
                    )}

                    {/* Phone Input Row */}
                    <View style={styles.phoneRow}>
                        <View style={styles.codeContainer}>
                            <Text style={styles.codeText}>{selectedCountry.code}</Text>
                        </View>
                        <View style={styles.phoneInputContainer}>
                            <TextInput
                                ref={inputRef}
                                style={styles.phoneInput}
                                placeholder="phone number"
                                placeholderTextColor={colors.textTertiary}
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
                                keyboardType="number-pad"
                                maxLength={15}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Input (Login Mode Only) */}
                    {isLoginMode && (
                        <View style={[styles.phoneRow, { marginTop: 20 }]}>
                            <View style={[styles.phoneInputContainer, { borderBottomWidth: 2 }]}>
                                <TextInput
                                    ref={passwordRef}
                                    style={styles.phoneInput}
                                    placeholder="Password"
                                    placeholderTextColor={colors.textTertiary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    )}

                    {!isLoginMode && (
                        <Text style={styles.helperText}>
                            Carrier charges may apply
                        </Text>
                    )}
                </View>
            </View>

            {/* Bottom Button */}
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + spacing.xl }]}>
                <TouchableOpacity
                    style={[styles.nextButton, !isButtonEnabled && styles.nextButtonDisabled]}
                    onPress={handleContinue}
                    disabled={!isButtonEnabled || isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color={colors.textLight} size="small" />
                    ) : (
                        <Text style={styles.nextButtonText}>{isLoginMode ? 'Log In' : 'Next'}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
    },
    header: {
        alignItems: 'center',
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    link: {
        color: colors.primary,
    },
    inputSection: {
        marginTop: spacing.lg,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    countrySelectorFlag: {
        fontSize: 22,
        marginRight: spacing.sm,
    },
    countrySelectorText: {
        flex: 1,
        fontSize: 17,
        color: colors.textPrimary,
    },
    countryPicker: {
        backgroundColor: colors.surfaceLight,
        borderRadius: borderRadius.md,
        marginTop: spacing.xs,
        marginBottom: spacing.md,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    countryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.divider,
    },
    countryOptionSelected: {
        backgroundColor: colors.primary + '10',
    },
    flag: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    countryName: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
    },
    countryCodeOption: {
        fontSize: 16,
        color: colors.textSecondary,
        marginRight: spacing.sm,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    codeContainer: {
        paddingVertical: spacing.md,
        paddingRight: spacing.md,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        marginRight: spacing.md,
    },
    codeText: {
        fontSize: 17,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    phoneInputContainer: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        paddingVertical: spacing.md,
    },
    phoneInput: {
        fontSize: 17,
        color: colors.textPrimary,
        padding: 0,
    },
    helperText: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
    buttonContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },
    nextButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full || 25,
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

export default PhoneNumberScreen;
