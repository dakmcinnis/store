const getShadow = (blur: number, spread: number, alpha: number) => (
    `box-shadow: 0px ${blur}px ${spread}px rgba(0, 0, 0, ${alpha});`
);

export type Shadows = (
    'Z_INDEX_1' |
    'Z_INDEX_2' |
    'Z_INDEX_3' |
    'Z_INDEX_4' |
    'Z_INDEX_5'
);

const SHADOW_STYLE: { [shadowName in Shadows]: string } = {
    'Z_INDEX_1': getShadow(1, 1, 0.1),
    'Z_INDEX_2': getShadow(3, 3, 0.1),
    'Z_INDEX_3': getShadow(6, 6, 0.08),
    'Z_INDEX_4': getShadow(16, 16, 0.1),
    'Z_INDEX_5': getShadow(32, 40, 0.1)
};

export default SHADOW_STYLE;