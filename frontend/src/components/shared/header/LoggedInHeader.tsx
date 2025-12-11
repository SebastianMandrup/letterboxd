import type UserDto from '../../../DTO/UserDto';
import ListsIcon from '../icons/ListsIcon';
import MoviesIcon from '../icons/MoviesIcon';
import SearchIcon from '../icons/SearchIcon';
import SignInIcon from '../icons/SignInIcon';
import SignUpIcon from '../icons/SignUpIcon';
import UsersIcon from '../icons/UsersIcon';
import styles from './defaultHeader.module.css';

interface LoggedInHeaderProps {
    user: UserDto;
    onLogout: () => void;
}

function LoggedInHeader({ user, onLogout }: LoggedInHeaderProps) {
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
                        <button onClick={() => onLogout()}>
                            <div>LOGOUT</div>
                            <SignInIcon size={iconSize} />
                        </button>
                    </li>
                    <li>
                        <a href={`/user/${user.username}`}>
                            <div>PROFILE</div>
                            <SignUpIcon size={iconSize} />
                        </a>
                    </li>
                    <li>
                        <a href="/movies">
                            <div>MOVIES</div>
                            <MoviesIcon size={iconSize} />
                        </a>
                    </li>
                    <li>
                        <a href="/lists">
                            <div>LISTS</div>
                            <ListsIcon size={iconSize} />
                        </a>
                    </li>
                    <li>
                        <a href="/users">
                            <div>USERS</div>
                            <UsersIcon size={iconSize} />
                        </a>
                    </li>
                </ul>
            </nav>
            <form onSubmit={handleSubmit}>
                <input name="query" type="text" />
                <SearchIcon size={20} />
            </form>
        </section>
    );
}

export default LoggedInHeader;
