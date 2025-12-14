/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionOptions, CookieOptions } from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

export async function getSessionConfig(): Promise<SessionOptions> {
    const isProduction = process.env.NODE_ENV === 'production';

    // Fix: Type 'sameSite' properly
    const cookieOptions: CookieOptions = {
        secure: isProduction,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    };

    if (isProduction && process.env.REDIS_URL) {
        console.log('🔐 Attempting to connect to internal Redis...');

        try {
            // Parse the URL
            const redisUrl = process.env.REDIS_URL;
            console.log('🔗 Redis URL:', redisUrl);

            // For internal Redis without password, use simple connection
            const redisClient = createClient({
                url: redisUrl,
                // No TLS, no password for internal services
            });

            // Add event listeners
            redisClient.on('error', (err) => {
                console.error('Redis error:', err.message);
            });

            redisClient.on('connect', () => {
                console.log('Redis: Connected');
            });

            console.log('Connecting...');
            await redisClient.connect();
            console.log('✅ Connected to internal Redis!');

            // Quick test
            await redisClient.set('internal_test', 'success_' + Date.now());
            console.log('✅ Redis test write successful');

            const redisStore = new RedisStore({
                client: redisClient,
                prefix: 'sess:',
            });

            return {
                store: redisStore,
                secret: process.env.SESSION_SECRET || 'dev-secret',
                resave: false,
                saveUninitialized: false,
                proxy: true,
                cookie: cookieOptions,
            };
        } catch (error: any) {
            console.error('❌ Redis connection failed:', error.message);

            // Try alternative - maybe the hostname is different internally
            console.log('🔄 Trying alternative connection...');

            try {
                // Sometimes internal services use different hostnames
                // Try connecting with just host and port
                const url = new URL(process.env.REDIS_URL!);
                const internalClient = createClient({
                    socket: {
                        host: url.hostname,
                        port: parseInt(url.port),
                        // No TLS for internal
                        connectTimeout: 5000,
                    },
                });

                await internalClient.connect();
                console.log('✅ Connected via direct host/port!');

                const redisStore = new RedisStore({
                    client: internalClient,
                    prefix: 'sess:',
                });

                return {
                    store: redisStore,
                    secret: process.env.SESSION_SECRET || 'dev-secret',
                    resave: false,
                    saveUninitialized: false,
                    proxy: true,
                    cookie: cookieOptions,
                };
            } catch (fallbackError: any) {
                console.error('❌ Fallback also failed:', fallbackError.message);

                // Last resort: use MemoryStore but log warning
                console.log('⚠️  Using MemoryStore (will cause CSRF issues!)');
                return {
                    secret: process.env.SESSION_SECRET || 'dev-secret',
                    resave: false,
                    saveUninitialized: false,
                    proxy: true,
                    cookie: cookieOptions,
                };
            }
        }
    }

    console.log('💻 Using MemoryStore for development');
    return {
        secret: process.env.SESSION_SECRET || 'dev-secret',
        resave: false,
        saveUninitialized: false,
        cookie: cookieOptions,
    };
}
