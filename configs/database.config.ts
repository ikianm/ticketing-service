
const DatabaseConfig = () => ({
    type: 'mongodb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [],
    synchronize: process.env.NODE_ENV === 'production' ? false : true
});

export default DatabaseConfig;