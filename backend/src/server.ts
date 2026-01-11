import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { prismaPlugin } from './plugins/prisma';
import { authRoutes } from './routes/auth';
import { contentRoutes } from './routes/content';
import { settingsRoutes } from './routes/settings';
import { projectsRoutes } from './routes/projects';
import { uploadRoutes } from './routes/upload';
import { partnersRoutes } from './routes/partners';
import { contactRoutes } from './routes/contactRoutes';
import { newsRoutes } from './routes/news';
import { subscriberRoutes } from './routes/subscribers';
import path from 'path';



import fastifyJwt from '@fastify/jwt';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: any, reply: any) => Promise<void>;
    }
}




const server = Fastify({
    logger: true,
});

const start = async () => {
    try {
        await server.register(cors, {
            origin: '*',
            allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
            exposedHeaders: ['Content-Range', 'X-Total-Count', 'Content-Length', 'Accept-Ranges']
        });

        // Register Multipart
        await server.register(require('@fastify/multipart'), {
            limits: {
                fileSize: 500 * 1024 * 1024 // 500MB
            }
        });

        // Register JWT
        await server.register(fastifyJwt, {
            secret: process.env.JWT_SECRET || 'supersecret'
        });

        server.decorate('authenticate', async (request: any, reply: any) => {
            try {
                await request.jwtVerify();
            } catch (err) {
                reply.send(err);
            }
        });

        // Register Plugins
        await server.register(prismaPlugin);

        // Register Routes
        await server.register(authRoutes, { prefix: '/api/v1/auth' });
        await server.register(contentRoutes, { prefix: '/api/v1/content' });
        await server.register(settingsRoutes, { prefix: '/api/v1/settings' });
        await server.register(projectsRoutes, { prefix: '/api/v1/projects' });
        await server.register(partnersRoutes, { prefix: '/api/v1/partners' });
        await server.register(uploadRoutes, { prefix: '/api/v1/upload' });
        await server.register(contactRoutes, { prefix: '/api/v1/contact' });
        await server.register(newsRoutes, { prefix: '/api/v1/news' });
        await server.register(subscriberRoutes, { prefix: '/api/v1/subscribers' });

        // Serve Static Uploads
        server.register(require('@fastify/static'), {
            root: path.join(__dirname, '../public/uploads'),
            prefix: '/uploads/',
            acceptRanges: true,
            decorateReply: false // Default is true, setting false avoids conflicts if multiple static plugins? No, keep default or true.
        });

        server.get('/health', async () => {
            return { status: 'ok', timestamp: new Date() };
        });

        const port = parseInt(process.env.PORT || '3005');
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server running on port ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
