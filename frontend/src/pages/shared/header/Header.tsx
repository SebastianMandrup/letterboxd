import { useState } from 'react';
import DefaultHeader from './DefaultHeader';
import LoggingInHeader from './LoggingInHeader';
import LoggedInHeader from './LoggedInHeader';
import SignUpModal from '../signUpModal/SignUpModal';
import styles from './header.module.css';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useUserStore } from '../../../stores/useUserStore';
import { ToastContainer } from '../toast/ToastContainer';
import { useToastStore } from '../../../stores/useToastStore';
import { Link } from 'react-router';

const Header = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const user = useUserStore((state) => state.user);
    const { logout } = useAuth();
    const { addToast } = useToastStore();

    const handleLogout = async () => {
        try {
            await logout();
            addToast('Successfully logged out!', 'success');
        } catch (err) {
            console.error('Logout failed:', err);
            addToast('Logout failed. Please try again.', 'error');
        }
    };

    return (
        <>
            <div className={styles.headerContainer}>
                <header className={styles.headerMain}>
                    <img src="/letterboxd-icon.png" alt="icon" />
                    <Link to="/" className={styles.logo}>
                        Boxedletter
                    </Link>

                    {user ? (
                        <LoggedInHeader onLogout={handleLogout} user={user} />
                    ) : (
                        <>
                            {isLoggingIn && !isSigningUp && <LoggingInHeader setIsLoggingIn={setIsLoggingIn} />}

                            {!isLoggingIn && <DefaultHeader setIsLoggingIn={setIsLoggingIn} setIsSigningUp={setIsSigningUp} />}

                            {isSigningUp && <SignUpModal setIsSigningUp={setIsSigningUp} />}
                        </>
                    )}
                </header>
            </div>
            <ToastContainer />
        </>
    );
};

export default Header;
