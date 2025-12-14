/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import type TmdbMovie from './types/TmdbMovie';
import { fileURLToPath } from 'url';

// ---------------- ESM __dirname fix ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- Configuration ----------------
const NUM_USERS = 100;
const NUM_REVIEWS = 500;
const NUM_VIEWS = 1000;
const NUM_LISTS = 100;
const NUM_COMMENTS = 1000;
const MAX_MOVIES = 2000;

// ---------------- Paths ----------------
const dataDir = path.join(__dirname, './data');
const tmdbFilePath = path.join(dataDir, 'enriched-data.json');
const seedFilePath = path.join(dataDir, 'seed-data.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// ---------------- Users ----------------
const usersBase = Array.from({ length: NUM_USERS }, (_, i) => {
    const firstName = faker.person
        .firstName()
        .toLowerCase()
        .replace(/[^a-z]/g, '');
    const uniqueId = (i + 100).toString(36);

    return {
        id: i + 1,
        username: `${firstName}${uniqueId}`,
        email: `${firstName}.${uniqueId}@example.com`,
        password: bcrypt.hashSync('password', 10),
        bio: faker.lorem.sentence(20),
        followers: [] as any[],
        following: [] as any[],
    };
});

console.log(`✅ Generated ${NUM_USERS} users`);

// ---------------- Read and limit TMDB movies ----------------
if (!fs.existsSync(tmdbFilePath)) {
    console.error(`❌ TMDB file not found: ${tmdbFilePath}`);
    process.exit(1);
}

const tmdbMoviesRaw = fs.readFileSync(tmdbFilePath, 'utf-8');
const moviesData: TmdbMovie[] = JSON.parse(tmdbMoviesRaw);

// Limit movies to MAX_MOVIES but keep all their relationships
const limitedMoviesData = moviesData.slice(0, MAX_MOVIES);
console.log(`📊 Using ${limitedMoviesData.length} movies out of ${moviesData.length}`);

// ---------------- Extract and prepare entities ----------------
const allGenres = new Map<number, { id: number; name: string }>();
const allLanguages = new Map<string, { id: number; iso_639_1: string; name: string; english_name: string }>();
const allCountries = new Map<string, { id: number; iso_3166_1: string; name: string }>();
const allProductionCompanies = new Map<number, { id: number; name: string; originCountry: string }>();

let languageCounter = 1;
let countryCounter = 1;
let castMemberCounter = 1;
let crewMemberCounter = 1;
let videoCounter = 1;

// First pass: Collect all unique entities from limited movies
limitedMoviesData.forEach((movie) => {
    // Collect genres
    if (movie.genres) {
        movie.genres.forEach((genre) => {
            if (!allGenres.has(genre.id)) {
                allGenres.set(genre.id, { id: genre.id, name: genre.name });
            }
        });
    }

    // Collect languages
    if (movie.spoken_languages) {
        movie.spoken_languages.forEach((lang) => {
            const key = lang.iso_639_1;
            if (!allLanguages.has(key)) {
                allLanguages.set(key, {
                    id: languageCounter++,
                    iso_639_1: lang.iso_639_1,
                    name: lang.name,
                    english_name: lang.english_name,
                });
            }
        });
    }

    // Collect countries
    if (movie.production_countries) {
        movie.production_countries.forEach((country) => {
            const key = country.iso_3166_1;
            if (!allCountries.has(key)) {
                allCountries.set(key, {
                    id: countryCounter++,
                    iso_3166_1: country.iso_3166_1,
                    name: country.name,
                });
            }
        });
    }

    // Collect production companies
    if (movie.production_companies) {
        movie.production_companies.forEach((company) => {
            if (!allProductionCompanies.has(company.id)) {
                allProductionCompanies.set(company.id, {
                    id: company.id,
                    name: company.name,
                    originCountry: company.origin_country?.[0] || 'US',
                });
            }
        });
    }
});

// ---------------- Movies with relationships ----------------
console.log('🔄 Processing movies and their relationships...');

const movies = limitedMoviesData.map((movie, index) => {
    const movieId = index + 1;

    // Get genre IDs for this movie
    const genreIds = movie.genres?.map((g) => g.id) || [];

    // Get language IDs for this movie
    const languageIds = movie.spoken_languages
        ?.map((lang) => {
            const langEntity = allLanguages.get(lang.iso_639_1);
            return langEntity?.id;
        })
        .filter(Boolean) as number[];

    // Get country IDs for this movie
    const countryIds = movie.production_countries
        ?.map((country) => {
            const countryEntity = allCountries.get(country.iso_3166_1);
            return countryEntity?.id;
        })
        .filter(Boolean) as number[];

    // Get production company IDs for this movie
    const productionCompanyIds = movie.production_companies?.map((company) => company.id) || [];

    // Create cast members (ALL cast members for each movie)
    const castMembers =
        movie.credits?.cast?.map((cast, castIndex) => ({
            id: castMemberCounter++,
            name: cast.name || 'Unknown Actor',
            character: cast.character || 'Unknown Character',
            order: cast.order || castIndex,
            movieId: movieId,
        })) || [];

    // Create crew members (ALL crew members for each movie)
    const crewMembers =
        movie.credits?.crew?.map((crew) => ({
            id: crewMemberCounter++,
            name: crew.name || 'Unknown Crew',
            job: crew.job || 'Unknown Job',
            department: crew.department || 'Unknown Department',
            movieId: movieId,
        })) || [];

    // Create videos (ALL videos for each movie)
    const videos =
        movie.videos?.map((video) => ({
            id: videoCounter++,
            key: video.key || '',
            name: video.name || 'Untitled Video',
            site: video.site || 'Unknown',
            type: video.type || 'Trailer',
            official: video.official || false,
            movieId: movieId,
        })) || [];

    let releaseDate = null;
    if (movie.release_date && movie.release_date.trim() !== '') {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(movie.release_date)) {
            releaseDate = movie.release_date;
        }
    }

    return {
        id: movieId,
        slug: movie.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-'),
        title: movie.title || 'Untitled Movie',
        originalTitle: movie.original_title || movie.title || 'Untitled Movie',
        adult: movie.adult || false,
        overview: movie.overview || '',
        popularity: movie.popularity || 0,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        releaseDate: releaseDate,
        voteAverage: movie.vote_average || 0,
        voteCount: movie.vote_count || 0,
        budget: movie.budget || 0,
        revenue: movie.revenue || 0,
        runtime: movie.runtime || 0,
        tagline: movie.tagline || '',
        homepage: movie.homepage || '',
        imdbId: movie.imdb_id || '',
        status: movie.status || 'Released',
        // Relationship IDs
        genreIds: genreIds,
        languageIds: languageIds,
        productionCountryIds: countryIds,
        productionCompanyIds: productionCompanyIds,
        // One-to-many relationships
        _castMembers: castMembers,
        _crewMembers: crewMembers,
        _videos: videos,
    };
});

