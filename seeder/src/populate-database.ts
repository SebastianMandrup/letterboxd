/* eslint-disable @typescript-eslint/no-explicit-any */
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

// ---------------- Helper function to deduplicate reviews ----------------
function deduplicateReviews(reviews: any[]): any[] {
    const seen = new Set<string>();
    const uniqueReviews = [];

    for (const review of reviews) {
        const key = `${review.authorId}-${review.movieId}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueReviews.push(review);
        } else {
            console.log(`⚠️  Removing duplicate review: user ${review.authorId} already has a review for movie ${review.movieId}`);
        }
    }

    return uniqueReviews;
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
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                bio TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        // Create reviews table with unique constraint
        await manager.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                review TEXT,
                rating DECIMAL(3,1),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                movieId INT,
                authorId INT,
                FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
                FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY IDX_0ffebf4862fd6403d2e17c36dc (authorId, movieId)
            );
        `);

        // Create other tables...
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
        'ALTER TABLE users AUTO_INCREMENT = 1;',
        'ALTER TABLE genres AUTO_INCREMENT = 1;',
        'ALTER TABLE languages AUTO_INCREMENT = 1;',
        'ALTER TABLE countries AUTO_INCREMENT = 1;',
        'ALTER TABLE production_companies AUTO_INCREMENT = 1;',
        'ALTER TABLE movies AUTO_INCREMENT = 1;',
        'ALTER TABLE cast_members AUTO_INCREMENT = 1;',
        'ALTER TABLE crew_members AUTO_INCREMENT = 1;',
        'ALTER TABLE videos AUTO_INCREMENT = 1;',
        'ALTER TABLE reviews AUTO_INCREMENT = 1;',
        'ALTER TABLE lists AUTO_INCREMENT = 1;',
        'ALTER TABLE comments AUTO_INCREMENT = 1;',
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
    await manager.save(users);

    // Create mapping: seed user index -> database ID
    // Assuming seedData.users array order matches the saved order
    const userIdMap = new Map<number, number>();
    users.forEach((user, index) => {
        // Map seed user index (starting from 1) to actual database ID
        const seedIndex = index + 1; // Assuming seed data uses 1-based indexing
        userIdMap.set(seedIndex, user.id);
    });

    console.log(`✅ Created ${users.length} users`);
    console.log(
        `📊 User ID mapping: ${Array.from(userIdMap.entries())
            .map(([seed, db]) => `${seed}→${db}`)
            .join(', ')}`,
    );

    // --- Genres ---
    console.log('🔄 Creating genres...');
    const genres: Genre[] = seedData.genres.map((g: Partial<Genre>) =>
        manager.create(Genre, {
            id: g.id,
            name: g.name,
        }),
    );
    await manager.save(genres);
    console.log(`✅ Created ${genres.length} genres`);

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
    await manager.save(languages);
    console.log(`✅ Created ${languages.length} languages`);

    // --- Countries ---
    console.log('🔄 Creating countries...');
    const countries: Country[] = seedData.countries.map((c: any) =>
        manager.create(Country, {
            id: c.id,
            iso_3166_1: c.iso_3166_1,
            name: c.name,
        }),
    );
    await manager.save(countries);
    console.log(`✅ Created ${countries.length} countries`);

    // --- Production Companies ---
    console.log('🔄 Creating production companies...');
    const productionCompanies: ProductionCompany[] = seedData.productionCompanies.map((pc: any) =>
        manager.create(ProductionCompany, {
            id: pc.id,
            name: pc.name,
            originCountry: pc.originCountry,
        }),
    );
    await manager.save(productionCompanies);
    console.log(`✅ Created ${productionCompanies.length} production companies`);

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
    await manager.save(movies);
    console.log(`✅ Created ${movies.length} movies`);

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

    // Insert into join tables
    for (const join of seedData.movieGenre) {
        await manager.query('INSERT IGNORE INTO movie_genre (movieId, genreId) VALUES (?, ?)', [join.movieId, join.genreId]);
    }
    console.log(`✅ Created ${seedData.movieGenre.length} movie-genre relationships`);

    for (const join of seedData.movieLanguage) {
        await manager.query('INSERT IGNORE INTO movie_language (movieId, languageId) VALUES (?, ?)', [join.movieId, join.languageId]);
    }
    console.log(`✅ Created ${seedData.movieLanguage.length} movie-language relationships`);

    for (const join of seedData.movieCountry) {
        await manager.query('INSERT IGNORE INTO movie_country (movieId, countryId) VALUES (?, ?)', [join.movieId, join.countryId]);
    }
    console.log(`✅ Created ${seedData.movieCountry.length} movie-country relationships`);

    for (const join of seedData.movieCompany) {
        await manager.query('INSERT IGNORE INTO movie_company (movieId, productionCompanyId) VALUES (?, ?)', [join.movieId, join.productionCompanyId]);
    }
    console.log(`✅ Created ${seedData.movieCompany.length} movie-company relationships`);

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
    await manager.save(castMembers);
    console.log(`✅ Created ${castMembers.length} cast members`);

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
    await manager.save(crewMembers);
    console.log(`✅ Created ${crewMembers.length} crew members`);

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
    await manager.save(videos);
    console.log(`✅ Created ${videos.length} videos`);

    // --- Reviews ---
    console.log('🔄 Creating reviews...');

    // First, deduplicate the reviews to avoid unique constraint violations
    const uniqueReviews = deduplicateReviews(seedData.reviews);
    console.log(`📊 Filtered ${seedData.reviews.length - uniqueReviews.length} duplicate reviews`);

    const reviews: Review[] = [];
    for (const r of uniqueReviews) {
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

        // Use INSERT IGNORE to handle any remaining duplicates gracefully
        try {
            const review = manager.create(Review, {
                id: r.id,
                review: r.review,
                rating: r.rating,
                createdAt: r.createdAt,
                author: user,
                movie: movie,
            });
            reviews.push(review);
        } catch (error) {
            console.warn(`⚠️  Could not create review ${r.id}: ${error}`);
        }
    }

    // Save reviews with error handling for duplicates
    let savedReviewCount = 0;
    for (const review of reviews) {
        try {
            await manager.save(review);
            savedReviewCount++;
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                console.warn(`⚠️  Skipping duplicate review: user ${review.author?.id} already reviewed movie ${review.movie?.id}`);
            } else {
                console.error(`❌ Error saving review: ${error.message}`);
            }
        }
    }
    console.log(`✅ Created ${savedReviewCount} reviews (skipped ${reviews.length - savedReviewCount} duplicates)`);

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
    await manager.save(lists);
    console.log(`✅ Created ${lists.length} lists`);

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
    await manager.save(comments);
    console.log(`✅ Created ${comments.length} comments`);

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
    await manager.save(reviewLikes);
    console.log(`✅ Created ${reviewLikes.length} review likes`);

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
    await manager.save(views);
    console.log(`✅ Created ${views.length} views`);

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
    await manager.save(listLikes);
    console.log(`✅ Created ${listLikes.length} list likes`);

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
    await manager.save(commentLikes);
    console.log(`✅ Created ${commentLikes.length} comment likes`);

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
        await manager.save(movieLikes);
        console.log(`✅ Created ${movieLikes.length} movie likes`);
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

    for (const join of seedData.listMovie) {
        await manager.query('INSERT IGNORE INTO list_movie (listId, movieId) VALUES (?, ?)', [join.listId, join.movieId]);
    }
    console.log(`✅ Created ${seedData.listMovie.length} list-movie relationships`);

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
    console.log(`   Reviews: ${savedReviewCount} (from ${seedData.reviews.length} original)`);
    console.log(`   Review Likes: ${reviewLikes.length}`);
    console.log(`   Views: ${views.length}`);
    console.log(`   Lists: ${lists.length}`);
    console.log(`   List Likes: ${listLikes.length}`);
    console.log(`   Comments: ${comments.length}`);
    console.log(`   Comment Likes: ${commentLikes.length}`);

    await AppDataSource.destroy();
    console.log('\n✅ Database connection closed');
}

// ---------------- Run ----------------
populateDatabase().catch((err) => {
    console.error('❌ Error populating database:', err);
    process.exit(1);
});
