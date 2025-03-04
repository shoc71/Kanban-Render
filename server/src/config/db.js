const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool(
    process.env.DATABASE_URL
        ? { 
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false } // Required for Render PostgreSQL
          }
        : {
            user: process.env.POSTGRES_USER || "postgres",
            password: process.env.POSTGRES_PASSWORD || "your_local_password",
            host: process.env.POSTGRES_HOST || "localhost",
            port: process.env.POSTGRES_PORT || 5432,
            database: process.env.POSTGRES_DATABASE || "your_local_db"
          }
);

module.exports = pool;