// Show progress
console.log(`✅ Processed ${movies.length} movies`);
console.log(`   Total cast members to create: ${movies.reduce((sum, m) => sum + (m._castMembers?.length || 0), 0)}`);
console.log(`   Total crew members to create: ${movies.reduce((sum, m) => sum + (m._crewMembers?.length || 0), 0)}`);
console.log(`   Total videos to create: ${movies.reduce((sum, m) => sum + (m._videos?.length || 0), 0)}`);

// ---------------- Convert maps to arrays ----------------
const genres = Array.from(allGenres.values());
const languages = Array.from(allLanguages.values());
const countries = Array.from(allCountries.values());
const productionCompanies = Array.from(allProductionCompanies.values());

// Collect all cast, crew, and video entities
const castMembers: any[] = [];
const crewMembers: any[] = [];
const videos: any[] = [];

// Process movies and collect relationships
const moviesWithRelationships = movies.map((movie) => {
    // Push to collections
    if (movie._castMembers) {
        castMembers.push(...movie._castMembers);
    }
    if (movie._crewMembers) {
        crewMembers.push(...movie._crewMembers);
    }
    if (movie._videos) {
        videos.push(...movie._videos);
    }

    // Return movie without the relationship arrays
    const { _castMembers, _crewMembers, _videos, ...cleanMovie } = movie;
    return cleanMovie;
});

