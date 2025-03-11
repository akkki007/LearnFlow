const config = {
    // Server-side environment variables
    SERVER: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        API_URL: process.env.API_URL || 'http://localhost:3000',
        DATABASE_URL: process.env.DATABASE_URL || 'your_database_url',
    },

    // Client-side public environment variables (must be prefixed with NEXT_PUBLIC_)
    CLIENT: {
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'LearnFlow',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    },

    // Authentication configuration
    AUTH: {
        JWT_SECRET: process.env.JWT_SECRET || 'dwdd332da',
        JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
    },
};

export default config;