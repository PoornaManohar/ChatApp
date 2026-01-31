import React, { useCallback, memo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    TextInput,
    Platform,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useUser } from '../../context/UserContext';

// Profile Data
const PROFILE_DATA = {
    name: 'Marty McFly',
    status: 'Nobody calls me chicken! 🐔',
    avatar: 'https://i.pravatar.cc/150?img=11',
};

const SettingsItem = memo(({ icon, title, showChevron = true, isLast = false, onPress }) => (
    <TouchableOpacity
        style={[styles.settingsItem, isLast && styles.lastItem]}
        activeOpacity={0.6}
        onPress={onPress}
    >
        <View style={styles.itemLeft}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={22} color={colors.textPrimary} />
            </View>
            <Text style={styles.itemTitle}>{title}</Text>
        </View>
        {showChevron && (
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        )}
    </TouchableOpacity>
));

const MetaItem = memo(({ icon, title, isLast = false }) => (
    <TouchableOpacity style={[styles.settingsItem, isLast && styles.lastItem]} activeOpacity={0.6}>
        <View style={styles.itemLeft}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={22} color={colors.textPrimary} />
            </View>
            <Text style={styles.itemTitle}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </TouchableOpacity>
));

const SettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { logout } = useUser();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
                style={styles.scrollView}
            >
                {/* Header Title */}
                <Text style={styles.headerTitle}>Settings</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                {/* Profile Section */}
                <View style={styles.sectionContainer}>
                    <TouchableOpacity style={styles.profileRow} activeOpacity={0.6}>
                        <Image
                            source={{ uri: PROFILE_DATA.avatar }}
                            style={styles.profileAvatar}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{PROFILE_DATA.name}</Text>
                            <Text style={styles.profileStatus} numberOfLines={1}>{PROFILE_DATA.status}</Text>
                        </View>
                        <TouchableOpacity style={styles.qrButton}>
                            <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.avatarRow} activeOpacity={0.6}>
                        <View style={styles.itemLeft}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="happy-outline" size={24} color={colors.textPrimary} />
                            </View>
                            <Text style={styles.itemTitle}>Avatar</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* Section 1 */}
                <View style={styles.sectionContainer}>
                    <SettingsItem icon="albums-outline" title="List" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsItem icon="megaphone-outline" title="Broadcast messages" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsItem icon="star-outline" title="Starred messages" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsItem icon="laptop-outline" title="Linked devices" isLast />
                </View>

                {/* Section 2 */}
                <View style={styles.sectionContainer}>
                    <SettingsItem icon="key-outline" title="Account" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsItem icon="lock-closed-outline" title="Privacy" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsItem icon="chatbubble-outline" title="Chats" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsItem icon="notifications-outline" title="Notifications" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsItem icon="swap-vertical-outline" title="Storage and data" isLast />
                </View>

                {/* Section 3 */}
                <View style={styles.sectionContainer}>
                    <SettingsItem icon="information-circle-outline" title="Help" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsItem icon="heart-outline" title="Invite a friend" isLast />
                </View>

                {/* Meta Section */}
                <Text style={styles.metaHeader}>Also from Meta</Text>
                <View style={styles.sectionContainer}>
                    <MetaItem icon="logo-instagram" title="Open Instagram" />
                    <View style={styles.separatorWithIcon} />
                    <MetaItem icon="logo-facebook" title="Open Facebook" />
                    <View style={styles.separatorWithIcon} />
                    <MetaItem icon="at-outline" title="Open Threads" isLast />
                </View>

                {/* Logout */}
                <TouchableOpacity onPress={logout} style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 16 }}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // iOS Grouped Background
    },
    scrollView: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#000000',
        marginHorizontal: 16,
        marginTop: 60, // Significant gap as requested
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3E3E8', // Search Bar Gray
        marginHorizontal: 16,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 17,
        color: colors.textPrimary,
        marginLeft: 6,
        padding: 0,
    },
    sectionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginHorizontal: 16,
        marginBottom: 20,
        overflow: 'hidden',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E1E1E1',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    profileStatus: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    qrButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 16,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12, // Slightly tighter
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center', // Center icon
        marginRight: 12,
    },
    itemTitle: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '400',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#C6C6C8',
        marginLeft: 88, // Indent for profile separator (60+12+16)
    },
    separatorWithIcon: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#C6C6C8',
        marginLeft: 58, // Indent past icon (16+30+12 = 58)
    },
    metaHeader: {
        fontSize: 13,
        color: colors.textSecondary,
        marginLeft: 32, // Indent
        marginBottom: 6,
        textTransform: 'none',
    },
});

export default SettingsScreen;
