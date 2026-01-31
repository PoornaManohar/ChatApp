// Spacing and layout constants
export const spacing = {
    // Base spacing unit
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,

    // Screen padding
    screenHorizontal: 16,
    screenVertical: 16,

    // Component spacing
    listItemPadding: 16,
    avatarMargin: 12,
    bubblePadding: 8,
    inputBarHeight: 52,
    tabBarHeight: 83, // iPhone X safe area
    headerHeight: 44,
    statusBarHeight: 44,
};

export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,

    // Specific components
    avatar: 25,
    bubble: 18,
    input: 12,
    button: 8,
};

export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
};

export default { spacing, borderRadius, shadows };
