// const { Pool } = require("pg");
require("dotenv").config();

// const pool = new Pool(
//     process.env.DATABASE_URL
//         ? { 
//             connectionString: process.env.DATABASE_URL,
//             ssl: { rejectUnauthorized: false } // Required for Render PostgreSQL
//           }
//         : {
//             user: process.env.POSTGRES_USER || "postgres",
//             password: process.env.POSTGRES_PASSWORD || "your_local_password",
//             host: process.env.POSTGRES_HOST || "localhost",
//             port: process.env.POSTGRES_PORT || 5432,
//             database: process.env.POSTGRES_DATABASE || "your_local_db"
//           }
// );

// module.exports = pool;

const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
  // Fallback for local development (if DB_URL is not set)
  sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PW, 
    {
      host: 'localhost',
      dialect: 'postgres',
    }
  );
}

// sync db
sequelize.sync({ alter: true })  // `alter: true` updates the schema without losing data
    .then(() => console.log('Database synchronized'))
    .catch((err) => console.error('Error syncing database:', err));

module.exports = sequelize;