// ---------------- Reviews ----------------
const reviewTemplates = [
    'An absolute masterpiece of cinema.',
    'Surprisingly good for what it is.',
    'Not my favorite, but worth watching.',
    "One of the best movies I've seen this year.",
    'The cinematography alone is worth the price of admission.',
    'A bit overrated in my opinion, but still enjoyable.',
    'A classic that holds up remarkably well.',
    'The performances really carry this film.',
    'Visually stunning but lacking in substance.',
    'Better than I expected going in.',
];

const reviews = Array.from({ length: NUM_REVIEWS }, (_, i) => {
    const template = faker.helpers.arrayElement(reviewTemplates);
    const additionalThoughts = faker.lorem.sentences({ min: 1, max: 3 });
    const fullReview = `${template} ${additionalThoughts}`;
    const rating = parseFloat((Math.random() * 4 + 1).toFixed(1));

    return {
        id: i + 1,
        review: fullReview,
        rating: rating,
        movieId: faker.number.int({ min: 1, max: MAX_MOVIES }),
        authorId: faker.number.int({ min: 1, max: NUM_USERS }),
        createdAt: faker.date.past().toISOString(),
    };
});

// ---------------- ReviewLikes ----------------
const reviewLikes = Array.from({ length: NUM_REVIEWS * 2 }, () => ({
    createdAt: faker.date.recent().toISOString(),
    userId: faker.number.int({ min: 1, max: NUM_USERS }),
    reviewId: faker.number.int({ min: 1, max: NUM_REVIEWS }),
}));

// ---------------- Views ----------------
const viewSet = new Set<string>();
const views = Array.from({ length: NUM_VIEWS }, () => {
    let userId: number, movieId: number, key: string;
    do {
        userId = faker.number.int({ min: 1, max: NUM_USERS });
        movieId = faker.number.int({ min: 1, max: MAX_MOVIES });
        key = `${userId}-${movieId}`;
    } while (viewSet.has(key));
    viewSet.add(key);
    return { userId, movieId };
});

// ---------------- Comments ----------------
const comments = Array.from({ length: NUM_COMMENTS }, (_, i) => ({
    id: i + 1,
    content: faker.lorem.sentence(),
    createdAt: faker.date.recent().toISOString(),
    userId: faker.number.int({ min: 1, max: NUM_USERS }),
    movieId: faker.number.int({ min: 1, max: MAX_MOVIES }),
    listId: faker.number.int({ min: 1, max: NUM_LISTS }),
}));

// ---------------- CommentLikes ----------------
const commentLikes = Array.from({ length: NUM_COMMENTS * 2 }, () => ({
    createdAt: faker.date.recent().toISOString(),
    userId: faker.number.int({ min: 1, max: NUM_USERS }),
    commentId: faker.number.int({ min: 1, max: NUM_COMMENTS }),
}));

// ---------------- Lists ----------------
const listThemes = [
    'Classic',
    'Modern',
    'Cult',
    'Underrated',
    'Oscar-winning',
    'Horror',
    'Comedy',
    'Drama',
    'Action',
    'Sci-Fi',
    'Foreign Language',
    'Documentary',
    'Animated',
    'Indie',
    '90s',
    '2000s',
    '2010s',
    '2020s',
    'Directors',
    'Actors',
];

const lists = Array.from({ length: NUM_LISTS }, (_, i) => {
    const theme = faker.helpers.arrayElement(listThemes);
    const listMovieIds = Array.from(
        new Set(Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => faker.number.int({ min: 1, max: MAX_MOVIES }))),
    );

    return {
        id: i + 1,
        name: `${theme} ${faker.word.noun()} List`,
        description: faker.lorem.sentence(200),
        createdAt: faker.date.past().toISOString(),
        userId: faker.number.int({ min: 1, max: NUM_USERS }),
        movieIds: listMovieIds,
    };
});

