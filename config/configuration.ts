export const configuration = () => ({
  server: {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.SERVER_PORT),
  },

  db: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNC == 'true',
    logging: process.env.DATABASE_LOG == 'true',
    cache: process.env.DATABASE_CACHE == 'true',
  },
});
