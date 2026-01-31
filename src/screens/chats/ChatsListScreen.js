import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useUser } from '../../context/UserContext';

// Back to the Future Theme Data
const CHATS_DATA = [
    {
        id: '1',
        name: 'Jenny ❤️',
        avatar: 'https://i.pravatar.cc/150?img=5',
        lastMessage: 'You reacted 😆 to "That\'s good advice, Marty."',
        time: '16:14',
        unread: 0,
        isPinned: true,
        reaction: '😆',
    },
    {
        id: '2',
        name: 'Mom 💕',
        avatar: 'https://i.pravatar.cc/150?img=9',
        lastMessage: 'Mom is typing...',
        time: '19:45',
        unread: 1,
        isTyping: true,
        mention: true,
    },
    {
        id: '3',
        name: 'Daddy',
        avatar: 'https://i.pravatar.cc/150?img=11',
        lastMessage: 'I mean he wrecked it! 😭',
        time: '19:42',
        unread: 0,
        isSent: true,
        isRead: true,
    },
    {
        id: '4',
        name: 'Biff Tannen',
        avatar: 'https://i.pravatar.cc/150?img=3',
        lastMessage: 'Say hi to your mom for me.',
        time: '18:23',
        unread: 0,
    },
    {
        id: '5',
        name: 'Clocktower Lady',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Save the clock tower?',
        time: '16:15',
        unread: 0,
    },
    {
        id: '6',
        name: 'Mr. Strickland',
        avatar: 'https://i.pravatar.cc/150?img=13',
        lastMessage: '🚫 You deleted this message.',
        time: '08:57',
        unread: 0,
    },
    {
        id: '7',
        name: 'Emmett "Doc" Brown',
        avatar: 'https://i.pravatar.cc/150?img=8',
        lastMessage: 'Location',
        time: 'Yesterday',
        unread: 1,
        isLocation: true,
    },
];

const FILTER_TABS = ['All', 'Unread', 'Favourites', 'Groups'];

const ChatItem = React.memo(({ chat, onPress }) => (
    <TouchableOpacity
        style={styles.chatItem}
        onPress={onPress}
        activeOpacity={0.6}
    >
        <View style={styles.avatarContainer}>
            {chat.isTyping || chat.unread > 0 ? (
                <View style={styles.greenRing}>
                    <Image source={{ uri: chat.avatar }} style={styles.avatarSmall} />
                </View>
            ) : (
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
            )}
        </View>

        <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
                <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                <Text style={[styles.chatTime, chat.unread > 0 && styles.chatTimeUnread]}>
                    {chat.time}
                </Text>
            </View>

            <View style={styles.chatFooter}>
                <View style={styles.messageRow}>
                    {chat.isSent && (
                        <Ionicons
                            name="checkmark-done"
                            size={16}
                            color={chat.isRead ? '#34B7F1' : colors.textSecondary}
                            style={styles.checkIcon}
                        />
                    )}
                    {chat.isTyping ? (
                        <Text style={styles.typingText}>Typing...</Text>
                    ) : (
                        <Text style={styles.chatMessage} numberOfLines={1}>
                            {chat.lastMessage}
                        </Text>
                    )}
                </View>

                <View style={styles.badges}>
                    {chat.isPinned && (
                        <Ionicons name="pin" size={14} color={colors.textSecondary} style={{ marginLeft: 4 }} />
                    )}
                    {chat.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{chat.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    </TouchableOpacity>
));

const ChatsListScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { logout } = useUser();

    const handleChatPress = useCallback((chat) => {
        navigation.navigate('Chat', {
            chatId: chat.id,
            participant: {
                id: chat.id,
                name: chat.name,
                avatar: chat.avatar,
            },
        });
    }, [navigation]);

    const renderChat = useCallback(({ item }) => (
        <ChatItem chat={item} onPress={() => handleChatPress(item)} />
    ), [handleChatPress]);

    const renderHeader = () => (
        <>
            <View style={styles.header}>
                <TouchableOpacity style={styles.circleButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.circleButton} onPress={() => { }}>
                        <Ionicons name="camera-outline" size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.circleButtonGreen, { marginLeft: 12 }]}>
                        <Ionicons name="add" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.headerTitle}>Chats</Text>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
                style={{ marginBottom: 16 }}
            >
                {FILTER_TABS.map((tab, index) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.filterPill, index === 0 && styles.filterPillActive]}
                    >
                        <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.filterAddButton}>
                    <Ionicons name="add" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
            </ScrollView>

            {/* Archived */}
            <TouchableOpacity style={styles.archivedRow}>
                <View style={styles.archivedIcon}>
                    <Ionicons name="archive-outline" size={18} color={colors.textSecondary} />
                </View>
                <Text style={styles.archivedText}>Archived</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.archivedCount}>1</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
        </>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <FlatList
                data={CHATS_DATA}
                renderItem={renderChat}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
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
        paddingHorizontal: spacing.md,
        height: 44,
        marginBottom: spacing.md,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: colors.textPrimary,
        paddingHorizontal: spacing.md,
        marginTop: spacing.xs,
        marginBottom: spacing.md,
    },
    filtersContainer: {
        paddingHorizontal: spacing.md,
        alignItems: 'center',
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        marginRight: 8,
    },
    filterPillActive: {
        backgroundColor: '#DCF8C6', // Light Green match
    },
    filterText: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#128C7E', // Teal/Green Text
    },
    filterAddButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    archivedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    archivedIcon: {
        width: 24,
        marginRight: spacing.lg,
        alignItems: 'center',
    },
    archivedText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    archivedCount: {
        fontSize: 14,
        color: '#25D366',
        fontWeight: '500',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.divider,
        marginLeft: 82,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        backgroundColor: colors.background,
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.surfaceLight,
    },
    avatarSmall: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.surfaceLight,
    },
    greenRing: {
        width: 54,
        height: 54,
        borderRadius: 27,
        borderWidth: 2,
        borderColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
        flex: 1,
    },
    chatTime: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    chatTimeUnread: {
        color: '#25D366',
    },
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messageRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    chatMessage: {
        fontSize: 14,
        color: colors.textSecondary,
        flex: 1,
    },
    typingText: {
        fontSize: 14,
        color: '#25D366',
        fontWeight: '500',
        fontStyle: 'italic',
    },
    checkIcon: {
        marginRight: 4,
    },
    badges: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    unreadBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default ChatsListScreen;