// ---------------- ListLikes ----------------
const listLikes = Array.from({ length: NUM_LISTS * 2 }, () => ({
    createdAt: faker.date.recent().toISOString(),
    userId: faker.number.int({ min: 1, max: NUM_USERS }),
    listId: faker.number.int({ min: 1, max: NUM_LISTS }),
}));

// ---------------- Many-to-Many Join Tables ----------------
// Movie-Genre join table
const movieGenreJoin: { movieId: number; genreId: number }[] = [];
moviesWithRelationships.forEach((movie) => {
    movie.genreIds?.forEach((genreId) => {
        movieGenreJoin.push({ movieId: movie.id, genreId });
    });
});

// Movie-Language join table
const movieLanguageJoin: { movieId: number; languageId: number }[] = [];
moviesWithRelationships.forEach((movie) => {
    movie.languageIds?.forEach((languageId) => {
        movieLanguageJoin.push({ movieId: movie.id, languageId });
    });
});

// Movie-Country join table
const movieCountryJoin: { movieId: number; countryId: number }[] = [];
moviesWithRelationships.forEach((movie) => {
    movie.productionCountryIds?.forEach((countryId) => {
        movieCountryJoin.push({ movieId: movie.id, countryId });
    });
});

// Movie-Company join table
const movieCompanyJoin: { movieId: number; productionCompanyId: number }[] = [];
moviesWithRelationships.forEach((movie) => {
    movie.productionCompanyIds?.forEach((companyId) => {
        movieCompanyJoin.push({ movieId: movie.id, productionCompanyId: companyId });
    });
});

// List-Movie join table
const listMovieJoin: { listId: number; movieId: number }[] = [];
lists.forEach((list) => {
    list.movieIds?.forEach((movieId) => {
        listMovieJoin.push({ listId: list.id, movieId });
    });
});

// Clean up movies by removing ID arrays
const cleanedMovies = moviesWithRelationships.map((movie) => {
    const {
        genreIds: _genreIds,
        languageIds: _languageIds,
        productionCountryIds: _productionCountryIds,
        productionCompanyIds: _productionCompanyIds,
        ...rest
    } = movie;
    return rest;
});

// ---------------- Combine all ----------------
const seedData = {
    users: usersBase, // Just base users, no relationships for now
    movies: cleanedMovies,
    genres: genres,
    languages: languages,
    countries: countries,
    productionCompanies: productionCompanies,
    castMembers: castMembers,
    crewMembers: crewMembers,
    videos: videos,
    reviews: reviews,
    reviewLikes: reviewLikes,
    views: views,
    comments: comments,
    commentLikes: commentLikes,
    lists: lists,
    listLikes: listLikes,
    // Many-to-many join tables
    movieGenre: movieGenreJoin,
    movieLanguage: movieLanguageJoin,
    movieCountry: movieCountryJoin,
    movieCompany: movieCompanyJoin,
    listMovie: listMovieJoin,
};

// ---------------- Write to file ----------------
fs.writeFileSync(seedFilePath, JSON.stringify(seedData, null, 2));

console.log(`\n✅ seed-data.json created successfully at: ${seedFilePath}`);
console.log(`📊 Final Stats:`);
console.log(`   Movies: ${cleanedMovies.length}`);
console.log(`   Users: ${NUM_USERS}`);
console.log(`   Lists: ${NUM_LISTS}`);
console.log(`   Genres: ${genres.length}`);
console.log(`   Languages: ${languages.length}`);
console.log(`   Countries: ${countries.length}`);
console.log(`   Production Companies: ${productionCompanies.length}`);
console.log(`   Cast Members: ${castMembers.length}`);
console.log(`   Crew Members: ${crewMembers.length}`);
console.log(`   Videos: ${videos.length}`);
console.log(`   Reviews: ${NUM_REVIEWS}`);
console.log(`   Movie-Genre relationships: ${movieGenreJoin.length}`);
console.log(`   Movie-Language relationships: ${movieLanguageJoin.length}`);
console.log(`   Movie-Country relationships: ${movieCountryJoin.length}`);
console.log(`   Movie-Company relationships: ${movieCompanyJoin.length}`);
console.log(`   List-Movie relationships: ${listMovieJoin.length}`);
