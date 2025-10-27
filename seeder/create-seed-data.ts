import { faker } from "@faker-js/faker";
import fs from "fs";
import { TmdbMovie } from './TmdbMovie';

const NUM_USERS = 100;
const NUM_REVIEWS = 500;
const NUM_VIEWS = 1000;

// Users with passwords
const users = Array.from({ length: NUM_USERS }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    password: faker.string.uuid().replace(/-/g, ''),
}));

const tmdbMovies = fs.readFileSync("scraped-data.json", "utf-8");
const moviesData: TmdbMovie[] = JSON.parse(tmdbMovies);

const NUM_MOVIES = moviesData.length;

// Movies with all fields from TmdbMovie
const movies = moviesData.map((movie, index) => ({
    id: index + 1, // overwrite with sequential ID
    title: movie.title,
    originalTitle: movie.original_title,
    adult: movie.adult,
    genreIds: movie.genre_ids,
    overview: movie.overview,
    popularity: movie.popularity,
    posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
    backdropUrl: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
        : null,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
}));


// Reviews linking to user & movie
const reviews = Array.from({ length: NUM_REVIEWS }, (_, i) => ({
    id: i + 1,
    review: faker.lorem.sentences({ min: 1, max: 3 }),
    rating: parseFloat((Math.random() * 5).toFixed(1)),
    movieId: faker.number.int({ min: 1, max: NUM_MOVIES }),
    authorId: faker.number.int({ min: 1, max: NUM_USERS }),
}));

// Views linking to user & movie
const views = Array.from({ length: NUM_VIEWS }, (_, i) => ({
    id: i + 1,
    movieId: faker.number.int({ min: 1, max: NUM_MOVIES }),
    userId: faker.number.int({ min: 1, max: NUM_USERS }),
}));

// Combine all into one JSON
const data = { users, movies, reviews, views };

// Write to file
fs.writeFileSync("seed-data.json", JSON.stringify(data, null, 2));

console.log("seed-data.json created with updated schema!");
