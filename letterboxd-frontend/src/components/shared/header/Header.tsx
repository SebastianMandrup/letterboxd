import { useState } from 'react';
import DefaultHeader from './DefaultHeader';
import LoggingInHeader from './LoggingInHeader';
import LoggedInHeader from './LoggedInHeader';
import SignUpModal from '../signUpModal/SignUpModal';
import styles from './header.module.css';
import { useAuth } from '../../../hooks/useAuth';
import { useUserStore } from '../../../stores/useUserStore';

const Header = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const user = useUserStore((state) => state.user);
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <header className={styles.headerMain}>
            <img src="/letterboxd-icon.png" alt="icon" />
            <a href='/'>Boxedletter</a>

            {user ? (
                <LoggedInHeader onLogout={handleLogout} />
            ) : (
                <>
                    {isLoggingIn && !isSigningUp && (
                        <LoggingInHeader setIsLoggingIn={setIsLoggingIn} />
                    )}

                    {!isLoggingIn && (
                        <DefaultHeader
                            setIsLoggingIn={setIsLoggingIn}
                            setIsSigningUp={setIsSigningUp}
                        />
                    )}

                    {isSigningUp && (
                        <SignUpModal setIsSigningUp={setIsSigningUp} />
                    )}
                </>
            )}
        </header>
    );
};

export default Header;
