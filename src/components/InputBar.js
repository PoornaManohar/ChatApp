import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

const InputBar = ({
    onSend,
    onAttachmentPress,
    onCameraPress,
    onTypingChange,
    placeholder = 'Message',
}) => {
    const [message, setMessage] = useState('');
    const [inputHeight, setInputHeight] = useState(36);
    const typingTimeoutRef = useRef(null);

    const handleTextChange = (text) => {
        setMessage(text);

        // Handle typing indicator
        if (onTypingChange) {
            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // User is typing
            if (text.length > 0) {
                onTypingChange(true);

                // Stop typing after 2 seconds of no input
                typingTimeoutRef.current = setTimeout(() => {
                    onTypingChange(false);
                }, 2000);
            } else {
                onTypingChange(false);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleSend = () => {
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
            setInputHeight(36);

            if (onTypingChange) {
                onTypingChange(false);
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    const handleContentSizeChange = (event) => {
        const height = event.nativeEvent.contentSize.height;
        setInputHeight(Math.min(Math.max(36, height), 100));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={onAttachmentPress}
            >
                <Ionicons name="add" size={28} color={colors.primary} />
            </TouchableOpacity>

            <View style={[styles.inputContainer, { minHeight: inputHeight + 12 }]}>
                <TextInput
                    style={[styles.input, { height: inputHeight }]}
                    value={message}
                    onChangeText={handleTextChange}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    onContentSizeChange={handleContentSizeChange}
                />
            </View>

            {message.trim() ? (
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                >
                    <Ionicons name="send" size={24} color={colors.textLight} />
                </TouchableOpacity>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onCameraPress}
                    >
                        <Ionicons name="camera" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="mic" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surfaceLight,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
    iconButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.xs,
    },
    inputContainer: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        marginHorizontal: spacing.xs,
        justifyContent: 'center',
    },
    input: {
        fontSize: 17,
        color: colors.textPrimary,
        paddingTop: Platform.OS === 'ios' ? 8 : 0,
        paddingBottom: Platform.OS === 'ios' ? 8 : 0,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.xs,
    },
});

export default InputBar;
