/* Helpful resources
https://material-ui.com/customization/components/#customizing-components
https://github.com/mui-org/material-ui/issues/9574
https://stackoverflow.com/questions/51204109/how-to-style-material-ui-v1-textfield-similar-to-the-v0-textfield
*/

import React, { useMemo } from 'react';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import COLOR from '../styles/color';
import Text from './Text';
import styled from 'styled-components';
import { XCircle, CheckCircle } from 'react-feather';

/*
TODO: STUFF IS BEING FIXED IN THE fix-textinput branch
2. Text placeholder not done (currently it's just a lighter version of the text input colour) (Search for "useInputStyle" in this file)
    ^ https://github.com/mui-org/material-ui/issues/9574 <- Styling input
    ^ https://stackoverflow.com/questions/47804380/styling-the-placeholder-in-a-textfield <- Styling placeholder
3. Navigation-via-tab-key functionality 
4. Formatting text inside the textfield
*/


const TextFieldColours = {
    default: {
        border: COLOR.OUTLINE.DARK,
        label: COLOR.TEXT.MEDIUM,
        icon: COLOR.TEXT.MEDIUM,
        filled: COLOR.PRIMARY.GREY[200],
        'filled-icon': COLOR.TEXT.DARK // Currently filled icon is the same no matter the state
    },
    focused: {
        border: COLOR.PRIMARY.BRAND[800],
        label: COLOR.PRIMARY.BRAND[800],
        icon: COLOR.PRIMARY.BRAND[900],
        filled: COLOR.PRIMARY.GREY[300],
    },
    typedIn: {
        border: COLOR.OUTLINE.BASE,
        label: COLOR.TEXT.DARK,
        icon: COLOR.TEXT.MEDIUM,
        filled: COLOR.PRIMARY.GREY[200],
    },
    error: {
        border: COLOR.SECONDARY.DANGER[700],
        label: COLOR.SECONDARY.DANGER[700],
        icon: COLOR.SECONDARY.DANGER[600],
        'status-text': COLOR.SECONDARY.DANGER[900],
        'status-icon': COLOR.SECONDARY.DANGER[700],
    },
    success: {
        border: COLOR.SECONDARY.SUCCESS[600],
        label: COLOR.SECONDARY.SUCCESS[600],
        icon: COLOR.SECONDARY.SUCCESS[600],
        'status-text': COLOR.SECONDARY.SUCCESS[800],
        'status-icon': COLOR.SECONDARY.SUCCESS[600],
    },
    text: COLOR.TEXT.DARK,
    disabled: COLOR.TEXT.DISABLED
}


const baseTextFieldSizeAndPosition = (width: number, isTypedIn: boolean) => (
    {
        "& label:not(.Mui-focused)": { // Label in center of TextInput
            marginTop: isTypedIn ? '0px' : '-8px',
        },
        "& label:.Mui-shrink": { // Label in center of TextInput
            marginTop: isTypedIn ? '0px' : '-8px',
        },
        "& .MuiOutlinedInput-adornedEnd, .MuiInputAdornment-root": { // Icon on right
            paddingRight: '0px',
            marginRight: '11px',
        },
        width: `${width}px`,
        height: '40px'
    }
);


const baseMuiOutlineInputSizeAndPosition = (width: number) => ({
    borderRadius: 8,
    borderWidth: 1,
    width: `${width}px`,
    height: '40px',
});


const useTextFieldStyles = (width: number, isTypedIn: boolean, isDisabled: boolean) => (
    makeStyles({
        default: {
            "& label:not(.Mui-focused), label:not(.Mui-disabled)": {
                color: isTypedIn ? TextFieldColours.typedIn.label : TextFieldColours.default.label
            },
            "& label.Mui-disabled": {
                color: TextFieldColours.disabled
            },
            "& label.Mui-focused": {
                color: TextFieldColours.focused.label
            },
            "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: isTypedIn ? TextFieldColours.typedIn.border : TextFieldColours.default.border, },// Default borders
                "&:hover fieldset": { borderColor: isTypedIn ? TextFieldColours.typedIn.border : TextFieldColours.default.border, }, // Hovered borders
                "&.Mui-focused fieldset": { borderColor: TextFieldColours.focused.border, borderWidth: 2 }, // Focused borders
                "&.Mui-disabled fieldset": { borderColor: TextFieldColours.disabled, }, // Disabled borders 
                "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": { // Focused icon
                    color: TextFieldColours.focused.icon,
                },
                "& inputAdornment:not(.Mui-focused), .MuiInputAdornment-root .MuiSvgIcon-root": { // Unfocused icon
                    color: (isDisabled && TextFieldColours.disabled) ||
                        (isTypedIn && TextFieldColours.typedIn.icon) ||
                        TextFieldColours.default.icon,
                },
                ...baseMuiOutlineInputSizeAndPosition(width),
            },
            ...baseTextFieldSizeAndPosition(width, isTypedIn),
        },
        error: {
            "& label.Mui-focused, label:not(.Mui-focused)": { color: TextFieldColours.error.label },
            "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: TextFieldColours.error.border, borderWidth: 2 },
                "&:hover fieldset": { borderColor: TextFieldColours.error.border, borderWidth: 2 },
                "&.Mui-focused fieldset": { borderColor: TextFieldColours.error.border, borderWidth: 2 },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: TextFieldColours.error.icon },
                ...baseMuiOutlineInputSizeAndPosition(width),
            },
            ...baseTextFieldSizeAndPosition(width, isTypedIn),
        },
        success: {
            "& label.Mui-focused, label:not(.Mui-focused)": { color: TextFieldColours.success.label },
            "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: TextFieldColours.success.border, borderWidth: 2 },
                "&:hover fieldset": { borderColor: TextFieldColours.success.border, borderWidth: 2 },
                "&.Mui-focused fieldset": { borderColor: TextFieldColours.success.border, borderWidth: 2 },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: TextFieldColours.success.icon },
                ...baseMuiOutlineInputSizeAndPosition(width),
            },
            ...baseTextFieldSizeAndPosition(width, isTypedIn),
        },
        filled: {
            "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: TextFieldColours.default.filled, },
                "&:hover fieldset": { borderColor: TextFieldColours.default.filled, },
                "&.Mui-focused fieldset": { borderColor: TextFieldColours.focused.filled, },
                "&.Mui-focused": { background: TextFieldColours.focused.filled },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: TextFieldColours.default["filled-icon"] },
                background: isTypedIn ? TextFieldColours.typedIn.filled : TextFieldColours.default.filled,
                ...baseMuiOutlineInputSizeAndPosition(width),
            },
            ...baseTextFieldSizeAndPosition(width, isTypedIn),
        },
    })
);


