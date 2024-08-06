import DatabaseConfig from "./database.config";

const AppConfig = () => ({
    database: {
        ...DatabaseConfig()
    }
});

export default AppConfig;