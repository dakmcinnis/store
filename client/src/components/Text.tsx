import styled from 'styled-components';
import { TypeScale } from '../styles';

interface TextProps {
    fontColor: string,
    size: TypeScale.Sizes,
    weight?: TypeScale.Weights, // default value = 'REGULAR'
}

const Text = styled.div<TextProps>`
    color: ${props => props.fontColor};
    ${TypeScale.BASE_CSS}
    ${props => TypeScale.FONT_SIZES_CSS[props.size]}
    ${props => TypeScale.FONT_WEIGHTS_CSS[props.weight || 'REGULAR']}
    word-wrap: break-word;
`;

export default Text;
