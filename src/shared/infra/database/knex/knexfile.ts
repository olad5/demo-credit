const knexConfig = {
  development: {
    client: "mysql",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: `${__dirname}/migrations`
    }
  }
};

export default knexConfig;
