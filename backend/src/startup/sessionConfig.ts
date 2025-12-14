import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

export async function getSessionConfig(): Promise<session.SessionOptions> {
    const isProduction = process.env.NODE_ENV === 'production';

    // Default development config
    const defaultConfig: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || 'dev-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: isProduction,
            sameSite: isProduction ? 'lax' : 'strict', // Type-safe values
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
    };

    if (isProduction && process.env.REDIS_URL) {
        console.log('🔐 Using Redis session store for production');

        try {
            const redisClient = createClient({
                url: process.env.REDIS_URL,
                socket: {
                    tls: true,
                    rejectUnauthorized: false,
                },
            });

            // Add event listeners for debugging
            redisClient.on('error', (err) => {
                console.error('Redis Client Error:', err.message);
            });

            redisClient.on('connect', () => {
                console.log('✅ Connected to Redis');
            });

            await redisClient.connect();

            // Directly use RedisStore as a class
            const redisStore = new RedisStore({
                client: redisClient,
                prefix: 'sess:',
                ttl: 86400, // Optional: session TTL in seconds
            });

            return {
                ...defaultConfig,
                store: redisStore,
                proxy: true, // Important for production
            };
        } catch (error) {
            console.error('❌ Failed to connect to Redis:', error);
            console.log('⚠️  Falling back to MemoryStore (not recommended for production!)');

            // Add warning headers in production if Redis fails
            if (isProduction) {
                console.error('🚨 WARNING: Using MemoryStore in production!');
                console.error('🚨 This will cause session and CSRF issues!');
            }

            return defaultConfig;
        }
    }

    // Development: use MemoryStore
    console.log('💻 Using MemoryStore for development');
    return defaultConfig;
}
