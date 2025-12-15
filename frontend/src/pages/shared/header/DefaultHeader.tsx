import { Link } from 'react-router-dom';
import ListsIcon from '../icons/ListsIcon';
import MoviesIcon from '../icons/MoviesIcon';
import SearchIcon from '../icons/SearchIcon';
import SignInIcon from '../icons/SignInIcon';
import SignUpIcon from '../icons/SignUpIcon';
import UsersIcon from '../icons/UsersIcon';
import styles from './defaultHeader.module.css';

interface DefaultHeaderProps {
    setIsLoggingIn: (value: boolean) => void;
    setIsSigningUp: (value: boolean) => void;
}

function DefaultHeader({ setIsLoggingIn, setIsSigningUp }: DefaultHeaderProps) {
    const iconSize = 22;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get('query') as string;
        window.location.href = `/movies/browse?title=${encodeURIComponent(query)}`;
    };

    return (
        <section className={styles.sectionDefaultHeader}>
            <nav>
                <ul>
                    <li>
                        <button onClick={() => setIsLoggingIn(true)} title="Sign In">
                            <div>SIGN IN</div>
                            <SignInIcon size={iconSize} />
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setIsSigningUp(true)} title="Create Account">
                            <div>CREATE ACCOUNT</div>
                            <SignUpIcon size={iconSize} />
                        </button>
                    </li>
                    <li>
                        <Link to="/movies" title="Movies">
                            <div>MOVIES</div>
                            <MoviesIcon size={iconSize} />
                        </Link>
                    </li>
                    <li>
                        <Link to="/lists" title="Lists">
                            <div>LISTS</div>
                            <ListsIcon size={iconSize} />
                        </Link>
                    </li>
                    <li>
                        <Link to="/users" title="Users">
                            <div>USERS</div>
                            <UsersIcon size={iconSize} />
                        </Link>
                    </li>
                </ul>
            </nav>
            <form onSubmit={handleSubmit}>
                <input name="query" type="text" />
                <SearchIcon size={18} />
            </form>
        </section>
    );
}

export default DefaultHeader;
