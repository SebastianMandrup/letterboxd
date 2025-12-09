import 'dotenv/config';
import fs from 'fs';
import type TmdbMovie from './types/TmdbMovie';
import path from 'path';
import { fileURLToPath } from 'url';

// turning off your wifi is pretty effective
// thrown error will write partial data to file
async function fetchMoviesAsync() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const scrapedFilePath = path.join(__dirname, './data/scraped-data.json');
    const scrapedData = fs.readFileSync(scrapedFilePath, 'utf-8');
    const scrapedMovies: TmdbMovie[] = JSON.parse(scrapedData);

    const allPopulatedMovies: TmdbMovie[] = [];
    try {
        console.log('enriching data with details');

        for (const movie of scrapedMovies) {
            // avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 200));

            const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
            });
            const detailedMovie: TmdbMovie = await response.json();

            const videosResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos`, {
                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
            });
            const videosData = await videosResponse.json();
            detailedMovie.videos = videosData.results;

            const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
            });
            const creditsData = await creditsResponse.json();
            detailedMovie.credits = creditsData;

            allPopulatedMovies.push(detailedMovie);
            console.log(`Fetched details for movie ID ${movie.id}: ${movie.title}`);
        }

        console.log(`Total movies enriched: ${allPopulatedMovies.length}`);
        console.log('Writing data to enriched-data.json');
        fs.writeFileSync(path.join(__dirname, './data/enriched-data.json'), JSON.stringify(allPopulatedMovies, null, 2));
    } catch (error) {
        console.error('Error enriching movies:', error);
        console.log(`Total movies enriched so far: ${allPopulatedMovies.length}`);
        console.log('Writing partial data to enriched-data.json');
        fs.writeFileSync(path.join(__dirname, './data/enriched-data.json'), JSON.stringify(allPopulatedMovies, null, 2));
    }
}

fetchMoviesAsync();
