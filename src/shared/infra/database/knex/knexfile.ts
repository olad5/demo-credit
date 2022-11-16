import dotenv from "dotenv";
dotenv.config({ path: "../../../../../.env" });

const knexConfig = {
  development: {
    client: "mysql",
    connection: process.env.DATABASE_URL || {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: "utf8"
    },
    migrations: {
      directory: `${__dirname}/migrations`
    },
    seeds: {
      directory: `./seeds`
    }
  }
};

export default knexConfig;
