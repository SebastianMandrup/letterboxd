import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import type { DeepPartial } from "typeorm";
import { AppDataSource } from "../data-source";
import { Comment } from "../entities/Comment";
import { CommentLike } from "../entities/CommentLike";
import { Genre } from "../entities/Genre";
import { List } from "../entities/List";
import { ListLike } from "../entities/ListLike";
import { Movie } from "../entities/Movie";
import { Review } from "../entities/Review";
import { ReviewLike } from "../entities/ReviewLike";
import { User } from "../entities/User";
import { View } from "../entities/View";
import { TmdbMovie } from "./TmdbMovie";
import { MovieLike } from '../entities/MovieLike';

// ---------------- Paths ----------------
const dataDir = path.join(__dirname, "../data");
const tmdbFilePath = path.join(dataDir, "scraped-data.json");
const genresFilePath = path.join(dataDir, "genres.json");

// ---------------- Configuration ----------------
const NUM_USERS = 100;
const NUM_REVIEWS = 500;
const NUM_VIEWS = 1000;
const NUM_LISTS = 50;
const NUM_COMMENTS = 800;

// ---------------- Helper Functions ----------------
const randomUniqueArray = (length: number, max: number) => {
  return Array.from(new Set(
    Array.from({ length }, () => faker.number.int({ min: 1, max }))
  ));
};

/**
 * Generate unique likes for any "likeable" entity
 */
async function generateUniqueLikes<T extends { id: number }>(
  users: User[],
  targets: T[],
  totalLikes: number,
  manager: any,
  LikeEntity: any
) {
  const likeSet = new Set<string>();
  const likes: any[] = [];
  const targetProp = LikeEntity.name.replace("Like", "").toLowerCase();

  while (likes.length < totalLikes) {
    const user = faker.helpers.arrayElement(users);
    const target = faker.helpers.arrayElement(targets);
    const key = `${user.id}-${target.id}`;
    if (!likeSet.has(key)) {
      likeSet.add(key);
      likes.push(manager.create(LikeEntity, {
        user,
        [targetProp]: target,
        createdAt: faker.date.recent(),
      }));
    }
  }

  await manager.save(likes);
  console.log(`Seeded ${likes.length} ${LikeEntity.name.toLowerCase()}s`);
}

// ---------------- Seed Function ----------------
async function seed() {
  await AppDataSource.initialize();
  const manager = AppDataSource.manager;

  // --- Clear tables in correct order ---
  await manager.query("SET FOREIGN_KEY_CHECKS = 0;");
  const tables = [
    "comment_likes",
    "comments",
    "review_likes",
    "reviews",
    "list_likes",
    "lists_movies_movies",
    "lists",
    "views",
    "movies_genres_genres",
    "movies",
    "movie_likes",
    "genres",
    "users",
  ];
  for (const table of tables) {
    await manager.query(`TRUNCATE TABLE ${table};`);
  }
  await manager.query("SET FOREIGN_KEY_CHECKS = 1;");

  // --- Users ---
  const users: User[] = [];
  for (let i = 0; i < NUM_USERS; i++) {
    users.push(manager.create(User, {
      name: faker.person.fullName(),
      password: await bcrypt.hash("password", 10),
    }));
  }
  await manager.save(users);

  // --- Genres ---
  const genresRaw = fs.readFileSync(genresFilePath, "utf-8");
  const genreData: { id: number; name: string }[] = JSON.parse(genresRaw);
  const genres: Genre[] = genreData.map((g) => manager.create(Genre, g));
  await manager.save(genres);

  // --- Movies ---
  const tmdbMoviesRaw = fs.readFileSync(tmdbFilePath, "utf-8");
  const moviesData: TmdbMovie[] = JSON.parse(tmdbMoviesRaw);
  const movies: Movie[] = moviesData.map((movie) => {
    const validGenreIds = Array.from(new Set(
      movie.genre_ids.filter((id) => genres.some((g) => g.id === id))
    ));
    if (validGenreIds.length === 0 && genres.length > 0) validGenreIds.push(genres[0].id);

    return manager.create(Movie, {
      title: movie.title,
      originalTitle: movie.original_title,
      adult: movie.adult,
      overview: movie.overview,
      popularity: movie.popularity,
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      genres: genres.filter((g) => validGenreIds.includes(g.id)),
    } as DeepPartial<Movie>);
  });
  await manager.save(movies);
  console.log(`Seeded ${movies.length} movies`);

  // --- Reviews ---
  const reviews: Review[] = Array.from({ length: NUM_REVIEWS }, () =>
    manager.create(Review, {
      review: faker.lorem.sentences({ min: 1, max: 3 }),
      rating: parseFloat((Math.random() * 5).toFixed(1)),
      movie: faker.helpers.arrayElement(movies),
      author: faker.helpers.arrayElement(users),
      createdAt: faker.date.past(),
    })
  );
  await manager.save(reviews);

  // --- Views (unique) ---
  const viewSet = new Set<string>();
  const views: View[] = [];
  while (views.length < NUM_VIEWS) {
    const user = faker.helpers.arrayElement(users);
    const movie = faker.helpers.arrayElement(movies);
    const key = `${user.id}-${movie.id}`;
    if (!viewSet.has(key)) {
      viewSet.add(key);
      views.push(manager.create(View, { user, movie }));
    }
  }
  await manager.save(views);

  // --- Comments ---
  const comments: Comment[] = Array.from({ length: NUM_COMMENTS }, () =>
    manager.create(Comment, {
      content: faker.lorem.sentence(),
      createdAt: faker.date.recent(),
      user: faker.helpers.arrayElement(users),
      movie: faker.helpers.arrayElement(movies),
    })
  );
  await manager.save(comments);

  // --- Lists ---
  const lists: List[] = Array.from({ length: NUM_LISTS }, () =>
    manager.create(List, {
      name: `${faker.word.adjective()} ${faker.word.noun()} List`,
      createdAt: faker.date.past(),
      user: faker.helpers.arrayElement(users),
      movies: Array.from(new Set(randomUniqueArray(faker.number.int({ min: 1, max: 10 }), movies.length)))
        .map((i) => movies[i - 1]),
    })
  );
  await manager.save(lists);

  // --- Likes ---
  await generateUniqueLikes(users, reviews, NUM_REVIEWS * 2, manager, ReviewLike);
  await generateUniqueLikes(users, comments, NUM_COMMENTS * 2, manager, CommentLike);
  await generateUniqueLikes(users, lists, NUM_LISTS * 2, manager, ListLike);
  await generateUniqueLikes(users, movies, 2000, manager, MovieLike);

  console.log("✅ Database seeded successfully");
  await AppDataSource.destroy();
}

seed().catch((err) => console.error(err));
