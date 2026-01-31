import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Avatar from './Avatar';
import { colors, typography, spacing } from '../theme';

const ChatListItem = ({
    chat,
    onPress,
    onArchive,
    onMore,
}) => {
    const { participant, lastMessage, unreadCount } = chat;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit'
            });
        }
    };

    const renderReadReceipt = () => {
        if (lastMessage.senderId !== 'me') return null;

        const { status } = lastMessage;
        let tickColor = colors.tickGray;
        let doubleTick = false;

        if (status === 'delivered') {
            doubleTick = true;
        } else if (status === 'read') {
            doubleTick = true;
            tickColor = colors.tickBlue;
        }

        return (
            <Text style={[styles.tick, { color: tickColor }]}>
                {doubleTick ? '✓✓ ' : '✓ '}
            </Text>
        );
    };

    const renderRightActions = () => (
        <View style={styles.swipeActions}>
            <TouchableOpacity
                style={[styles.swipeAction, styles.moreAction]}
                onPress={onMore}
            >
                <Text style={styles.swipeActionText}>More</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.swipeAction, styles.archiveAction]}
                onPress={onArchive}
            >
                <Text style={styles.swipeActionText}>Archive</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity
                style={styles.container}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <Avatar
                    uri={participant?.avatar}
                    size={50}
                />
                <View style={styles.content}>
                    <View style={styles.topRow}>
                        <Text style={styles.name} numberOfLines={1}>
                            {participant?.name}
                        </Text>
                        <Text style={[
                            styles.time,
                            unreadCount > 0 && styles.timeUnread
                        ]}>
                            {formatTime(lastMessage?.timestamp)}
                        </Text>
                    </View>
                    <View style={styles.bottomRow}>
                        <View style={styles.messageContainer}>
                            {renderReadReceipt()}
                            <Text style={styles.message} numberOfLines={1}>
                                {lastMessage?.text}
                            </Text>
                        </View>
                        {unreadCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        marginLeft: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.divider,
        paddingBottom: spacing.md,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        ...typography.styles.bodyBold,
        flex: 1,
        marginRight: spacing.sm,
    },
    time: {
        ...typography.styles.caption1,
        color: colors.textSecondary,
    },
    timeUnread: {
        color: colors.secondary,
    },
    messageContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    message: {
        ...typography.styles.subhead,
        color: colors.textSecondary,
        flex: 1,
    },
    tick: {
        fontSize: 12,
        fontWeight: '600',
    },
    badge: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: spacing.sm,
    },
    badgeText: {
        ...typography.styles.caption2,
        color: colors.textLight,
        fontWeight: '600',
    },
    swipeActions: {
        flexDirection: 'row',
    },
    swipeAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    moreAction: {
        backgroundColor: colors.more,
    },
    archiveAction: {
        backgroundColor: colors.archive,
    },
    swipeActionText: {
        ...typography.styles.subhead,
        color: colors.textLight,
        fontWeight: '500',
    },
});

export default ChatListItem;
