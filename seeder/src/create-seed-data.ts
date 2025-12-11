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
const NUM_LISTS = 200; // Increased from 50
const NUM_COMMENTS = 800;

// ---------------- Paths ----------------
const dataDir = path.join(__dirname, './data');
const tmdbFilePath = path.join(dataDir, 'scraped-data.json');
const genresFilePath = path.join(dataDir, 'genres.json');
const seedFilePath = path.join(dataDir, 'seed-data.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// ---------------- Users ----------------
const usedUsernames = new Set<string>();

// First, create user objects without relationships
const usersBase = Array.from({ length: NUM_USERS }, (_, i) => {
    let username: string;
    let attempts = 0;

    // Generate unique username
    do {
        const baseName = faker.person.firstName().replace(/\s+/g, '').toLowerCase().replace(/-/g, '');
        username = attempts === 0 ? baseName : `${baseName}${faker.number.int({ min: 1, max: 999 })}`;
        attempts++;
    } while (usedUsernames.has(username) && attempts < 10);

    usedUsernames.add(username);

    return {
        id: i + 1,
        username: username,
        email: faker.internet.email(),
        password: bcrypt.hashSync('password', 10),
        bio: faker.lorem.sentence(20),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        followers: [] as any[], // Initialize as any[] to avoid type issues
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        following: [] as any[],
    };
});

// Now create follow relationships
const users = usersBase.map((user) => {
    // Each user follows between 5-30 other users
    const numFollowing = faker.number.int({ min: 5, max: 30 });
    const followedUserIds = new Set<number>();

    // Get IDs of users to follow (excluding self)
    for (let i = 0; i < numFollowing; i++) {
        let followedUserId: number;
        do {
            followedUserId = faker.number.int({ min: 1, max: NUM_USERS });
        } while (followedUserId === user.id || followedUserIds.has(followedUserId));

        followedUserIds.add(followedUserId);
    }

    // Create the user object with following array containing user IDs
    return {
        ...user,
        following: Array.from(followedUserIds).map((id) => ({ id })), // Array of {id: number} objects
    };
});

// Now we need to populate the followers arrays
// Create a map of user IDs to their following arrays
const followingMap = new Map<number, number[]>();
users.forEach((user) => {
    followingMap.set(
        user.id,
        user.following.map((f) => f.id),
    );
});

// Populate followers for each user
const usersWithFollowers = users.map((user) => {
    const followers = [];
    // Check all other users to see if they follow this user
    for (const [otherUserId, followingIds] of followingMap.entries()) {
        if (otherUserId !== user.id && followingIds.includes(user.id)) {
            followers.push({ id: otherUserId });
        }
    }
    return {
        ...user,
        followers: followers,
    };
});

console.log(`✅ Generated follow relationships`);
usersWithFollowers.forEach((user) => {
    console.log(`   User ${user.username}: follows ${user.following.length}, followed by ${user.followers.length}`);
});

// ---------------- Read TMDB movies ----------------
if (!fs.existsSync(tmdbFilePath)) {
    console.error(`❌ TMDB file not found: ${tmdbFilePath}`);
    process.exit(1);
}
const tmdbMoviesRaw = fs.readFileSync(tmdbFilePath, 'utf-8');
const moviesData: TmdbMovie[] = JSON.parse(tmdbMoviesRaw);
const NUM_MOVIES = moviesData.length;

// ---------------- Read genres ----------------
if (!fs.existsSync(genresFilePath)) {
    console.error(`❌ Genres file not found: ${genresFilePath}`);
    process.exit(1);
}
const genresRaw = fs.readFileSync(genresFilePath, 'utf-8');
const genres: { id: number; name: string }[] = JSON.parse(genresRaw);

// ---------------- Movies ----------------
const movies = moviesData.map((movie, index) => {
    const uniqueGenreIds = Array.from(new Set(movie.genre_ids)).filter((id) => genres.some((g) => g.id === id));

    if (uniqueGenreIds.length === 0 && genres.length > 0) {
        uniqueGenreIds.push(genres[0].id);
    }

    return {
        id: index + 1,
        slug: movie.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-'),
        title: movie.title,
        originalTitle: movie.original_title,
        adult: movie.adult,
        overview: movie.overview,
        popularity: movie.popularity,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : null,
        backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        genreIds: uniqueGenreIds,
    };
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

    const rating = parseFloat((Math.random() * 4 + 1).toFixed(1)); // Ratings between 1-5

    return {
        id: i + 1,
        review: fullReview,
        rating: rating,
        movieId: faker.number.int({ min: 1, max: NUM_MOVIES }),
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
    'By Country',
    'By Decade',
    'Hidden Gems',
    'Must Watch',
    'Overrated',
    'Underrated',
    'Emotional',
    'Funny',
    'Scary',
    'Thought-provoking',
];

const lists = Array.from({ length: NUM_LISTS }, (_, i) => {
    const theme = faker.helpers.arrayElement(listThemes);
    const listMovieIds = Array.from(
        new Set(Array.from({ length: faker.number.int({ min: 10, max: 80 }) }, () => faker.number.int({ min: 1, max: NUM_MOVIES }))),
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

// ---------------- Combine all ----------------
const seedData = {
    users: usersWithFollowers, // Users now have followers and following arrays
    movies,
    genres,
    reviews,
    reviewLikes,
    views,
    comments,
    commentLikes,
    lists,
    listLikes,
};

// ---------------- Write to file ----------------
fs.writeFileSync(seedFilePath, JSON.stringify(seedData, null, 2));

console.log(`✅ seed-data.json created successfully at: ${seedFilePath}`);
console.log(`📊 Stats:`);
console.log(`   Users: ${NUM_USERS}`);
console.log(`   Lists: ${NUM_LISTS} (increased from 50)`);
console.log(`   Reviews: ${NUM_REVIEWS}`);
console.log(`   Average follows per user: ${Math.round(usersWithFollowers.reduce((acc, user) => acc + user.following.length, 0) / NUM_USERS)}`);
