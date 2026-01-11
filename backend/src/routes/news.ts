import { FastifyInstance } from 'fastify';

export async function newsRoutes(server: FastifyInstance) {

    // Public: List Published News
    server.get('/', async (request, reply) => {
        try {
            const news = await server.prisma.newsPost.findMany({
                where: { published: true },
                orderBy: { createdAt: 'desc' }
            });
            return news;
        } catch (error) {
            server.log.error(error);
            return reply.code(500).send({ error: 'Failed to fetch news' });
        }
    });

    // Public: Get Single News
    server.get('/:id', async (request: any, reply) => {
        const { id } = request.params;
        try {
            const news = await server.prisma.newsPost.findFirst({
                where: { id, published: true }
            });
            if (!news) return reply.code(404).send({ error: 'News not found' });
            return news;
        } catch (error) {
            return reply.code(500).send({ error: 'Failed to fetch news' });
        }
    });

    // Admin: Create News & Broadcast
    server.post('/', { preValidation: [server.authenticate] }, async (request: any, reply) => {
        const { title, content, type, mediaUrl, published } = request.body;
        try {
            const news = await server.prisma.newsPost.create({
                data: { title, content, type: type || 'TEXT', mediaUrl, published: published || false }
            });

            // Email Notification Logic
            if (published) {
                const subscribers = await server.prisma.subscriber.findMany({ where: { isActive: true } });
                const emails = subscribers.map(s => s.email);

                const { emailService } = await import('../services/emailService');
                const link = `http://localhost:3002/news/${news.id}`;

                emailService.sendBroadcast(emails, title, content, link, news.mediaUrl || undefined)
                    .then(() => console.log(`📧 Notification sent to ${emails.length} subscribers`))
                    .catch(e => console.error("Notification error:", e));
            }

            return news;
        } catch (error) {
            server.log.error(error);
            return reply.code(500).send({ error: 'Failed to create news' });
        }
    });

    // Admin: List All News
    server.get('/admin', { preValidation: [server.authenticate] }, async (request, reply) => {
        const news = await server.prisma.newsPost.findMany({ orderBy: { createdAt: 'desc' } });
        return news;
    });

    // Admin: Delete News
    server.delete('/:id', { preValidation: [server.authenticate] }, async (request: any, reply) => {
        const { id } = request.params;
        try {
            await server.prisma.newsPost.delete({ where: { id } });
            return { message: 'Deleted' };
        } catch (error) {
            return reply.code(500).send({ error: 'Delete failed' });
        }
    });

    // Admin: Update News
    server.put('/:id', { preValidation: [server.authenticate] }, async (request: any, reply) => {
        const { id } = request.params;
        const data = request.body;
        try {
            const news = await server.prisma.newsPost.update({ where: { id }, data });
            return news;
        } catch (error) {
            return reply.code(500).send({ error: 'Update failed' });
        }
    });
}
