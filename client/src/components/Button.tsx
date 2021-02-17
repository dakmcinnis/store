import { Color, ShadowStyle, TypeScale } from "../styles";
import React, { useState, useCallback } from "react";
import styled from 'styled-components';
import Text from './Text';

export type Size = (
    'SMALL' | 'MEDIUM' | 'LARGE'
);

export type Type = (
    'PRIMARY' | 'SECONDARY' | 'TERTIARY' | 'TEXTLINK'
);

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    type: Type,
    size: Size,
    text?: string,
    icon?: any,
    isIconOnRight?: boolean
}

const BasicButton = styled.div<ButtonProps>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    ${props => getPadding(props.size, !!props.icon, !!props.text)}
    ${props => getBorderRadius(props.size, !!props.icon, !!props.text)}
    ${props => getBackground(props.type, false, false)}
    ${props => getBorder(props.type, false)}
    ${props => getShadow(props.type)}
    &:hover {
        ${props => getBackground(props.type, true, false)}
    }
    &:active {
        ${props => getBackground(props.type, false, true)}
        ${props => getBorder(props.type, true)}
    }
`;

const Button = (props: ButtonProps) => {
    const { onClick, type, size, text, icon: IconProp, isIconOnRight } = props;
    const [fontColor, setFontColor] = useState(DefaultTextColor[type]);
    const [isClicked, setClicked] = useState(false);

    const onClickHelper = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // This function is executed onClick of the button.
        // We make use of "onClick" from props,
        // while having some additional function calls for styling.
        if (onClick) onClick(event);
        setClicked(!isClicked);
        setFontColor(ActiveTextColor[type]);
    }, [type, onClick, isClicked]);

    const onMouseEnter = useCallback(() => {
        if (!isClicked) {
            setFontColor(HoverTextColor[type]);
        }
    }, [type, isClicked]);

    const onMouseLeave = useCallback(() => {
        if (!isClicked) {
            setFontColor(DefaultTextColor[type]);
        }
    }, [type, isClicked]);

    const Icon = useCallback(() => (
        <IconProp color={DefaultTextColor[type]} size='16px' />
    ), [type]);

    return (
        <BasicButton {...props} onClick={onClickHelper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {!!IconProp && !isIconOnRight && <Icon />}
            {text &&
                <ButtonText
                    isIconOnRight={isIconOnRight}
                    fontColor={fontColor}
                    size={FontSize[size]}
                    buttonSize={size}
                    hasIcon={!!IconProp}
                    weight='MEDIUM'
                >
                    {text}
                </ButtonText>
            }
            {!!IconProp && isIconOnRight && <Icon />}
        </BasicButton>
    );
};

export default Button;

interface ButtonTextProps {
    isIconOnRight?: boolean;
    hasIcon?: boolean;
    buttonSize: Size;
}

const ButtonText = styled(Text) <ButtonTextProps>`
    ${props => props.hasIcon && (props.isIconOnRight ? 'padding-right: 8px;' : 'padding-left: 8px;')}
    ${props => SizeStyle[props.buttonSize]}
    white-space: nowrap;
