import { useState } from 'react';
import DefaultHeader from './DefaultHeader';
import styles from './header.module.css';
import LoggingInHeader from './LoggingInHeader';
import SignUpModal from './signUpModal/SignUpModal';

const Header = () => {

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    return (
        <>
            <header className={styles.headerMain}>
                <img src="./letterboxd-icon.png" alt="icon" />
                <h1>Boxedletter</h1>
                {(isLoggingIn && !isSigningUp) ? (
                    <LoggingInHeader setIsLoggingIn={setIsLoggingIn} />
                ) : (
                    <DefaultHeader setIsLoggingIn={setIsLoggingIn} setIsSigningUp={setIsSigningUp} />
                )}

                {isSigningUp ? (
                    <SignUpModal setIsSigningUp={setIsSigningUp} />
                ) : (
                    <></>
                )}
            </header>
        </>
    );
}

export default Header;