import 'dotenv/config';
import fs from 'fs';
import type TmdbMovie from './types/TmdbMovie';
import TmdbResponse from './types/TmdbResponse';

// turning off your wifi is pretty effective
// thrown error will write partial data to file
async function fetchMoviesAsync() {
  const allMovies: TmdbMovie[] = [];
  const currentYear = new Date().getFullYear();
  const lastYear = 2020;
  const years = Array.from(
    { length: currentYear - lastYear + 1 },
    (_, i) => currentYear - i,
  );

  try {
    for (const year of years) {
      let page = 1;
      let totalPages = 1;

      // tmdb only allows fetching up to page 500 per endpoint
      while (page <= totalPages && page <= 500) {
        // avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 250));

        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          },
        );

        const data: TmdbResponse = await response.json();
        allMovies.push(...data.results);

        totalPages = Math.min(data.total_pages, 500);
        console.log(
          `Fetched page ${page} for ${year} with ${data.results.length} movies.`,
        );
        page++;
      }
    }

    console.log(`Total movies fetched: ${allMovies.length}`);
    console.log('Writing data to scraped-data.json');
    fs.writeFileSync(
      '../data/scraped-data.json',
      JSON.stringify(allMovies, null, 2),
    );
  } catch (error) {
    console.error('Error fetching movies:', error);
    console.log(`Total movies fetched so far: ${allMovies.length}`);
    console.log('Writing partial data to scraped-data.json');
    fs.writeFileSync(
      '../data/scraped-data.json',
      JSON.stringify(allMovies, null, 2),
    );
  }
}

fetchMoviesAsync();