`;

const getPadding = (size: Size, hasIcon: boolean, hasText: boolean) => {
    let paddingTop = 0;
    let paddingRight = 0;
    switch (size) {
        case 'SMALL':
            if (hasIcon && !hasText) {
                /* icon, no text */
                paddingTop = 8;
                paddingRight = 8;
            } else if (hasIcon && hasText) {
                /* icon, text */
                paddingTop = 6;
                paddingRight = 12;
            } else if (!hasIcon && hasText) {
                /* No icon, text */
                paddingTop = 6;
                paddingRight = 12;
            }
            break;
        case 'MEDIUM':
            if (hasIcon && !hasText) {
                /* icon, no text */
                paddingTop = 12;
                paddingRight = 12;
            } else if (hasIcon && hasText) {
                /* icon, text */
                paddingTop = 8;
                paddingRight = 12;
            } else if (!hasIcon && hasText) {
                /* No icon, text */
                paddingTop = 8;
                paddingRight = 12;
            }
            break;
        case 'LARGE':
            if (hasIcon && !hasText) {
                /* icon, no text */
                paddingTop = 18;
                paddingRight = 18;
            } else if (hasIcon && hasText) {
                /* icon, text */
                paddingTop = 12;
                paddingRight = 16;
            } else if (!hasIcon && hasText) {
                /* No icon, text */
                paddingTop = 12;
                paddingRight = 24;
            }
            break;
    }
    return `padding: ${paddingTop}px ${paddingRight}px;`
}

const getBorderRadius = (size: Size, hasIcon: boolean, hasText: boolean) => {
    let borderRad = 0;
    switch (size) {
        case 'SMALL':
            borderRad = hasIcon && !hasText ? 100 : 6;
            break;
        case 'MEDIUM':
            borderRad = hasIcon && !hasText ? 100 : 8;
            break;
        case 'LARGE':
            borderRad = hasIcon && !hasText ? 100 : 8;
            break;
    }
    return `border-radius: ${borderRad}px;`
}

const SizeStyle: { [size in Size]: string } = {
    'SMALL': 'line-height: 20px;',
    'MEDIUM': 'line-height: 24px;',
    'LARGE': 'line-height: 28px;'
}

const FontSize: { [size in Size]: TypeScale.Sizes } = {
    'SMALL': 'H300_CAPTION',
    'MEDIUM': 'H400_PARAGRAPH',
    'LARGE': 'H500_SUBHEADER'
};

const DefaultTextColor: { [type in Type]: string } = {
    'PRIMARY': Color.NEUTRAL.WHITE,
    'SECONDARY': Color.PRIMARY.BRAND['900'],
    'TERTIARY': Color.NEUTRAL.BLACK,
    'TEXTLINK': Color.PRIMARY.BRAND['900']
};

const ActiveTextColor: { [type in Type]: string } = {
    'PRIMARY': Color.NEUTRAL.WHITE,
    'SECONDARY': Color.PRIMARY.BRAND['900'],
    'TERTIARY': Color.NEUTRAL.BLACK,
    'TEXTLINK': Color.PRIMARY.BRAND['900']
};

const HoverTextColor: { [type in Type]: string } = {
    'PRIMARY': Color.NEUTRAL.WHITE,
    'SECONDARY': Color.PRIMARY.BRAND['900'],
    'TERTIARY': Color.NEUTRAL.BLACK,
    'TEXTLINK': Color.PRIMARY.BRAND['700']
};

const getBackground = (type: Type, hover: boolean, active: boolean) => {
    let color = '';
    switch (type) {
        case 'PRIMARY':
            if (hover) {
                color = Color.PRIMARY.BRAND['800']
            } else if (active) {
                color = Color.PRIMARY.BRAND['900']
            } else {
                color = Color.PRIMARY.BRAND.MAIN
            }
            break;
        case 'SECONDARY':
            if (hover) {
                color = Color.PRIMARY.BRAND['200']
            } else if (active) {
                color = Color.PRIMARY.BRAND['400']
            } else {
                color = Color.NEUTRAL.WHITE
            }
            break;
        case 'TERTIARY':
            if (hover) {
                color = Color.PRIMARY.GREY['200']
            } else if (active) {
                color = Color.PRIMARY.GREY['300']
            } else {
                color = Color.NEUTRAL.WHITE
            }
            break;
        case 'TEXTLINK':
            break;
    }

    return `background: ${color};`
}

const getBorder = (type: Type, active: boolean) => {
    switch (type) {
        case 'PRIMARY':
            if (active) {
                return `border: 1px solid ${Color.PRIMARY.BRAND_DARK['900']}; box-sizing: border-box;`
            }
            return `border: 1px solid ${Color.PRIMARY.BRAND['900']}; box-sizing: border-box;`;
        case 'SECONDARY':
            return `border: 1px solid ${Color.PRIMARY.BRAND['700']}; box-sizing: border-box;`
        case 'TERTIARY':
            return `border: 1px solid ${Color.OUTLINE.MEDIUM}; box-sizing: border-box;`
        case 'TEXTLINK':
            return '';
    }
}

const getShadow = (type: Type) => {
    switch (type) {
        case 'PRIMARY':
            return '';
        case 'SECONDARY':
            return ShadowStyle.default.Z_INDEX_1
        case 'TERTIARY':
            return ShadowStyle.default.Z_INDEX_1
        case 'TEXTLINK':
            return '';
    }
}
