

export function ormConfig(): any {
  return {
    type: "mongodb",
    url: process.env.DATA_URI,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
    entities: process.env.DB_ENTITIES,
    autoLoadEntities: true,
    connectTimeout: 3000,
    acquireTimeout: 3000,
    extra: {
      connectionLimit: 8,
    },
    migrations: [
      'dist/database/migrations/*.js',
    ],
    subscribers: [
      'dist/observers/subscribers/*.subscriber.js',
    ],
    cli: {
      entitiesDir: 'src/**/entity',
      migrationsDir: 'src/database/migrations',
      subscribersDir: 'src/observers/subscribers',
    },
  };
}