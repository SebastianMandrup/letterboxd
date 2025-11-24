import { useState } from "react";
import styles from './loggingInHeader.module.css';
import { useAuth } from "../../../hooks/useAuth";

interface LoggingInHeaderProps {
    setIsLoggingIn: (value: boolean) => void;
}

function LoggingInHeader({ setIsLoggingIn }: LoggingInHeaderProps) {
    const { login, loading, error } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(username, password);
            setIsLoggingIn(false); // close the login modal
        } catch {
            // error is already handled in the hook
        }
    };

    return (
        <>
            <section className={styles.sectionLoginHeader}>
                <button
                    className={styles.buttonCloseLoginHeader}
                    onClick={() => setIsLoggingIn(false)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <form onSubmit={handleSubmit}>
                    {error && <p className={styles.errorMsg}>{error}</p>}

                    <label>
                        Username
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label className={styles.labelPassword}>
                        <div>
                            Password
                            <a href="">Forgotten?</a>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <label className={styles.labelRememberMe}>
                        <input type="checkbox" />
                        Remember me
                    </label>

                    <button
                        type="submit"
                        className={styles.buttonSubmitLoginHeader}
                        disabled={loading}
                    >
                        {loading ? "SIGNING IN..." : "SIGN IN"}
                    </button>
                </form>
            </section>
        </>
    );
}

export default LoggingInHeader;
