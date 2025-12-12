/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppDataSource } from './data-source.ts';
import { User } from './entities/User.ts';
import { Movie } from './entities/Movie.ts';
import { Genre } from './entities/Genre.ts';
import { Review } from './entities/Review.ts';
import { ReviewLike } from './entities/ReviewLike.ts';
import { View } from './entities/View.ts';
import { Comment } from './entities/Comment.ts';
import { CommentLike } from './entities/CommentLike.ts';
import { List } from './entities/List.ts';
import { ListLike } from './entities/ListLike.ts';
import { MovieLike } from './entities/MovieLike.ts';
import { Language } from './entities/Language.ts';
import { Country } from './entities/Country.ts';
import { ProductionCompany } from './entities/ProductionCompany.ts';
import { CastMember } from './entities/CastMember.ts';
import { CrewMember } from './entities/CrewMember.ts';
import { Video } from './entities/Video.ts';

// ---------------- ESM __dirname fix ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- Paths ----------------
const seedFilePath = path.join(__dirname, './data/seed-data.json');

// ---------------- Batch Helper Function ----------------
async function batchSave<T>(manager: any, entities: T[], batchSize: number = 1000, entityName: string = 'entities'): Promise<void> {
    if (entities.length === 0) {
        console.log(`✅ No ${entityName} to save`);
        return;
    }

    console.log(`🔄 Saving ${entities.length} ${entityName} in batches of ${batchSize}...`);
    let savedCount = 0;

    for (let i = 0; i < entities.length; i += batchSize) {
        const batch = entities.slice(i, i + batchSize);
        await manager.save(batch);
        savedCount += batch.length;

        const progress = Math.round((savedCount / entities.length) * 100);
        console.log(`  → Batch ${Math.floor(i / batchSize) + 1}: Saved ${batch.length} ${entityName} (${progress}% complete)`);
    }

    console.log(`✅ Created ${entities.length} ${entityName}`);
}

