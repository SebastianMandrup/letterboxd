import fs from "fs";
import { DeepPartial } from 'typeorm';
import { AppDataSource } from "./data-source";
import { Movie } from "./entities/Movie";
import { Review } from "./entities/Review";
import { User } from "./entities/User";
import { View } from "./entities/View";

// Utility to chunk arrays
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("DataSource initialized.");

    const data = JSON.parse(fs.readFileSync("seed-data.json", "utf-8")) as {
      users: DeepPartial<User>[];
      movies: DeepPartial<Movie>[];
      reviews: any[];
      views: any[];
    };
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

    // Insert users in batch (usually small, so single save is fine)
    await userRepo.save(users);
    console.log(`Inserted ${users.length} users.`);

    // Insert movies in batches
    const movieChunks = chunkArray(movies, 200); // batch size of 200
    for (const [i, chunk] of movieChunks.entries()) {
      await movieRepo.save(chunk);
      console.log(`Inserted batch ${i + 1}/${movieChunks.length} (${chunk.length} movies).`);
    }

    // Fetch all movies and users once to avoid repeated DB calls
    const movieMap = Object.fromEntries(
      (await movieRepo.find()).map((m) => [m.id, m])
    );
    const userMap = Object.fromEntries(
      (await userRepo.find()).map((u) => [u.id, u])
    );

    // Insert reviews
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

    // Insert views
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