const useOverrideIconStyle = makeStyles({
    enabled: {},
    disabled: { color: TextFieldColours.disabled },
});


const useInputStyle = makeStyles({
    input: {
        '&::placeholder': {
            color: 'blue' // Doesn't do anything yet
        },
        color: TextFieldColours.text,
    },
});


export enum EvalState {
    error = 'error',
    default = 'default',
    success = 'success',
};


interface CustomTextInputProps {
    currInput: string,
    onChange: React.Dispatch<React.SetStateAction<string>>,
    id?: string,
    label?: string,
    placeholder?: string,
    icon?: JSX.Element,
    evalState?: EvalState, // if isDisabled=true, then evalState is ignored
    evalMessage?: string // if evalState is default, then evalMessage is ignored
    isDisabled?: boolean,
    isFilled?: boolean,
    isPassword?: boolean,
    width?: number,
    className?: string,
    // isRequired?: boolean, // A potentially useful prop to include
}


const TextInput = (props: CustomTextInputProps) => {
    const {
        currInput,
        onChange,
        id,
        label,
        placeholder,
        icon,
        evalState = EvalState.default,
        evalMessage,
        isDisabled = false,
        isFilled,
        isPassword,
        width = 328,
        className,
    } = props;

    const inputStyle = useInputStyle();

    const overrideIconStyles = useOverrideIconStyle();
    const overrideIconStyle = useMemo(() => {
        if (isDisabled) return overrideIconStyles.disabled;
        return overrideIconStyles.enabled;
    }, [overrideIconStyles, isDisabled]);

    const textFieldStyles = useTextFieldStyles(width, currInput !== "", isDisabled);
    const textFieldStyleDefault = textFieldStyles().default;
    const textFieldStyleFilled = textFieldStyles().filled;
    const textFieldStyleEval = textFieldStyles()[evalState];
    const textFieldStyle = useMemo(() => {
        if (isDisabled) return textFieldStyleDefault;
        if (isFilled) return textFieldStyleFilled;
        return textFieldStyleEval;
    }, [isDisabled, isFilled, textFieldStyleDefault, textFieldStyleFilled, textFieldStyleEval]);

    const inputProps = useMemo(() => {
        const baseProps = { className: inputStyle.input };
        if (!icon) return baseProps;
        const iconProps = {
            endAdornment: (
                <InputAdornment position="start" classes={{ root: overrideIconStyle }}>
                    {icon}
                </InputAdornment>
            ),
        };
        return { ...baseProps, ...iconProps };
    }, [icon, inputStyle.input, overrideIconStyle])

    const handleChange = (event: any) => {
        onChange(event.target.value);
    };

    return (
        <div className={className}>
            <TextField
                classes={{ root: textFieldStyle, }}
                label={!isFilled && label} // Filled textfields don't use labels
                placeholder={placeholder}
                variant="outlined"
                id={id}
                disabled={isDisabled}
                type={isPassword ? 'password' : ''}
                defaultValue={currInput}
                onChange={handleChange}
                InputProps={inputProps}
            />
            {evalState !== EvalState.default && <Status evalState={evalState} evalMessage={evalMessage} />}
        </div >
    );
}


export default TextInput;


interface StatusProps {
    evalState: EvalState;
    evalMessage?: string;
}


const Status = ({ evalState, evalMessage }: StatusProps) => {
    const ICON_SIZE = '16px';
    const isError = evalState === EvalState.error;
    const fontColor = isError ? TextFieldColours.error["status-text"] : TextFieldColours.success["status-text"];
    const iconColor = isError ? TextFieldColours.error["status-icon"] : TextFieldColours.success["status-icon"];
    const iconStyle = { width: ICON_SIZE, height: ICON_SIZE, color: iconColor, strokeWidth: "1.5px" };
    return (
        <StatusRow>
            {isError ?
                <XCircle style={iconStyle} /> :
                <CheckCircle style={iconStyle} />
            }
            <EvalText fontColor={fontColor} size='H300_CAPTION'>
                {evalMessage}
            </EvalText>
        </StatusRow>
    );
};


const StatusRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
    margin-top: 4px;
    padding-left: 8px;
`;


const EvalText = styled(Text)`
    margin-left: 5px;
`;