// ---------------- Seed Function ----------------
async function populateDatabase() {
    if (!fs.existsSync(seedFilePath)) {
        console.error(`❌ Seed file not found: ${seedFilePath}`);
        process.exit(1);
    }

    const seedRaw = fs.readFileSync(seedFilePath, 'utf-8');
    const seedData = JSON.parse(seedRaw);

    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection initialized');

    const manager = AppDataSource.manager;

    // --- Run migrations first (create tables) ---
    console.log('🔄 Running migrations...');
    try {
        await manager.query(`
            -- Create users table if not exists
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                bio TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create all other tables similarly or use TypeORM's migration runner
        console.log('✅ Created tables');
    } catch (error) {
        console.error('❌ Error creating tables (they may already exist):', error);
        console.log('⚠️  Tables may already exist, continuing...');
    }

    // --- Clear existing data (but keep tables) ---
    console.log('🔄 Clearing existing data...');

    // Clear in reverse order of dependencies
    const clearQueries = [
        'DELETE FROM comment_likes;',
        'DELETE FROM comments;',
        'DELETE FROM review_likes;',
        'DELETE FROM reviews;',
        'DELETE FROM list_likes;',
        'DELETE FROM list_movie;', // Join table
        'DELETE FROM lists;',
        'DELETE FROM views;',
        'DELETE FROM movie_genre;', // Join table
        'DELETE FROM movie_language;', // Join table
        'DELETE FROM movie_country;', // Join table
        'DELETE FROM movie_company;', // Join table
        'DELETE FROM cast_members;',
        'DELETE FROM crew_members;',
        'DELETE FROM videos;',
        'DELETE FROM movie_likes;',
        'DELETE FROM movies;',
        'DELETE FROM languages;',
        'DELETE FROM countries;',
        'DELETE FROM production_companies;',
        'DELETE FROM genres;',
        'DELETE FROM users;',
        'ALTER SEQUENCE users_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE genres_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE languages_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE countries_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE production_companies_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE movies_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE cast_members_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE crew_members_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE videos_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE reviews_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE lists_id_seq RESTART WITH 1;',
        'ALTER SEQUENCE comments_id_seq RESTART WITH 1;',
    ];

    for (const query of clearQueries) {
        try {
            await manager.query(query);
        } catch (_error) {
            // Table might not exist yet, that's OK
            console.log(`⚠️  Could not execute: ${query.split(' ')[0]}... (table may not exist yet)`);
        }
    }
    console.log('✅ Cleared existing data');

    // ========== PHASE 1: Create base entities ==========

    // --- Users ---
    console.log('🔄 Creating users...');
    const users: User[] = seedData.users.map((u: Partial<User>) =>
        manager.create(User, {
            username: u.username,
            email: u.email,
            password: u.password,
            bio: u.bio,
        }),
    );
    await batchSave(manager, users, 1000, 'users');

    // Create mapping: seed user index -> database ID
    // Assuming seedData.users array order matches the saved order
    const userIdMap = new Map<number, number>();
    users.forEach((user, index) => {
        // Map seed user index (starting from 1) to actual database ID
        const seedIndex = index + 1; // Assuming seed data uses 1-based indexing
        userIdMap.set(seedIndex, user.id);
    });

    console.log(
        `📊 User ID mapping: ${Array.from(userIdMap.entries())
            .slice(0, 10)
            .map(([seed, db]) => `${seed}→${db}`)
            .join(', ')}${userIdMap.size > 10 ? '...' : ''}`,
    );

    // --- Genres ---
    console.log('🔄 Creating genres...');
    const genres: Genre[] = seedData.genres.map((g: Partial<Genre>) =>
        manager.create(Genre, {
            id: g.id,
            name: g.name,
        }),
    );
    await batchSave(manager, genres, 1000, 'genres');

    // Create a Set of valid genre IDs for quick lookup
    const validGenreIds = new Set(genres.map((g) => g.id));
    console.log(`📊 Valid genre IDs: ${Array.from(validGenreIds).slice(0, 10).join(', ')}...`);

    // --- Languages ---
    console.log('🔄 Creating languages...');
    const languages: Language[] = seedData.languages.map((l: any) =>
        manager.create(Language, {
            id: l.id,
            iso_639_1: l.iso_639_1,
            name: l.name,
            english_name: l.english_name,
        }),
    );
    await batchSave(manager, languages, 1000, 'languages');

    // --- Countries ---
    console.log('🔄 Creating countries...');
    const countries: Country[] = seedData.countries.map((c: any) =>
        manager.create(Country, {
            id: c.id,
            iso_3166_1: c.iso_3166_1,
            name: c.name,
        }),
    );
    await batchSave(manager, countries, 1000, 'countries');

    // --- Production Companies ---
    console.log('🔄 Creating production companies...');
    const productionCompanies: ProductionCompany[] = seedData.productionCompanies.map((pc: any) =>
        manager.create(ProductionCompany, {
            id: pc.id,
            name: pc.name,
            originCountry: pc.originCountry,
        }),
    );
    await batchSave(manager, productionCompanies, 1000, 'production companies');

    // --- Movies (without relationships first) ---
    console.log('🔄 Creating movies...');
    const movies: Movie[] = seedData.movies.map((m: any) =>
        manager.create(Movie, {
            id: m.id,
            slug: m.slug,
            title: m.title,
            originalTitle: m.originalTitle,
            adult: m.adult,
            overview: m.overview,
            popularity: m.popularity,
            posterPath: m.posterPath,
            backdropPath: m.backdropPath,
            releaseDate: m.releaseDate,
            voteAverage: m.voteAverage,
            voteCount: m.voteCount,
            budget: m.budget,
            revenue: m.revenue,
            runtime: m.runtime,
            tagline: m.tagline,
            homepage: m.homepage,
            imdbId: m.imdbId,
            status: m.status,
        }),
    );
    await batchSave(manager, movies, 1000, 'movies');

    // Create a Set of valid movie IDs for quick lookup
    const validMovieIds = new Set(movies.map((m) => m.id));

    // --- Set up Many-to-Many relationships for movies ---
    console.log('🔄 Setting up movie relationships...');

    // Create join tables separately
    const createTableQueries = [
        `CREATE TABLE IF NOT EXISTS movie_genre (
        movieId INT,
        genreId INT,
        PRIMARY KEY (movieId, genreId),
        FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
        FOREIGN KEY (genreId) REFERENCES genres(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS movie_language (
        movieId INT,
        languageId INT,
        PRIMARY KEY (movieId, languageId),
        FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
        FOREIGN KEY (languageId) REFERENCES languages(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS movie_country (
        movieId INT,
        countryId INT,
        PRIMARY KEY (movieId, countryId),
        FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
        FOREIGN KEY (countryId) REFERENCES countries(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS movie_company (
        movieId INT,
        productionCompanyId INT,
        PRIMARY KEY (movieId, productionCompanyId),
        FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
        FOREIGN KEY (productionCompanyId) REFERENCES production_companies(id) ON DELETE CASCADE
    )`,
    ];

    // Execute each CREATE TABLE statement separately
    for (const query of createTableQueries) {
        try {
            await manager.query(query);
        } catch (error) {
            console.log(`⚠️  Could not create table: ${error}`);
        }
    }

    // Insert into join tables with validation
    console.log(`Processing ${seedData.movieGenre.length} movie-genre relationships...`);
    let movieGenreInserted = 0;
    let movieGenreSkipped = 0;

    for (const join of seedData.movieGenre) {
        // Validate both movie and genre exist
        if (!validMovieIds.has(join.movieId) || !validGenreIds.has(join.genreId)) {
            movieGenreSkipped++;
            if (movieGenreSkipped <= 5) {
                // Only log first few for debugging
                console.log(`⚠️  Skipping movie_genre: Movie ${join.movieId} or Genre ${join.genreId} not found`);
            }
            continue;
        }

        try {
            await manager.query('INSERT INTO movie_genre (movieId, genreId) VALUES ($1, $2) ON CONFLICT DO NOTHING', [join.movieId, join.genreId]);
            movieGenreInserted++;
        } catch (error) {
            console.error(`❌ Error inserting movie_genre (${join.movieId}, ${join.genreId}):`, error);
            movieGenreSkipped++;
        }
    }
    console.log(`✅ Created ${movieGenreInserted} movie-genre relationships (skipped ${movieGenreSkipped} invalid)`);

    // Movie-Language relationships
    console.log(`Processing ${seedData.movieLanguage.length} movie-language relationships...`);
    let movieLanguageInserted = 0;
    let movieLanguageSkipped = 0;

    for (const join of seedData.movieLanguage) {
        if (!validMovieIds.has(join.movieId)) {
            movieLanguageSkipped++;
            continue;
        }
        try {
            await manager.query('INSERT INTO movie_language (movieId, languageId) VALUES ($1, $2) ON CONFLICT DO NOTHING', [join.movieId, join.languageId]);
            movieLanguageInserted++;
        } catch (error) {
            movieLanguageSkipped++;
        }
    }
    console.log(`✅ Created ${movieLanguageInserted} movie-language relationships (skipped ${movieLanguageSkipped} invalid)`);

    // Movie-Country relationships
    console.log(`Processing ${seedData.movieCountry.length} movie-country relationships...`);
    let movieCountryInserted = 0;
    let movieCountrySkipped = 0;

    for (const join of seedData.movieCountry) {
        if (!validMovieIds.has(join.movieId)) {
            movieCountrySkipped++;
            continue;
        }
        try {
            await manager.query('INSERT INTO movie_country (movieId, countryId) VALUES ($1, $2) ON CONFLICT DO NOTHING', [join.movieId, join.countryId]);
            movieCountryInserted++;
        } catch (error) {
            movieCountrySkipped++;
        }
    }
    console.log(`✅ Created ${movieCountryInserted} movie-country relationships (skipped ${movieCountrySkipped} invalid)`);

    // Movie-Company relationships
    console.log(`Processing ${seedData.movieCompany.length} movie-company relationships...`);
    let movieCompanyInserted = 0;
    let movieCompanySkipped = 0;

    for (const join of seedData.movieCompany) {
        if (!validMovieIds.has(join.movieId)) {
            movieCompanySkipped++;
            continue;
        }
        try {
            await manager.query('INSERT INTO movie_company (movieId, productionCompanyId) VALUES ($1, $2) ON CONFLICT DO NOTHING', [
                join.movieId,
                join.productionCompanyId,
            ]);
            movieCompanyInserted++;
        } catch (error) {
            movieCompanySkipped++;
        }
    }
    console.log(`✅ Created ${movieCompanyInserted} movie-company relationships (skipped ${movieCompanySkipped} invalid)`);

    // ========== PHASE 2: Create dependent entities ==========

    // --- Cast Members ---
    console.log('🔄 Creating cast members...');
    const castMembers: CastMember[] = seedData.castMembers.map((cm: any) =>
        manager.create(CastMember, {
            id: cm.id,
            name: cm.name,
            character: cm.character,
            order: cm.order,
            movie: movies.find((m) => m.id === cm.movieId),
        }),
    );
    await batchSave(manager, castMembers, 1000, 'cast members');

    // --- Crew Members ---
    console.log('🔄 Creating crew members...');
    const crewMembers: CrewMember[] = seedData.crewMembers.map((cm: any) =>
        manager.create(CrewMember, {
            id: cm.id,
            name: cm.name,
            job: cm.job,
            department: cm.department,
            movie: movies.find((m) => m.id === cm.movieId),
        }),
    );
    await batchSave(manager, crewMembers, 1000, 'crew members');

    // --- Videos ---
    console.log('🔄 Creating videos...');
    const videos: Video[] = seedData.videos.map((v: any) =>
        manager.create(Video, {
            id: v.id,
            key: v.key,
            name: v.name,
            site: v.site,
            type: v.type,
            official: v.official,
            movie: movies.find((m) => m.id === v.movieId),
        }),
    );
    await batchSave(manager, videos, 1000, 'videos');

    // --- Reviews ---
    console.log('🔄 Creating reviews...');
    const reviews: Review[] = [];
    for (const r of seedData.reviews) {
        const dbUserId = userIdMap.get(r.authorId);
        const user = dbUserId ? users.find((u) => u.id === dbUserId) : null;

        if (!user) {
            console.warn(`⚠️  Skipping review: Could not find mapped user for seed authorId ${r.authorId}`);
            continue;
        }

        const movie = movies.find((m) => m.id === r.movieId);
        if (!movie) {
            console.warn(`⚠️  Skipping review: Could not find movie with ID ${r.movieId}`);
            continue;
        }

        reviews.push(
            manager.create(Review, {
                id: r.id,
                review: r.review,
                rating: r.rating,
                createdAt: r.createdAt,
                author: user,
                movie: movie,
            }),
        );
    }
    await batchSave(manager, reviews, 1000, 'reviews');

    // --- Lists ---
    console.log('🔄 Creating lists...');
    const lists: List[] = [];
    for (const l of seedData.lists) {
        const dbUserId = userIdMap.get(l.userId);
        const user = dbUserId ? users.find((u) => u.id === dbUserId) : null;

        if (!user) {
            console.warn(`⚠️  Skipping list: Could not find mapped user for seed userId ${l.userId}`);
            continue;
        }

        lists.push(
            manager.create(List, {
                id: l.id,
                name: l.name,
                description: l.description,
                createdAt: l.createdAt,
                user: user,
            }),
        );
    }
    await batchSave(manager, lists, 1000, 'lists');

    // --- Comments ---
    console.log('🔄 Creating comments...');
    const comments: Comment[] = [];
    for (const c of seedData.comments) {
        const dbUserId = userIdMap.get(c.userId);
        const user = dbUserId ? users.find((u) => u.id === dbUserId) : null;

        if (!user) {
            console.warn(`⚠️  Skipping comment: Could not find mapped user for seed userId ${c.userId}`);
            continue;
        }

        const movie = c.movieId ? movies.find((m) => m.id === c.movieId) : null;
        const list = c.listId ? lists.find((l) => l.id === c.listId) : null;

        // At least one of movie or list should exist
        if (!movie && !list) {
            console.warn(`⚠️  Skipping comment: No movie or list found for comment`);
            continue;
        }

        comments.push(
            manager.create(Comment, {
                id: c.id,
                content: c.content,
                createdAt: c.createdAt,
                user: user,
                movie: movie || undefined,
                list: list || undefined,
            }),
        );
    }
    await batchSave(manager, comments, 1000, 'comments');

    // ========== PHASE 3: Create relationship entities ==========

    // --- ReviewLikes ---
    console.log('🔄 Creating review likes...');
    const reviewLikes: ReviewLike[] = [];
    for (const rl of seedData.reviewLikes) {
        const dbUserId = userIdMap.get(rl.userId);
        const user = dbUserId ? users.find((u) => u.id === dbUserId) : null;
        const review = reviews.find((r) => r.id === rl.reviewId);

        if (!user) {
            console.warn(`⚠️  Skipping review like: Could not find mapped user for seed userId ${rl.userId}`);
            continue;
        }
        if (!review) {
            console.warn(`⚠️  Skipping review like: Could not find review with ID ${rl.reviewId}`);
            continue;
        }

        reviewLikes.push(
            manager.create(ReviewLike, {
                createdAt: rl.createdAt,
                user: user,
                review: review,
            }),
        );
    }
    await batchSave(manager, reviewLikes, 1000, 'review likes');

    // --- Views ---
    console.log('🔄 Creating views...');
    const views: View[] = [];
    for (const v of seedData.views) {
        const dbUserId = userIdMap.get(v.userId);
        const user = dbUserId ? users.find((u) => u.id === dbUserId) : null;
        const movie = movies.find((m) => m.id === v.movieId);

        if (!user) {
            console.warn(`⚠️  Skipping view: Could not find mapped user for seed userId ${v.userId}`);
            continue;
        }
        if (!movie) {
            console.warn(`⚠️  Skipping view: Could not find movie with ID ${v.movieId}`);
            continue;
        }

        views.push(
            manager.create(View, {
                user: user,
                movie: movie,
            }),
        );
    }
    await batchSave(manager, views, 1000, 'views');

    // --- ListLikes ---
    console.log('🔄 Creating list likes...');
    const listLikes: ListLike[] = [];
    for (const ll of seedData.listLikes) {
        const dbUserId = userIdMap.get(ll.userId);
        const user = dbUserId ? users.find((u) => u.id === dbUserId) : null;
        const list = lists.find((l) => l.id === ll.listId);

        if (!user) {
            console.warn(`⚠️  Skipping list like: Could not find mapped user for seed userId ${ll.userId}`);
            continue;
        }
        if (!list) {
            console.warn(`⚠️  Skipping list like: Could not find list with ID ${ll.listId}`);
            continue;
        }

        listLikes.push(
            manager.create(ListLike, {
                createdAt: ll.createdAt,
                user: user,
                list: list,
            }),
        );
    }
    await batchSave(manager, listLikes, 1000, 'list likes');

    // --- CommentLikes ---
    console.log('🔄 Creating comment likes...');
    const commentLikes: CommentLike[] = [];
    for (const cl of seedData.commentLikes) {
        const dbUserId = userIdMap.get(cl.userId);
        const user = dbUserId ? users.find((u) => u.id === dbUserId) : null;
        const comment = comments.find((c) => c.id === cl.commentId);

        if (!user) {
            console.warn(`⚠️  Skipping comment like: Could not find mapped user for seed userId ${cl.userId}`);
            continue;
        }
        if (!comment) {
            console.warn(`⚠️  Skipping comment like: Could not find comment with ID ${cl.commentId}`);
            continue;
        }

        commentLikes.push(
            manager.create(CommentLike, {
                createdAt: cl.createdAt,
                user: user,
                comment: comment,
            }),
        );
    }
    await batchSave(manager, commentLikes, 1000, 'comment likes');

    // --- MovieLikes ---
    if (seedData.movieLikes) {
        console.log('🔄 Creating movie likes...');
        const movieLikes: MovieLike[] = [];
        for (const ml of seedData.movieLikes) {
            const dbUserId = userIdMap.get(ml.userId);
            const user = dbUserId ? users.find((u) => u.id === dbUserId) : null;
            const movie = movies.find((m) => m.id === ml.movieId);

            if (!user) {
                console.warn(`⚠️  Skipping movie like: Could not find mapped user for seed userId ${ml.userId}`);
                continue;
            }
            if (!movie) {
                console.warn(`⚠️  Skipping movie like: Could not find movie with ID ${ml.movieId}`);
                continue;
            }

            movieLikes.push(
                manager.create(MovieLike, {
                    createdAt: ml.createdAt,
                    user: user,
                    movie: movie,
                }),
            );
        }
        await batchSave(manager, movieLikes, 1000, 'movie likes');
    }

    // --- Set up List-Movie relationships ---
    console.log('🔄 Setting up list-movie relationships...');
    await manager.query(`
        CREATE TABLE IF NOT EXISTS list_movie (
            listId INT,
            movieId INT,
            PRIMARY KEY (listId, movieId),
            FOREIGN KEY (listId) REFERENCES lists(id) ON DELETE CASCADE,
            FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE
        );
    `);

    console.log(`Processing ${seedData.listMovie.length} list-movie relationships...`);
    let listMovieInserted = 0;
    let listMovieSkipped = 0;

    for (const join of seedData.listMovie) {
        if (!validMovieIds.has(join.movieId)) {
            listMovieSkipped++;
            continue;
        }
        try {
            await manager.query('INSERT INTO list_movie (listId, movieId) VALUES ($1, $2) ON CONFLICT DO NOTHING', [join.listId, join.movieId]);
            listMovieInserted++;
        } catch (error) {
            listMovieSkipped++;
        }
    }
    console.log(`✅ Created ${listMovieInserted} list-movie relationships (skipped ${listMovieSkipped} invalid)`);

    // ========== FINAL SUMMARY ==========
    console.log('\n🎉 Database populated successfully!');
    console.log('📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Movies: ${movies.length}`);
    console.log(`   Genres: ${genres.length}`);
    console.log(`   Languages: ${languages.length}`);
    console.log(`   Countries: ${countries.length}`);
    console.log(`   Production Companies: ${productionCompanies.length}`);
    console.log(`   Cast Members: ${castMembers.length}`);
    console.log(`   Crew Members: ${crewMembers.length}`);
    console.log(`   Videos: ${videos.length}`);
    console.log(`   Reviews: ${reviews.length}`);
    console.log(`   Review Likes: ${reviewLikes.length}`);
    console.log(`   Views: ${views.length}`);
    console.log(`   Lists: ${lists.length}`);
    console.log(`   List Likes: ${listLikes.length}`);
    console.log(`   Comments: ${comments.length}`);
    console.log(`   Comment Likes: ${commentLikes.length}`);
    console.log(`   Movie-Genre Relationships: ${movieGenreInserted} (skipped ${movieGenreSkipped})`);
    console.log(`   Movie-Language Relationships: ${movieLanguageInserted} (skipped ${movieLanguageSkipped})`);
    console.log(`   Movie-Country Relationships: ${movieCountryInserted} (skipped ${movieCountrySkipped})`);
    console.log(`   Movie-Company Relationships: ${movieCompanyInserted} (skipped ${movieCompanySkipped})`);
    console.log(`   List-Movie Relationships: ${listMovieInserted} (skipped ${listMovieSkipped})`);

    await AppDataSource.destroy();
    console.log('\n✅ Database connection closed');
}

// ---------------- Run ----------------
populateDatabase().catch((err) => {
    console.error('❌ Error populating database:', err);
    process.exit(1);
});
