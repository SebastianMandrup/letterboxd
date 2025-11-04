import bcrypt from "bcrypt";
import fs from "fs";
import path from 'path';
import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Comment } from "../entities/Comment";
import { Genre } from "../entities/Genre";
import { List } from "../entities/List";
import { Movie } from "../entities/Movie";
import { Review } from "../entities/Review";
import { User } from "../entities/User";
import { View } from "../entities/View";

// --- Seed JSON types ---
interface SeedUser { id: number; username: string; email: string; password: string; }
interface SeedGenre { id: number; name: string; }
interface SeedMovie {
  id: number;
  title: string;
  originalTitle?: string;
  adult: boolean;
  overview?: string;
  popularity?: number;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  genreIds: number[];
}
interface SeedReview { review: string; rating: number; movieId: number; authorId: number; createdAt: string; }
interface SeedView { userId: number; movieId: number; }
interface SeedComment { content: string; createdAt: string; userId: number; movieId: number; }
interface SeedList { name: string; createdAt: string; userId: number; movieIds: number[]; }
interface SeedData {
  users: SeedUser[];
  genres: SeedGenre[];
  movies: SeedMovie[];
  reviews: SeedReview[];
  views: SeedView[];
  comments: SeedComment[];
  lists: SeedList[];
}

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("DataSource initialized.");

    // --- Clear existing data safely ---
    await AppDataSource.query("SET FOREIGN_KEY_CHECKS=0");
    const entities = [List, Comment, View, Review, Movie, Genre, User];
    for (const entity of entities) {
      await AppDataSource.manager.clear(entity);
    }
    await AppDataSource.query("SET FOREIGN_KEY_CHECKS=1");
    console.log("Existing data cleared.");

    // --- Load seed JSON ---
    const dataDir = path.join(__dirname, "../data");
    const seedFilePath = path.join(dataDir, "seed-data.json");
    const seedData: SeedData = JSON.parse(fs.readFileSync(seedFilePath, "utf-8"));

    // --- Users ---
    const users: User[] = seedData.users.map(u =>
      AppDataSource.manager.create(User, {
        ...u,
        password: bcrypt.hashSync(u.password, 10),
      })
    );
    await AppDataSource.manager.save(users);
    console.log(`Inserted ${users.length} users.`);

    // --- Genres ---
    const genres: Genre[] = seedData.genres.map(g => AppDataSource.manager.create(Genre, g));
    await AppDataSource.manager.save(genres);
    console.log(`Inserted ${genres.length} genres.`);

    // --- Movies ---
    const moviesMap = new Map<number, Movie>();
    for (const m of seedData.movies) {
      const movie = AppDataSource.manager.create(Movie, {
        title: m.title,
        originalTitle: m.originalTitle,
        adult: Boolean(m.adult),
        overview: m.overview,
        popularity: m.popularity,
        posterUrl: m.posterUrl ?? undefined,
        backdropUrl: m.backdropUrl ?? undefined,
        releaseDate: m.releaseDate,
        voteAverage: m.voteAverage,
        voteCount: m.voteCount,
      });

      await AppDataSource.manager.save(movie);

      // Deduplicate genres
      const uniqueGenres = Array.from(new Set(m.genreIds))
        .map(id => genres.find(g => g.id === id))
        .filter((g): g is Genre => g !== undefined);

      movie.genres = Array.from(new Set(uniqueGenres));
      await AppDataSource.manager.save(movie);
      moviesMap.set(m.id, movie);
    }
    console.log(`Inserted ${moviesMap.size} movies.`);

    // --- Reviews (deduplicate by authorId+movieId) ---
    const uniqueReviewsMap = new Map<string, SeedReview>();
    for (const r of seedData.reviews) {
      const key = `${r.authorId}-${r.movieId}`;
      if (!uniqueReviewsMap.has(key)) uniqueReviewsMap.set(key, r);
    }
    const reviews: Review[] = Array.from(uniqueReviewsMap.values()).map(r =>
      AppDataSource.manager.create(Review, {
        review: r.review,
        rating: r.rating,
        movie: moviesMap.get(r.movieId),
        author: users.find(u => u.id === r.authorId),
        createdAt: r.createdAt,
      })
    );
    await AppDataSource.manager.save(reviews);
    console.log(`Inserted ${reviews.length} reviews.`);

    // --- Views ---
    const views: View[] = seedData.views.map(v =>
      AppDataSource.manager.create(View, {
        user: users.find(u => u.id === v.userId),
        movie: moviesMap.get(v.movieId),
      })
    );
    await AppDataSource.manager.save(views);
    console.log(`Inserted ${views.length} views.`);

    // --- Comments ---
    const comments: Comment[] = seedData.comments.map(c =>
      AppDataSource.manager.create(Comment, {
        content: c.content,
        createdAt: new Date(c.createdAt),
        user: users.find(u => u.id === c.userId),
        movie: moviesMap.get(c.movieId),
      })
    );
    await AppDataSource.manager.save(comments);
    console.log(`Inserted ${comments.length} comments.`);

    // --- Lists (with movies safely added) ---
    for (const l of seedData.lists) {
      const user = users.find(u => u.id === l.userId);
      if (!user) continue;

      // Create the List entity
      const listEntity = AppDataSource.manager.create(List, {
        name: l.name,
        createdAt: new Date(l.createdAt),
        user,
      });

      await AppDataSource.manager.save(listEntity);

      // Deduplicate movie IDs properly
      const uniqueMovieIds = Array.from(new Set(l.movieIds));

      // Map to Movie entities
      const moviesForList: Movie[] = uniqueMovieIds
        .map(id => moviesMap.get(id))
        .filter((m): m is Movie => m !== undefined);

      // Deduplicate movie objects to ensure no duplicates
      const uniqueMovies = Array.from(new Set(moviesForList));

      if (uniqueMovies.length > 0) {
        await AppDataSource.createQueryBuilder()
          .relation(List, "movies")
          .of(listEntity)
          .add(uniqueMovies);
      }
    }
    console.log(`Inserted ${seedData.lists.length} lists.`);


    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

seed();
