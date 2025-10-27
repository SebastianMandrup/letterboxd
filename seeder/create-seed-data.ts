import { faker } from "@faker-js/faker";
import fs from "fs";

const NUM_USERS = 100;
const NUM_MOVIES = 200;
const NUM_REVIEWS = 500;
const NUM_VIEWS = 1000;

// Users with passwords
const users = Array.from({ length: NUM_USERS }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    password: faker.string.uuid().replace(/-/g, ''),
}));

// Movies without 'released' field
const movies = Array.from({ length: NUM_MOVIES }, (_, i) => ({
    id: i + 1,
    title: faker.lorem.words({ min: 2, max: 5 }),
    posterUrl: faker.image.url({ width: 300, height: 450 }),
    releaseDate: faker.date.past({ years: 30 }).toISOString().split("T")[0],
}));

// Reviews linking to user & movie
const reviews = Array.from({ length: NUM_REVIEWS }, (_, i) => ({
    id: i + 1,
    review: faker.lorem.sentences({ min: 1, max: 3 }),
    rating: parseFloat((Math.random() * 5).toFixed(1)),
    movieId: faker.number.int({ min: 1, max: NUM_MOVIES }),
    authorId: faker.number.int({ min: 1, max: NUM_USERS }),
}));

// Views linking to user & movie
const views = Array.from({ length: NUM_VIEWS }, (_, i) => ({
    id: i + 1,
    movieId: faker.number.int({ min: 1, max: NUM_MOVIES }),
    userId: faker.number.int({ min: 1, max: NUM_USERS }),
}));

// Combine all into one JSON
const data = { users, movies, reviews, views };

// Write to file
fs.writeFileSync("seed-data.json", JSON.stringify(data, null, 2));

console.log("seed-data.json created with updated schema!");
