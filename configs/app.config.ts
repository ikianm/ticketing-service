import DatabaseConfig from "./database.config";

const AppConfig = () => ({
    port: process.env.PORT,

    sanawProfileServiceUrl: process.env.SANAW_PROFILE_SERVICE_URL,
    internalServerErrorMessage: process.env.INTERNAL_SERVER_ERROR_MESSAGE,
    keycloak: {
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        authClientId: process.env.KEYCLOAK_AUTH_CLIENT_ID,
        authClientSecret: process.env.KEYCLOAK_AUTH_CLIENT_SECRET,
        authServer: process.env.KEYCLOAK_AUTH_SERVER,
        realm: process.env.KEYCLOAK_REALM
    },

    database: {
        ...DatabaseConfig()
    }
});

export default AppConfig;