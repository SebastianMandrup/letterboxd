import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource } from "../data-source.ts";
import { User } from "../entities/User.ts";
import { Movie } from "../entities/Movie.ts";
import { Genre } from "../entities/Genre.ts";
import { Review } from "../entities/Review.ts";
import { ReviewLike } from "../entities/ReviewLike.ts";
import { View } from "../entities/View.ts";
import { Comment } from "../entities/Comment.ts";
import { CommentLike } from "../entities/CommentLike.ts";
import { List } from "../entities/List.ts";
import { ListLike } from "../entities/ListLike.ts";
import { MovieLike } from "../entities/MovieLike.ts";

// ---------------- ESM __dirname fix ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- Paths ----------------
const seedFilePath = path.join(__dirname, "../data/seed-data.json");

// ---------------- Seed Function ----------------
async function populateDatabase() {
  if (!fs.existsSync(seedFilePath)) {
    console.error(`❌ Seed file not found: ${seedFilePath}`);
    process.exit(1);
  }

  const seedRaw = fs.readFileSync(seedFilePath, "utf-8");
  const seedData = JSON.parse(seedRaw);

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
  const users: User[] = seedData.users.map((u: any) =>
    manager.create(User, u)
  );
  await manager.save(users);

  // --- Genres ---
  const genres: Genre[] = seedData.genres.map((g: any) =>
    manager.create(Genre, g)
  );
  await manager.save(genres);

  // --- Movies ---

  const movies: Movie[] = seedData.movies.map((m: any) =>
    manager.create(Movie, {
      ...m,
      genres: genres.filter((g) => m.genreIds.includes(g.id)),
    })
  );
  await manager.save(movies);

  // --- Reviews ---
  const reviews: Review[] = seedData.reviews.map((r: any) =>
    manager.create(Review, {
      ...r,
      author: users.find((u) => u.id === r.authorId),
      movie: movies.find((m) => m.id === r.movieId),
    })
  );
  await manager.save(reviews);

  // --- ReviewLikes ---
  const reviewLikes: ReviewLike[] = seedData.reviewLikes.map((rl: any) =>
    manager.create(ReviewLike, {
      ...rl,
      user: users.find((u) => u.id === rl.userId),
      review: reviews.find((r) => r.id === rl.reviewId),
    })
  );
  await manager.save(reviewLikes);

  // --- Views ---
  const views: View[] = seedData.views.map((v: any) =>
    manager.create(View, {
      ...v,
      user: users.find((u) => u.id === v.userId),
      movie: movies.find((m) => m.id === v.movieId),
    })
  );
  await manager.save(views);

  // --- Comments ---
  const comments: Comment[] = seedData.comments.map((c: any) =>
    manager.create(Comment, {
      ...c,
      user: users.find((u) => u.id === c.userId),
      movie: movies.find((m) => m.id === c.movieId),
    })
  );
  await manager.save(comments);

  // --- CommentLikes ---
  const commentLikes: CommentLike[] = seedData.commentLikes.map((cl: any) =>
    manager.create(CommentLike, {
      ...cl,
      user: users.find((u) => u.id === cl.userId),
      comment: comments.find((c) => c.id === cl.commentId),
    })
  );
  await manager.save(commentLikes);

  // --- Lists ---
  const lists: List[] = seedData.lists.map((l: any) =>
    manager.create(List, {
      ...l,
      user: users.find((u) => u.id === l.userId),
      movies: l.movieIds.map((id: number) => movies.find((m) => m.id === id)),
    })
  );
  await manager.save(lists);

  // --- ListLikes ---
  const listLikes: ListLike[] = seedData.listLikes.map((ll: any) =>
    manager.create(ListLike, {
      ...ll,
      user: users.find((u) => u.id === ll.userId),
      list: lists.find((l) => l.id === ll.listId),
    })
  );
  await manager.save(listLikes);

  // --- MovieLikes ---
  if (seedData.movieLikes) {
    const movieLikes: MovieLike[] = seedData.movieLikes.map((ml: any) =>
      manager.create(MovieLike, {
        ...ml,
        user: users.find((u) => u.id === ml.userId),
        movie: movies.find((m) => m.id === ml.movieId),
      })
    );
    await manager.save(movieLikes);
  }

  console.log("✅ Database populated successfully!");
  await AppDataSource.destroy();
}

// ---------------- Run ----------------
populateDatabase().catch((err) => {
  console.error("❌ Error populating database:", err);
});
