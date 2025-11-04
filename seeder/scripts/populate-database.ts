import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import type { DeepPartial } from "typeorm";
import { AppDataSource } from '../data-source';
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
    // Deduplicate genre IDs
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

  // --- ReviewLikes (unique) ---
  const reviewLikeSet = new Set<string>();
  const reviewLikes: ReviewLike[] = [];
  while (reviewLikes.length < NUM_REVIEWS * 2) {
    const user = faker.helpers.arrayElement(users);
    const review = faker.helpers.arrayElement(reviews);
    const key = `${user.id}-${review.id}`;
    if (!reviewLikeSet.has(key)) {
      reviewLikeSet.add(key);
      reviewLikes.push(manager.create(ReviewLike, { user, review, createdAt: faker.date.recent() }));
    }
  }
  await manager.save(reviewLikes);

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

  // --- CommentLikes (unique) ---
  const commentLikeSet = new Set<string>();
  const commentLikes: CommentLike[] = [];
  while (commentLikes.length < NUM_COMMENTS * 2) {
    const user = faker.helpers.arrayElement(users);
    const comment = faker.helpers.arrayElement(comments);
    const key = `${user.id}-${comment.id}`;
    if (!commentLikeSet.has(key)) {
      commentLikeSet.add(key);
      commentLikes.push(manager.create(CommentLike, { user, comment, createdAt: faker.date.recent() }));
    }
  }
  await manager.save(commentLikes);

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

  // --- ListLikes (unique) ---
  const listLikeSet = new Set<string>();
  const listLikes: ListLike[] = [];
  while (listLikes.length < NUM_LISTS * 2) {
    const user = faker.helpers.arrayElement(users);
    const list = faker.helpers.arrayElement(lists);
    const key = `${user.id}-${list.id}`;
    if (!listLikeSet.has(key)) {
      listLikeSet.add(key);
      listLikes.push(manager.create(ListLike, { user, list, createdAt: faker.date.recent() }));
    }
  }
  await manager.save(listLikes);

  console.log("✅ Database seeded successfully");
  await AppDataSource.destroy();
}

seed().catch((err) => console.error(err));
