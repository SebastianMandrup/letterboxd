import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { TmdbMovie } from "./TmdbMovie";

// ---------------- Configuration ----------------
const NUM_USERS = 100;
const NUM_REVIEWS = 500;
const NUM_VIEWS = 1000;
const NUM_LISTS = 50;
const NUM_COMMENTS = 800;

// ---------------- Paths ----------------
const dataDir = path.join(__dirname, "../data");
const tmdbFilePath = path.join(dataDir, "scraped-data.json");
const genresFilePath = path.join(dataDir, "genres.json");
const seedFilePath = path.join(dataDir, "seed-data.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// ---------------- Users ----------------
const users = Array.from({ length: NUM_USERS }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    password: bcrypt.hashSync("password", 10), // same password for all users
}));

// ---------------- Read TMDB movies ----------------
if (!fs.existsSync(tmdbFilePath)) {
    console.error(`❌ TMDB file not found: ${tmdbFilePath}`);
    process.exit(1);
}
const tmdbMoviesRaw = fs.readFileSync(tmdbFilePath, "utf-8");
const moviesData: TmdbMovie[] = JSON.parse(tmdbMoviesRaw);
const NUM_MOVIES = moviesData.length;

// ---------------- Read genres ----------------
if (!fs.existsSync(genresFilePath)) {
    console.error(`❌ Genres file not found: ${genresFilePath}`);
    process.exit(1);
}
const genresRaw = fs.readFileSync(genresFilePath, "utf-8");
const genres: { id: number; name: string }[] = JSON.parse(genresRaw);

// ---------------- Movies ----------------
const movies = moviesData.map((movie, index) => {
    const uniqueGenreIds = Array.from(new Set(movie.genre_ids)).filter((id) =>
        genres.some((g) => g.id === id)
    );

    if (uniqueGenreIds.length === 0 && genres.length > 0) {
        uniqueGenreIds.push(genres[0].id);
    }

    return {
        id: index + 1,
        title: movie.title,
        originalTitle: movie.original_title,
        adult: movie.adult,
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
        genreIds: uniqueGenreIds,
    };
});

// ---------------- Reviews ----------------
const reviews = Array.from({ length: NUM_REVIEWS }, () => ({
    review: faker.lorem.sentences({ min: 1, max: 3 }),
    rating: parseFloat((Math.random() * 5).toFixed(1)),
    movieId: faker.number.int({ min: 1, max: NUM_MOVIES }),
    authorId: faker.number.int({ min: 1, max: NUM_USERS }),
    createdAt: faker.date.past().toISOString(),
}));

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
        movieId = faker.number.int({ min: 1, max: NUM_MOVIES });
        key = `${userId}-${movieId}`;
    } while (viewSet.has(key));
    viewSet.add(key);
    return { userId, movieId };
});

// ---------------- Comments ----------------
const comments = Array.from({ length: NUM_COMMENTS }, () => ({
    content: faker.lorem.sentence(),
    createdAt: faker.date.recent().toISOString(),
    userId: faker.number.int({ min: 1, max: NUM_USERS }),
    movieId: faker.number.int({ min: 1, max: NUM_MOVIES }),
}));

// ---------------- CommentLikes ----------------
const commentLikes = Array.from({ length: NUM_COMMENTS * 2 }, () => {
    ({
        createdAt: faker.date.recent().toISOString(),
        userId: faker.number.int({ min: 1, max: NUM_USERS }),
        commentId: faker.number.int({ min: 1, max: NUM_COMMENTS }),
    });
});

// ---------------- Lists ----------------
const lists = Array.from({ length: NUM_LISTS }, () => {
    const listMovieIds = Array.from(
        new Set(
            Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () =>
                faker.number.int({ min: 1, max: NUM_MOVIES })
            )
        )
    );

    return {
        name: `${faker.word.adjective()} ${faker.word.noun()} List`,
        createdAt: faker.date.past().toISOString(),
        userId: faker.number.int({ min: 1, max: NUM_USERS }),
        movieIds: listMovieIds,
    };
});


// ---------------- ListLikes ----------------
const listLikes = Array.from({ length: NUM_LISTS * 2 }, () => {
    ({
        createdAt: faker.date.recent().toISOString(),
        userId: faker.number.int({ min: 1, max: NUM_USERS }),
        listId: faker.number.int({ min: 1, max: NUM_LISTS }),
    });
});


// ---------------- Combine all ----------------
const seedData = { users, movies, genres, reviews, reviewLikes, views, comments, commentLikes, lists, listLikes };

// ---------------- Write to file ----------------
fs.writeFileSync(seedFilePath, JSON.stringify(seedData, null, 2));

console.log(`✅ seed-data.json created successfully at: ${seedFilePath}`);
