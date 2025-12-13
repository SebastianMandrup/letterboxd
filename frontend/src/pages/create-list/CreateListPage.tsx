import { useRef, useState, type FunctionComponent } from 'react';
import styles from './createListPage.module.css';
import type MovieDto from '../../DTO/MovieDto';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import Plus from '../shared/icons/Plus';
import Minus from '../shared/icons/Minus';
import { useToastStore } from '../../stores/useToastStore';
import useCreateList from '../../hooks/lists/useCreateList';
import useMoviesByPartialSlug from '../../hooks/movies/useMoviesByPartialSlug';

const CreateListPage: FunctionComponent = () => {
    const [moviesToAdd, setMoviesToAdd] = useState<MovieDto[]>([]);
    const { addToast } = useToastStore();
    const createListMutation = useCreateList();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const moviesQuery = useMoviesByPartialSlug(searchTerm);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleAddMovie = (movie: MovieDto) => {
        if (moviesToAdd.find((m) => m.id === movie.id)) {
            return;
        }
        setMoviesToAdd([...moviesToAdd, movie]);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setSearchTerm('');
    };

    const handleSearchTermChange = (value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setSearchTerm(value);
        }, 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const movieIds = moviesToAdd.map((movie) => movie.id);

        createListMutation.mutate(
            { name, description, movieIds },
            {
                onSuccess: (response) => {
                    addToast(response.message, 'success');
                    (e.target as HTMLFormElement).reset();
                    setMoviesToAdd([]);
                },
                onError: (error) => {
                    console.error('Error creating list:', error);
                    addToast(error.message || 'Failed to create list. Please try again.', 'error');
                },
            },
        );
    };

    return (
        <section className={styles.createListPage}>
            <SectionHeader title="Create New List" large />
            <form className={styles.createListForm} onSubmit={handleSubmit}>
                <div className={styles.listDetails}>
                    <label>
                        Name
                        <input name="name" type="text" placeholder="List Name" />
                    </label>
                    <label>
                        Description
                        <textarea name="description" placeholder="List Description" />
                    </label>
                    <label>
                        Add Movie
                        <input name="addMovie" type="text" onChange={(e) => handleSearchTermChange(e.target.value)} placeholder="Search for movies to add" />
                    </label>
                    <div className={styles.addMovieSection}>
                        {moviesQuery.data?.map((movie) => (
                            <div key={movie.id} className={styles.searchedMovie}>
                                <span>{movie.title}</span>
                                <button
                                    className={styles.addButton}
                                    type="button"
                                    title="Add movie to list"
                                    onClick={() => {
                                        handleAddMovie(movie);
                                        setSearchTerm('');
                                        (document.getElementsByName('addMovie')[0] as HTMLInputElement).value = '';
                                    }}
                                >
                                    <Plus />
                                </button>
                            </div>
                        ))}
                        {moviesQuery.error && (
                            <div className={styles.errorContainer}>
                                <p className={styles.errorMessage}>{moviesQuery.error.message}</p>
                            </div>
                        )}
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
