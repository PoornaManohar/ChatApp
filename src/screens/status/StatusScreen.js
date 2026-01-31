import React, { useState, useCallback, memo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';

// Sample status data
const STATUS_DATA = [
    {
        id: 'my_status',
        name: 'My Status',
        avatar: 'https://i.pravatar.cc/150?img=0',
        time: 'Tap to add status update',
        isMine: true,
        hasUpdate: false,
    },
    {
        id: '1',
        name: 'Andrew Parker',
        avatar: 'https://i.pravatar.cc/150?img=11',
        time: '25 minutes ago',
        hasUpdate: true,
        isSeen: false,
    },
    {
        id: '2',
        name: 'Karen Castillo',
        avatar: 'https://i.pravatar.cc/150?img=12',
        time: '1 hour ago',
        hasUpdate: true,
        isSeen: false,
    },
    {
        id: '3',
        name: 'Maximillian',
        avatar: 'https://i.pravatar.cc/150?img=13',
        time: '3 hours ago',
        hasUpdate: true,
        isSeen: true,
    },
    {
        id: '4',
        name: 'Martha Craig',
        avatar: 'https://i.pravatar.cc/150?img=14',
        time: 'Today, 9:23 AM',
        hasUpdate: true,
        isSeen: true,
    },
];

const StatusItem = memo(({ item, onPress }) => (
    <TouchableOpacity style={styles.statusItem} onPress={onPress} activeOpacity={0.6}>
        <View style={styles.avatarWrapper}>
            <View style={[
                styles.avatarRing,
                item.isMine && styles.avatarRingMine,
                item.isSeen && styles.avatarRingSeen,
            ]}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
            </View>
            {item.isMine && (
                <View style={styles.addButton}>
                    <Ionicons name="add" size={14} color={colors.textLight} />
                </View>
            )}
        </View>
        <View style={styles.statusInfo}>
            <Text style={styles.statusName}>{item.name}</Text>
            <Text style={styles.statusTime}>{item.time}</Text>
        </View>
    </TouchableOpacity>
));

const StatusScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [statuses] = useState(STATUS_DATA);

    const myStatus = statuses.find(s => s.isMine);
    const recentUpdates = statuses.filter(s => !s.isMine && !s.isSeen);
    const viewedUpdates = statuses.filter(s => !s.isMine && s.isSeen);

    const renderStatusItem = useCallback(({ item }) => (
        <StatusItem item={item} onPress={() => { }} />
    ), []);

    const keyExtractor = useCallback((item) => item.id, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Status</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={() => (
                    <>
                        {/* My Status */}
                        <StatusItem item={myStatus} onPress={() => { }} />

                        <View style={styles.separator} />

                        {/* Recent Updates */}
                        {recentUpdates.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>RECENT UPDATES</Text>
                                {recentUpdates.map(item => (
                                    <StatusItem key={item.id} item={item} onPress={() => { }} />
                                ))}
                            </>
                        )}

                        {/* Viewed Updates */}
                        {viewedUpdates.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>VIEWED UPDATES</Text>
                                {viewedUpdates.map(item => (
                                    <StatusItem key={item.id} item={item} onPress={() => { }} />
                                ))}
                            </>
                        )}
                    </>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
            />

            {/* Camera FAB */}
            <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 90 }]}>
                <Ionicons name="camera" size={24} color={colors.textLight} />
            </TouchableOpacity>
        </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarRing: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    avatarRingMine: {
        borderColor: 'transparent',
    },
    avatarRingSeen: {
        borderColor: colors.textSecondary,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surfaceLight,
    },
    addButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    statusInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    statusName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    statusTime: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    separator: {
        height: 8,
        backgroundColor: colors.surfaceLight,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        backgroundColor: colors.surfaceLight,
    },
    fab: {
        position: 'absolute',
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
});

export default StatusScreen;
