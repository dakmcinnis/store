import React, { useCallback, useMemo, useState } from 'react';
import { Modal, makeStyles } from '@material-ui/core';
import SignaturePad from 'react-signature-canvas';

interface BaseModalProps {
    title?: string,
    isOpen: boolean,
    setOpen: (isOpen: boolean) => void,
    handleClose?: () => void,
}

interface SimpleModalProps extends BaseModalProps {
    children: any,
}

const SimpleModal = (props: SimpleModalProps) => {
    const { title, children, isOpen, setOpen, handleClose } = props;

    const onClose = useCallback(() => {
        setOpen(false);
        if (handleClose) handleClose();
    }, [setOpen, handleClose]);

    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                {title && <h2 id="simple-modal-title">{title}</h2>}
                {children}
            </div>
        </Modal>
    );
}

interface SignatureModalProps extends BaseModalProps {
    width?: number; // default value: 700
    height?: number; // default value: 200
    padColor?: string;
    penColor?: string;
    onFinishedSignature?: (sigURL: string) => void; // for saving the signature image
}

export const SignatureModal = (props: SignatureModalProps) => {
    const {
        width, height, padColor, penColor, onFinishedSignature, handleClose
    } = { width: 700, height: 200, ...props };
    const canvasProps = useMemo(() => ({ width, height }), [width, height]);
    const [sigPad, setSigPad] = useState<SignaturePad | null>(null);

    const onClose = useCallback(() => {
        const sigURL = sigPad?.getTrimmedCanvas().toDataURL('image/png');
        if (onFinishedSignature && sigURL) onFinishedSignature(sigURL);
        if (handleClose) handleClose();
    }, [sigPad, onFinishedSignature, handleClose]);

    // Note: The padColor cannot be passed directly to 'SignaturePad'
    // If this were done, then our saved image would include the background.
    return (
        <SimpleModal {...props} handleClose={onClose}>
            <div style={{ background: padColor }}>
                <SignaturePad
                    penColor={penColor}
                    canvasProps={canvasProps}
                    ref={ref => setSigPad(ref)}
                />
            </div>
        </SimpleModal>
    );
}


export default SimpleModal;

const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
