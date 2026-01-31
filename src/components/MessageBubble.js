import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

const MessageBubble = ({
    message,
    isMe,
    showTail = true,
    previousSameSender = false,
}) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const renderReadReceipt = () => {
        if (!isMe) return null;

        const { status } = message;
        let tickColor = colors.tickGray;
        let doubleTick = false;

        if (status === 'delivered') {
            doubleTick = true;
            tickColor = colors.tickGray;
        } else if (status === 'read') {
            doubleTick = true;
            tickColor = colors.tickBlue;
        }

        return (
            <View style={styles.receiptContainer}>
                <Text style={[styles.tick, { color: tickColor }]}>
                    {doubleTick ? '✓✓' : '✓'}
                </Text>
            </View>
        );
    };

    return (
        <View style={[
            styles.container,
            isMe ? styles.containerMe : styles.containerOther,
            previousSameSender && styles.reducedMargin,
        ]}>
            <View style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleOther,
                showTail && (isMe ? styles.tailMe : styles.tailOther),
            ]}>
                {message.image && (
                    <Image
                        source={{ uri: message.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
                {message.text && (
                    <Text style={[
                        styles.text,
                        isMe ? styles.textMe : styles.textOther
                    ]}>
                        {message.text}
                    </Text>
                )}
                <View style={styles.meta}>
                    <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
                    {renderReadReceipt()}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 2,
        marginHorizontal: spacing.md,
    },
    containerMe: {
        alignItems: 'flex-end',
    },
    containerOther: {
        alignItems: 'flex-start',
    },
    reducedMargin: {
        marginTop: 1,
    },
    bubble: {
        maxWidth: '80%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.bubble,
    },
    bubbleMe: {
        backgroundColor: colors.sentBubble,
        borderBottomRightRadius: 4,
    },
    bubbleOther: {
        backgroundColor: colors.receivedBubble,
        borderBottomLeftRadius: 4,
    },
    tailMe: {
        borderBottomRightRadius: 4,
    },
    tailOther: {
        borderBottomLeftRadius: 4,
    },
    image: {
        width: 200,
        height: 150,
        borderRadius: borderRadius.md,
        marginBottom: spacing.xs,
    },
    text: {
        ...typography.styles.body,
    },
    textMe: {
        color: colors.textPrimary,
    },
    textOther: {
        color: colors.textPrimary,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: spacing.xs,
    },
    time: {
        ...typography.styles.caption2,
        color: colors.textSecondary,
    },
    receiptContainer: {
        marginLeft: spacing.xs,
    },
    tick: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default MessageBubble;
