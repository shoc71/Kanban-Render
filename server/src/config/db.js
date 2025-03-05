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
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    ssl: process.env.NODE_ENV === 'production',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
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

// Enable UUID extension for PostgreSQL if not already enabled
sequelize.authenticate()
  .then(() => {
    // console.log('Connection has been established successfully.');
    return sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  })
  .then(() => {
    console.log('UUID extension enabled');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Sync DB
sequelize.sync({ alter: true })
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.error('Error syncing database:', err));

module.exports = sequelize;