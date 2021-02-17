export type Weights = (
    'LIGHT' |
    'REGULAR' |
    'MEDIUM' |
    'SEMIBOLD' |
    'BOLD' |
    'BOLD_2'
);

const WEIGHT_STYLES: {[weightName in Weights]: string} = {
    LIGHT: 'font-weight: 300;',
    REGULAR: 'font-weight: normal;',
    MEDIUM: 'font-weight: 500;',
    SEMIBOLD: 'font-weight: 600;',
    BOLD: 'font-weight: bold;',
    BOLD_2: 'font-weight: 800;',
};

export default WEIGHT_STYLES;
