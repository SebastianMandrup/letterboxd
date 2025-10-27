import 'dotenv/config';
import fs from "fs";
import { TmdbMovie } from './TmdbMovie';


interface TmdbResponse {
    page: number;
    results: TmdbMovie[];
    total_pages: number;
    total_results: number;
}

// protip: to throw an error turn off wi-fi

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchMovies = async () => {
    const allMovies: TmdbMovie[] = [];
    const currentYear = new Date().getFullYear();
    const startYear = 1900; // adjust as needed
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

    try {
        for (const year of years) {
            console.log(`Fetching movies for year: ${year}`);
            let page = 1;
            let totalPages = 1;

            while (page <= totalPages && page <= 500) {
                await delay(250); // rate limiting
                const response = await fetch(
                    `https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&page=${page}`,
                    {
                        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
                    }
                );
                const data: TmdbResponse = await response.json();
                allMovies.push(...data.results);

                totalPages = Math.min(data.total_pages, 500);
                console.log(`Fetched page ${page} for ${year} with ${data.results.length} movies.`);
                page++;
            }
        }

        console.log(`Total movies fetched: ${allMovies.length}`);
        fs.writeFileSync("scraped-data.json", JSON.stringify(allMovies, null, 2));
    } catch (error) {
        console.error('Error fetching movies:', error);
        console.log(`Total movies fetched so far: ${allMovies.length}`);
        fs.writeFileSync("scraped-data.json", JSON.stringify(allMovies, null, 2));
    }
};

fetchMovies();
