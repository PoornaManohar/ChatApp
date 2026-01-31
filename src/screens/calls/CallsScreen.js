import React, { useState, useCallback, memo } from 'react';
import {
    View,
    Text,
    SectionList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';

// Sample data
const RECENT_CALLS = [
    {
        id: '1',
        name: 'Daddy',
        avatar: 'https://i.pravatar.cc/150?img=11',
        time: '14:01',
        type: 'outgoing',
        date: 'Today',
    },
    {
        id: '2',
        name: 'Daddy',
        avatar: 'https://i.pravatar.cc/150?img=11',
        time: '14:00',
        type: 'missed',
        date: 'Today',
    },
    {
        id: '3',
        name: 'Daddy',
        avatar: 'https://i.pravatar.cc/150?img=11',
        time: 'Yesterday',
        type: 'outgoing',
        date: 'Yesterday',
    },
    {
        id: '4',
        name: 'Jenny ❤️',
        avatar: 'https://i.pravatar.cc/150?img=5',
        time: '15/10/85',
        type: 'outgoing',
        date: '15/10/85',
    },
    {
        id: '5',
        name: 'Jenny ❤️',
        avatar: 'https://i.pravatar.cc/150?img=5',
        time: '11/10/85',
        type: 'missed',
        date: '11/10/85',
    },
    {
        id: '6',
        name: 'Emmett "Doc" Brown',
        avatar: 'https://i.pravatar.cc/150?img=8',
        time: '02/09/85',
        type: 'outgoing',
        date: '02/09/85',
    },
];

const FAVOURITES_DATA = [
    { id: 'add', title: 'Add favourite', type: 'action' }
];

const CallItem = memo(({ item }) => {
    if (item.type === 'action') {
        return (
            <TouchableOpacity style={styles.callItem} activeOpacity={0.6}>
                <View style={styles.addFavIcon}>
                    <Ionicons name="add" size={20} color={colors.textPrimary} />
                </View>
                <Text style={styles.addFavText}>Add favourite</Text>
            </TouchableOpacity>
        );
    }

    const isMissed = item.type === 'missed';

    return (
        <TouchableOpacity style={styles.callItem} activeOpacity={0.6}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />

            <View style={styles.callInfo}>
                <Text style={[styles.callName, isMissed && styles.callNameMissed]}>
                    {item.name}
                </Text>
                <View style={styles.callMeta}>
                    <Ionicons
                        name="call"
                        size={12}
                        color={colors.textSecondary}
                        style={styles.callTypeIcon}
                    />
                    <Text style={styles.callTypeText}>
                        {item.type === 'outgoing' ? 'Outgoing' : 'Missed'}
                    </Text>
                </View>
            </View>

            <View style={styles.rightContent}>
                <Text style={styles.dateText}>{item.time}</Text>
                <TouchableOpacity style={styles.infoButton}>
                    <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
});

const CallsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    // Sections for SectionList
    const sections = [
        { title: 'Favourites', data: FAVOURITES_DATA },
        { title: 'Recent', data: RECENT_CALLS },
    ];

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.topActions}>
                <TouchableOpacity style={styles.circleButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.circleButtonGreen}>
                    <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            <Text style={styles.largeTitle}>Calls</Text>
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footer}>
            <Ionicons name="lock-closed" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.footerText}>Your personal calls are <Text style={{ color: '#25D366' }}>end-to-end encrypted</Text></Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id + index}
                renderItem={({ item }) => <CallItem item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionTitle}>{title}</Text>
                )}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    topActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        height: 44,
    },
    circleButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleButtonGreen: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#25D366', // WhatsApp Green
        justifyContent: 'center',
        alignItems: 'center',
    },
    largeTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginTop: spacing.xs,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.textPrimary,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
        backgroundColor: colors.background,
    },
    callItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surfaceLight,
    },
    addFavIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addFavText: {
        fontSize: 16,
        color: colors.textPrimary,
        marginLeft: spacing.md,
        fontWeight: '500',
    },
    callInfo: {
        flex: 1,
        marginLeft: spacing.md,
        justifyContent: 'center',
    },
    callName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    callNameMissed: {
        color: '#FF3B30',
    },
    callMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    callTypeIcon: {
        marginRight: 4,
    },
    callTypeText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginRight: spacing.sm,
    },
    infoButton: {
        padding: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
    },
    footerText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
});

export default CallsScreen;
