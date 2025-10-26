import styles from './loggingInHeader.module.css';

interface LoggingInHeaderProps {
    setIsLoggingIn: (value: boolean) => void;
}

function LoggingInHeader({ setIsLoggingIn }: LoggingInHeaderProps) {
    return (
        <>
            <section className={styles.sectionLoginHeader}>
                <button className={styles.buttonCloseLoginHeader} onClick={() => setIsLoggingIn(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                <form action="">
                    <label>
                        Username
                        <input type="text" name='username' />
                    </label>
                    <label className={styles.labelPassword}>
                        <div>
                            Password
                            <a href="">Forgotten?</a>
                        </div>
                        <input type="password" name='password' />
                    </label>
                    <label className={styles.labelRememberMe}>
                        <input type="checkbox" />
                        Remember me
                    </label>
                    <button type='submit' className={styles.buttonSubmitLoginHeader}>
                        SIGN IN
                    </button>
                </form>
            </section>
        </>
    );
}

export default LoggingInHeader;