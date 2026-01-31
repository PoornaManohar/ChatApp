import { Platform } from 'react-native';

// Typography matching WhatsApp iOS design
export const typography = {
    // Font Family
    fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
    }),

    // Font Sizes
    sizes: {
        xs: 11,
        sm: 13,
        md: 15,
        lg: 17,
        xl: 20,
        xxl: 28,
        xxxl: 34,
    },

    // Font Weights
    weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    // Line Heights
    lineHeights: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
    },

    // Pre-defined Text Styles
    styles: {
        // Headers
        largeTitle: {
            fontSize: 34,
            fontWeight: '700',
            lineHeight: 41,
        },
        title1: {
            fontSize: 28,
            fontWeight: '700',
            lineHeight: 34,
        },
        title2: {
            fontSize: 22,
            fontWeight: '700',
            lineHeight: 28,
        },
        title3: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 25,
        },

        // Body
        body: {
            fontSize: 17,
            fontWeight: '400',
            lineHeight: 22,
        },
        bodyBold: {
            fontSize: 17,
            fontWeight: '600',
            lineHeight: 22,
        },

        // Secondary Text
        subhead: {
            fontSize: 15,
            fontWeight: '400',
            lineHeight: 20,
        },
        subheadBold: {
            fontSize: 15,
            fontWeight: '600',
            lineHeight: 20,
        },

        // Tertiary Text
        footnote: {
            fontSize: 13,
            fontWeight: '400',
            lineHeight: 18,
        },

        // Small Text
        caption1: {
            fontSize: 12,
            fontWeight: '400',
            lineHeight: 16,
        },
        caption2: {
            fontSize: 11,
            fontWeight: '400',
            lineHeight: 13,
        },
    },
};

export default typography;
