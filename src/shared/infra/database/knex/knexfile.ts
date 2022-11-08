const knexConfig = {
  development: {
    client: "mssql",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: `${__dirname}/migrations`
    }
  }
};

export default knexConfig;
