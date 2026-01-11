import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function subscriberRoutes(fastify: FastifyInstance) {
    // 1. Subscribe (Public)
    fastify.post('/subscribe', async (request, reply) => {
        const schema = z.object({
            email: z.string().email(),
        });

        try {
            const { email } = schema.parse(request.body);

            // Check if exists
            const existing = await prisma.subscriber.findUnique({ where: { email } });
            if (existing) {
                if (!existing.isActive) {
                    await prisma.subscriber.update({ where: { email }, data: { isActive: true } });
                    return reply.send({ message: 'Welcome back! You have been resubscribed.' });
                }
                return reply.send({ message: 'You are already subscribed.' });
            }

            await prisma.subscriber.create({ data: { email } });

            // Send Welcome Email
            const { emailService } = await import('../services/emailService');
            emailService.sendWelcome(email).catch(err => console.error("Welcome email error:", err));

            return reply.send({ message: 'Successfully subscribed to notifications.' });
        } catch (error) {
            return reply.status(400).send({ error: 'Invalid email or request.' });
        }
    });

    // 2. Get All Subscribers (Admin)
    fastify.get('/', async (request, reply) => {
        try {
            await request.jwtVerify(); // Protect
            const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
            return subs;
        } catch (err) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
    });

    // 3. Unsubscribe / Delete (Admin)
    fastify.delete('/:id', async (request, reply) => {
        try {
            await request.jwtVerify(); // Protect
            const { id } = request.params as { id: string };
            await prisma.subscriber.delete({ where: { id } });
            return { success: true };
        } catch (err) {
            return reply.status(500).send({ error: 'Failed to delete' });
        }
    });
}
