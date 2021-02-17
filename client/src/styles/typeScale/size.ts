const getSize = (fontSize: number, lineHeight: number) => (
    `font-size: ${fontSize}px; line-height: ${lineHeight}px;`
);

export type Sizes = (
    'H100_TINY' |
    'H200_OVERLINE' |
    'H300_CAPTION' |
    'H400_BODY' |
    'H400_PARAGRAPH' |
    'H500_SUBHEADER' |
    'H600_TITLE' |
    'H700_HEADING' |
    'HB_DISPLAY_1' |
    'HB_DISPLAY_2' |
    'HB_DISPLAY_3' |
    'HB_DISPLAY_4' |
    'HB_DISPLAY_5'
);

const SIZE_STYLES: {[sizeName in Sizes]: string} = {
    H100_TINY: getSize(10, 16),
    H200_OVERLINE: getSize(10, 16) + ' letter-spacing: 0.1em; text-transform: uppercase;',
    H300_CAPTION: getSize(12, 20),
    H400_BODY: getSize(14, 22),
    H400_PARAGRAPH: getSize(14, 24),
    H500_SUBHEADER: getSize(16, 28),
    H600_TITLE:  getSize(20, 32),
    H700_HEADING: getSize(24, 36),
    HB_DISPLAY_1: getSize(28, 40),
    HB_DISPLAY_2: getSize(36, 48),
    HB_DISPLAY_3: getSize(48, 64),
    HB_DISPLAY_4: getSize(55, 64),
    HB_DISPLAY_5: getSize(64, 72),
};

export default SIZE_STYLES;
