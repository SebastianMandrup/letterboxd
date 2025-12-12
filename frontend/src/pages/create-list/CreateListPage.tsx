import { useState, type FunctionComponent } from 'react';
import styles from './createListPage.module.css';
import type MovieDto from '../../DTO/MovieDto';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import Plus from '../shared/icons/Plus';
import Minus from '../shared/icons/Minus';
import listClient from '../../services/ListClient';
import { useUserStore } from '../../stores/useUserStore';
import { BackendError } from '../../services/apiClient';
import { useToastStore } from '../../stores/useToastStore';
import MovieClient from '../../services/MovieClient';

const CreateListPage: FunctionComponent = () => {
    const { user } = useUserStore();
    const [moviesToAdd, setMoviesToAdd] = useState<MovieDto[]>([]);
    const [searchedMovies, setSearchedMovies] = useState<MovieDto[]>([]);
    const { addToast } = useToastStore();

    const handleAddMovie = (movie: MovieDto) => {
        if (moviesToAdd.find((m) => m.id === movie.id)) {
            return;
        }
        setMoviesToAdd([...moviesToAdd, movie]);
    };

    const handleMovieSearch = async (query: string) => {
        const movies = await MovieClient.getByPartialSlug(query);
        setSearchedMovies(movies);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: frontend validation
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const movieIds = moviesToAdd.map((movie) => movie.id);

        try {
            await listClient.create({ name, description, movieIds });
            location.href = `/user/${user?.username}`;
        } catch (error: BackendError | unknown) {
            if (error instanceof BackendError) {
                addToast(error.message, 'error');
            } else {
                addToast('An unexpected error occurred.', 'error');
            }
        }
    };

    return (
        <section className={styles.createListPage}>
            <SectionHeader title="Create New List" large />
            <form className={styles.createListForm} onSubmit={handleSubmit}>
                <div className={styles.listDetails}>
                    <label>
                        Name
                        <input name="name" type="text" />
                    </label>
                    <label>
                        Description
                        <textarea name="description" />
                    </label>
                    <label>
                        Add Movie
                        <input name="addMovie" type="text" onChange={(e) => handleMovieSearch(e.target.value)} />
                    </label>
                    <div className={styles.addMovieSection}>
                        {searchedMovies.map((movie) => (
                            <div key={movie.id} className={styles.searchedMovie}>
                                <span>{movie.title}</span>
                                <button
                                    className={styles.addButton}
                                    type="button"
                                    title="Add movie to list"
                                    onClick={() => {
                                        handleAddMovie(movie);
                                        setSearchedMovies([]);
                                        (document.getElementsByName('addMovie')[0] as HTMLInputElement).value = '';
                                    }}
                                >
                                    <Plus />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <section className={styles.movieList}>
                    <SectionHeader title="Movies in List" />
                    {moviesToAdd.map((movie) => (
                        <div key={movie.id} className={styles.movieItem}>
                            <span>{movie.title}</span>
                            <button
                                className={styles.removeButton}
                                type="button"
                                title="Remove movie from list"
                                onClick={() => {
                                    setMoviesToAdd(moviesToAdd.filter((m) => m.id !== movie.id));
                                }}
                            >
                                <Minus />
                            </button>
                        </div>
                    ))}
                </section>
                <button type="submit" className={styles.submitButton}>
                    SAVE
                </button>
            </form>
        </section>
    );
};

export default CreateListPage;
