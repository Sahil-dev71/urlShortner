import "dotenv/config";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './models/index.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    // host: 'localhost',
    // port: 5432,
    // user: 'postgres',
    // password: 'sahil',
    // database: 'users',
    // ssl: false,
  },
});