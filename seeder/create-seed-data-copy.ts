import 'dotenv/config';

const fetchMovies = async () => {
    try {
        let page = 1;
        let allMovies = [];
        const response = await fetch('https://api.themoviedb.org/3/discover/movie', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            }
        });
        const movies = await response.json();
        console.log(movies);
        return movies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

fetchMovies();