import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Image,
    Keyboard,
    ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { useUser } from '../../context/UserContext';
import socketService from '../../services/socketService';

// Memoized Message Bubble for smooth scrolling
const MessageBubble = memo(({ message, isMe, showAvatar }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
            {!isMe && showAvatar && (
                <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=0' }}
                    style={styles.messageAvatar}
                />
            )}
            {!isMe && !showAvatar && <View style={styles.avatarSpacer} />}

            <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                {message.image && (
                    <Image source={{ uri: message.image }} style={styles.messageImage} />
                )}
                <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
                    {message.text}
                </Text>
                <View style={styles.messageFooter}>
                    <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>
                        {formatTime(message.timestamp)}
                    </Text>
                    {isMe && (
                        <Ionicons
                            name="checkmark-done"
                            size={14}
                            color={message.status === 'read' ? colors.tickBlue : 'rgba(255,255,255,0.6)'}
                            style={styles.checkmark}
                        />
                    )}
                </View>
            </View>
        </View>
    );
});

// Input Bar Component
const InputBar = memo(({ onSend }) => {
    const [text, setText] = useState('');

    const handleSend = useCallback(() => {
        if (text.trim()) {
            onSend(text.trim());
            setText('');
        }
    }, [text, onSend]);

    return (
        <View style={styles.inputBar}>
            <TouchableOpacity style={styles.inputButton}>
                <Ionicons name="add" size={30} color="#000000" />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder=""
                    placeholderTextColor={colors.textSecondary}
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={1000}
                />
                <TouchableOpacity style={styles.stickerButton}>
                    <Ionicons name="happy-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {text.trim() ? (
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            ) : (
                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="camera-outline" size={26} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="mic-outline" size={26} color="#000" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
});

const ChatScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { chatId, participant } = route.params;
    const { currentUser, isConnected } = useUser();
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef(null);
    const hasJoined = useRef(false);

    // Connect to chat room
    useEffect(() => {
        if (isConnected && !hasJoined.current) {
            hasJoined.current = true;
            socketService.joinChat(chatId);

            if (socketService.socket) {
                socketService.socket.on('chat-history', (history) => {
                    setMessages(history);
                });
            }
        }

        return () => {
            hasJoined.current = false;
        };
    }, [isConnected, chatId]);

    // Listen for messages
    useEffect(() => {
        if (!socketService.socket) return;

        const handleMessage = (message) => {
            setMessages(prev => {
                if (prev.some(m => m.id === message.id)) return prev;
                return [...prev, message];
            });
        };

        const handleTyping = ({ userId, isTyping: typing }) => {
            if (userId !== currentUser?.id) {
                setIsTyping(typing);
            }
        };

        socketService.socket.on('message', handleMessage);
        socketService.socket.on('typing', handleTyping);

        return () => {
            socketService.socket?.off('message', handleMessage);
            socketService.socket?.off('typing', handleTyping);
        };
    }, [currentUser?.id]);

    const handleSend = useCallback((text) => {
        if (!text.trim() || !currentUser) return;
        socketService.sendMessage(chatId, text);
    }, [chatId, currentUser]);

    const renderMessage = useCallback(({ item, index }) => {
        const isMe = item.senderId === currentUser?.id;
        const prevMessage = messages[index - 1];
        const showAvatar = !isMe && prevMessage?.senderId !== item.senderId;

        return (
            <MessageBubble
                message={item}
                isMe={isMe}
                showAvatar={showAvatar}
            />
        );
    }, [messages, currentUser?.id]);

    const keyExtractor = useCallback((item) => item.id, []);

    return (
        <ImageBackground
            source={require('../../../assets/chat_background.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={32} color="#000000" />
                    <Text style={styles.backText}>1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerProfile}
                    onPress={() => navigation.navigate('ContactInfo')}
                >
                    <Image
                        source={{ uri: participant.avatar }}
                        style={styles.headerAvatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName} numberOfLines={1}>
                            {participant.name}
                        </Text>
                        <Text style={styles.headerStatus}>
                            tap here for contact info
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="videocam-outline" size={26} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="call-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView
                    style={styles.messagesWrapper}
                    behavior="padding"
                    keyboardVerticalOffset={0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={keyExtractor}
                        style={styles.messagesList}
                        contentContainerStyle={styles.messagesContent}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        keyboardShouldPersistTaps="handled"
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={15}
                        windowSize={10}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="chatbubbles-outline" size={60} color={colors.iconGray} />
                                <Text style={styles.emptyText}>No messages yet</Text>
                                <Text style={styles.emptySubtext}>Send a message to start the conversation</Text>
                            </View>
                        )}
                    />

                    <View style={{ paddingBottom: insets.bottom, backgroundColor: '#FFFFFF' }}>
                        <InputBar onSend={handleSend} />
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <KeyboardAvoidingView
                    style={styles.messagesWrapper}
                    behavior="height"
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={keyExtractor}
                        style={styles.messagesList}
                        contentContainerStyle={styles.messagesContent}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        keyboardShouldPersistTaps="handled"
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={15}
                        windowSize={10}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="chatbubbles-outline" size={60} color={colors.iconGray} />
                                <Text style={styles.emptyText}>No messages yet</Text>
                                <Text style={styles.emptySubtext}>Send a message to start the conversation</Text>
                            </View>
                        )}
                    />

                    <View style={{ paddingBottom: 0, backgroundColor: '#FFFFFF' }}>
                        <InputBar onSend={handleSend} />
                    </View>
                </KeyboardAvoidingView>
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7', // iOS Light Header
        paddingHorizontal: spacing.xs,
        paddingBottom: spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xs,
    },
    backText: {
        fontSize: 17,
        color: '#000000',
        marginLeft: -4,
    },
    headerProfile: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.surfaceLight,
        marginRight: spacing.sm,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    headerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    headerStatus: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: spacing.sm,
        marginLeft: spacing.xs,
    },
    messagesWrapper: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        flexGrow: 1,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
        paddingHorizontal: spacing.xs,
    },
    messageRowMe: {
        justifyContent: 'flex-end',
    },
    messageAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: spacing.xs,
        marginTop: 4,
    },
    avatarSpacer: {
        width: 28,
        marginRight: spacing.xs,
    },
    bubble: {
        maxWidth: '75%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.bubble,
    },
    bubbleMe: {
        backgroundColor: colors.sentBubble,
        borderTopRightRadius: 4,
    },
    bubbleOther: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 4,
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginBottom: spacing.xs,
    },
    messageText: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 22,
    },
    messageTextMe: {
        color: '#303030',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 2,
    },
    messageTime: {
        fontSize: 11,
        color: 'rgba(0,0,0,0.45)',
    },
    messageTimeMe: {
        color: 'rgba(0,0,0,0.45)',
    },
    checkmark: {
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.sm,
        backgroundColor: '#FFFFFF', // White background
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
    inputButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', // Center vertically
        backgroundColor: '#FFFFFF',
        borderRadius: 20, // Capsule
        borderWidth: 1,
        borderColor: '#E5E5EA',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2, // Compact
        marginHorizontal: spacing.xs,
        minHeight: 36,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        maxHeight: 100,
        paddingTop: Platform.OS === 'ios' ? 8 : 4,
        paddingBottom: Platform.OS === 'ios' ? 8 : 4,
    },
    stickerButton: {
        padding: 4,
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.textLink, // Blue send button
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        marginRight: 4,
    },
});

export default ChatScreen;
