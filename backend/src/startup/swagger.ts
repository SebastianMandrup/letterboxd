import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Letterboxd Clone API',
            version: '1.0.0',
            description: 'A fullstack movie review and social media platform API',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:5050',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                session: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid',
                    description: 'Session-based authentication',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        data: {
                            type: 'null',
                            nullable: true,
                        },
                        error: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    example: 'Error message',
                                },
                                code: {
                                    type: 'number',
                                    example: 400,
                                },
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                session: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};
