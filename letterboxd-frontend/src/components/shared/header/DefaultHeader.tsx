import styles from './defaultHeader.module.css';

interface DefaultHeaderProps {
    setIsLoggingIn: (value: boolean) => void;
    setIsSigningUp: (value: boolean) => void;
}

function DefaultHeader({ setIsLoggingIn, setIsSigningUp }: DefaultHeaderProps) {
    return (
        <section className={styles.sectionDefaultHeader}>
            <nav>
                <ul>
                    <li>
                        <button onClick={() => setIsLoggingIn(true)}>
                            SIGN IN
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setIsSigningUp(true)}>
                            CREATE ACCOUNT
                        </button>
                    </li>
                    <li>
                        <a href="/films">
                            FILMS
                        </a>
                    </li>
                    <li>
                        <a href="/lists">
                            LISTS
                        </a>
                    </li>
                    <li>
                        <a href="/members">
                            MEMBERS
                        </a>
                    </li>
                    <li>
                        <a href="/journal">
                            JOURNAL
                        </a>
                    </li>
                </ul>
            </nav>
            <form action="/search" method="GET">
                <input name='query' type="text" />
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="6" />
                    <line x1="15" y1="15" x2="11.5" y2="11.5" />
                </svg>
            </form>
        </section>
    );
}

export default DefaultHeader;