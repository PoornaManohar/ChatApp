import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=0';

const Avatar = ({
    source,
    uri,
    size = 50,
    showStatus = false,
    isOnline = false,
    statusRingColor = colors.secondary,
    style
}) => {
    const avatarSize = { width: size, height: size, borderRadius: size / 2 };

    return (
        <View style={[styles.container, style]}>
            <Image
                source={source || { uri: uri || DEFAULT_AVATAR }}
                style={[styles.avatar, avatarSize]}
            />
            {showStatus && (
                <View style={[
                    styles.statusIndicator,
                    {
                        backgroundColor: isOnline ? statusRingColor : colors.iconGray,
                        right: size * 0.02,
                        bottom: size * 0.02,
                    }
                ]} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    avatar: {
        backgroundColor: colors.surfaceLight,
    },
    statusIndicator: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: colors.background,
    },
});

export default Avatar;
