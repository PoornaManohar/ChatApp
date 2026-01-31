import React, { memo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';

// Demo Data matching screenshot
const CONTACT_DATA = {
    name: 'Biff Tannen',
    phone: '+1 323 555 1234',
    avatar: 'https://i.pravatar.cc/150?img=3', // Placeholder for Biff
    about: 'Hello, hello. Anybody home?',
    aboutDate: '10 Dec 1993',
};

const ActionButton = ({ icon, label }) => (
    <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
        <View style={styles.actionIconContainer}>
            <Ionicons name={icon} size={24} color="#007AFF" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const SettingsRow = ({ icon, label, value, showChevron = true, isLast = false, color, isRed = false }) => (
    <TouchableOpacity style={[styles.row, isLast && styles.lastRow]} activeOpacity={0.6}>
        {icon && (
            <View style={styles.rowIconContainer}>
                <Ionicons name={icon} size={22} color={color || '#000'} />
            </View>
        )}
        <Text style={[styles.rowLabel, isRed && styles.redText, !icon && styles.noIconLabel]}>{label}</Text>
        <View style={styles.rowRight}>
            {value && <Text style={styles.rowValue}>{value}</Text>}
            {showChevron && <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 6 }} />}
        </View>
    </TouchableOpacity>
);

const ContactInfoScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
                    <Ionicons name="chevron-back" size={26} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Info</Text>
                <TouchableOpacity>
                    <Text style={styles.headerEdit}>Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image source={{ uri: CONTACT_DATA.avatar }} style={styles.avatar} />
                    <Text style={styles.name}>{CONTACT_DATA.name}</Text>
                    <Text style={styles.phone}>{CONTACT_DATA.phone}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                    <ActionButton icon="call-outline" label="Audio" />
                    <ActionButton icon="videocam-outline" label="Video" />
                    <ActionButton icon="search-outline" label="Search" />
                </View>

                {/* About Block */}
                <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.aboutText}>{CONTACT_DATA.about}</Text>
                            <Text style={styles.aboutDate}>{CONTACT_DATA.aboutDate}</Text>
                        </View>
                    </View>
                </View>

                {/* Media Group */}
                <View style={styles.sectionContainer}>
                    <SettingsRow icon="image-outline" label="Media, link and Docs" value="None" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsRow icon="star-outline" label="Starred Messages" value="None" isLast />
                </View>

                {/* Settings Group 1 */}
                <View style={styles.sectionContainer}>
                    <SettingsRow icon="notifications-outline" label="Notifications and Sounds" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsRow icon="color-palette-outline" label="Chat theme" />
                    <View style={styles.separatorWithIcon} />
                    <SettingsRow icon="download-outline" label="Save to Photos" value="Default" isLast />
                </View>

                {/* Settings Group 2 */}
                <View style={styles.sectionContainer}>
                    <SettingsRow icon="time-outline" label="Disappearing Messages" value="Off" />
                    <View style={styles.separatorWithIcon} />
                    <View style={[styles.row]}>
                        <View style={styles.rowIconContainer}>
                            <Ionicons name="lock-closed-outline" size={22} color="#000" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowLabel}>Lock Chat</Text>
                            <Text style={styles.rowSubtitle}>Lock and hide this chat on this device.</Text>
                        </View>
                        <Switch value={true} trackColor={{ true: '#34C759' }} style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} />
                    </View>
                    <View style={styles.separatorWithIcon} />
                    <SettingsRow icon="lock-closed-outline" label="Encryption" isLast showChevron />
                </View>

                {/* Contact Details Link */}
                <View style={styles.sectionContainer}>
                    <SettingsRow icon="person-circle-outline" label="Contact Details" isLast />
                </View>

                {/* Common Groups Header */}
                <Text style={styles.sectionHeader}>No Groups in Common</Text>
                <View style={styles.sectionContainer}>
                    <TouchableOpacity style={[styles.row, styles.lastRow]} activeOpacity={0.6}>
                        <View style={[styles.rowIconContainer, { backgroundColor: '#F0F0F0', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="add" size={20} color="#000" />
                        </View>
                        <Text style={styles.rowLabel}>Create Group with Biff</Text>
                    </TouchableOpacity>
                </View>

                {/* Actions List */}
                <View style={styles.sectionContainer}>
                    <View style={[styles.row]}>
                        <Text style={[styles.rowLabel, { color: '#007AFF' }]}>Share Contact</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={[styles.row]}>
                        <Text style={[styles.rowLabel, { color: '#007AFF' }]}>Add to Favourites</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={[styles.row]}>
                        <Text style={[styles.rowLabel, { color: '#007AFF' }]}>Add to list</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={[styles.row]}>
                        <Text style={[styles.rowLabel, { color: '#007AFF' }]}>Export Chat</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={[styles.row, styles.lastRow]}>
                        <Text style={[styles.rowLabel, { color: '#FF3B30' }]}>Clear Chat</Text>
                    </View>
                </View>

                {/* Block List */}
                <View style={styles.sectionContainer}>
                    <View style={[styles.row]}>
                        <Text style={[styles.rowLabel, { color: '#FF3B30' }]}>Block Biff Tannen</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={[styles.row, styles.lastRow]}>
                        <Text style={[styles.rowLabel, { color: '#FF3B30' }]}>Report Biff Tannen</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 44,
        paddingBottom: 0,
    },
    headerBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
    headerEdit: {
        fontSize: 17,
        color: '#007AFF',
        paddingRight: 16,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    phone: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        width: '31%',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconContainer: {
        marginBottom: 6,
    },
    actionLabel: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
    sectionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginHorizontal: 16,
        marginBottom: 20,
        overflow: 'hidden',
    },
    sectionHeader: {
        fontSize: 13,
        color: colors.textSecondary,
        marginLeft: 32,
        marginBottom: 6,
        textTransform: 'none',
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12, // Standard iOS row height approx
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    rowIconContainer: {
        width: 30,
        marginRight: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLabel: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    noIconLabel: {
        marginLeft: 0,
    },
    rowSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
        paddingRight: 10,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowValue: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#C6C6C8',
        marginLeft: 16,
    },
    separatorWithIcon: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#C6C6C8',
        marginLeft: 52,
    },
    aboutText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    aboutDate: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    redText: {
        color: '#FF3B30',
    },
});

export default ContactInfoScreen;
