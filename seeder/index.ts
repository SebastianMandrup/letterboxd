import fs from "fs";
import { AppDataSource } from "./data-source";
import { Movie } from "./entities/Movie";
import { Review } from "./entities/Review";
import { User } from "./entities/User";
import { View } from "./entities/View";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("DataSource initialized.");

    const data = JSON.parse(fs.readFileSync("seed-data.json", "utf-8"));
    const { users, movies, reviews, views } = data;

    const userRepo = AppDataSource.getRepository(User);
    const movieRepo = AppDataSource.getRepository(Movie);
    const reviewRepo = AppDataSource.getRepository(Review);
    const viewRepo = AppDataSource.getRepository(View);

    // Clear existing data
    await viewRepo.delete({});
    await reviewRepo.delete({});
    await movieRepo.delete({});
    await userRepo.delete({});
    console.log("Existing data cleared.");

    // Insert users and movies in batch
    await userRepo.save(users);
    await movieRepo.save(movies);
    console.log(`Inserted ${users.length} users and ${movies.length} movies.`);

    // Fetch all movies and users once to avoid repeated DB calls
    const movieMap = Object.fromEntries(
      (await movieRepo.find()).map((m) => [m.id, m])
    );
    const userMap = Object.fromEntries(
      (await userRepo.find()).map((u) => [u.id, u])
    );

    // Insert reviews in batch
    const reviewEntities = reviews.map((r: { review: any; rating: any; movieId: string | number; authorId: string | number; }) =>
      reviewRepo.create({
        review: r.review,
        rating: r.rating,
        movie: movieMap[r.movieId],
        author: userMap[r.authorId],
      })
    );
    await reviewRepo.save(reviewEntities);
    console.log(`Inserted ${reviews.length} reviews.`);

    // Insert views in batch
    const viewEntities = views.map((v: { movieId: string | number; userId: string | number; }) =>
      viewRepo.create({
        movie: movieMap[v.movieId],
        user: userMap[v.userId],
      })
    );
    await viewRepo.save(viewEntities);
    console.log(`Inserted ${views.length} views.`);

    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

seed();
