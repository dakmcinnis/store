import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import Text from '../components/Text';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Color from '../styles/color';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState<firebase.User | null>(null);
    const [token, setToken] = useState('');

    const onSignOut = useCallback(() => (
        firebase.auth().signOut().then(
            () => {
                setEmail('');
                setPassword('');
                setToken('');
                setError('');
            }
        )
    ), [setEmail, setPassword, setToken]);

    const onSignIn = useCallback(() => {
        if (!email || !password) {
            setError('The email or password you have provided is empty. Please enter valid credentials.')
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).then(
            () => {
                setEmail('');
                setPassword('');
                setToken('');
                setError('');
            }
        ).catch(
            () => {
                setError('Unable to sign in. Please enter valid credentials.');
            }
        );
    }, [email, password, setEmail, setPassword, setToken]);

    // On mount, add a trigger
    useEffect(() => {
        firebase.auth().onAuthStateChanged(fUser => {
            if (fUser) {
                return fUser.getIdToken().then(idToken => {
                    setUser(fUser);
                    setToken(idToken);
                })
            }
            setUser(null);
            setToken('');
        });
    }, [setToken, setUser]);

    // On dismount, sign out
    useEffect(() => {
        return (() => {
            if (user) {
                onSignOut();
            }
        });
    }, [onSignOut, user]);

    return (
        <Wrapper>
            <div>
                <Text fontColor={Color.NEUTRAL.BLACK} size="HB_DISPLAY_2">Welcome to</Text>
                <Text fontColor={Color.NEUTRAL.BLACK} size="HB_DISPLAY_2">Secure Store!</Text>
            </div>
            <TextInput
                placeholder="Email"
                currInput={email}
                onChange={setEmail}
            />
            <TextInput
                placeholder="Password"
                currInput={password}
                onChange={setPassword}
                isPassword
            />
            <Row>
                <Button
                    type="SECONDARY"
                    size="LARGE"
                    text="Sign Out"
                    onClick={onSignOut}
                />
                <Button
                    type="PRIMARY"
                    size="LARGE"
                    text="Sign In"
                    onClick={onSignIn}
                    style={{ marginLeft: '10px' }}
                />
            </Row>
            {error && (
                <Text
                    fontColor={Color.SECONDARY.DANGER.MAIN}
                    size="H400_BODY"
                    style={{ marginTop: '20px' }}
                >
                    {error}
                </Text>
            )}
            {token &&
                (<>
                    <Text
                        fontColor={Color.NEUTRAL.BLACK}
                        size="H400_BODY"
                        style={{ marginTop: '20px' }}
                    >
                        Your token is:
                    </Text>
                    <BoundedText
                        fontColor={Color.NEUTRAL.BLACK}
                        size="H400_BODY"
                    >
                        {token}
                    </BoundedText>
                </>)
            }

        </Wrapper>
    );
}

export default LoginScreen;

const Wrapper = styled.div`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    text-align: center;
    min-height: 80vh;
    align-items: center;
    font-size: calc(10px + 2vmin);
    > * {
        margin: 10px 0px 0px 0px;
    }
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    > * {
        margin: 10px 0px 0px 0px;
    }
`;

const BoundedText = styled(Text)`
    width: 60%;
`;
