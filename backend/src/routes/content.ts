
import { FastifyPluginAsync } from 'fastify';

const contentRoutes: FastifyPluginAsync = async (server) => {

    // GET /api/v1/content/:page
    server.get<{ Params: { page: string } }>('/:page', async (request, reply) => {
        const { page } = request.params;
        try {
            const data = await server.prisma.pageContent.findUnique({
                where: { pageKey: page }
            });

            if (data) {
                return {
                    ...data,
                    content: data.sectionsJson ? JSON.parse(data.sectionsJson) : {}
                };
            }
            return { page, content: {} };
        } catch (e) {
            server.log.error(e);
            return reply.status(500).send({ error: "Failed to fetch content" });
        }
    });

    // POST /api/v1/content/:page
    server.post<{ Params: { page: string }, Body: { content: any } }>('/:page', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { page } = request.params;
        const { content } = request.body;

        try {
            const contentString = JSON.stringify(content);
            const updated = await server.prisma.pageContent.upsert({
                where: { pageKey: page },
                update: { sectionsJson: contentString },
                create: { pageKey: page, sectionsJson: contentString }
            });
            return updated;
        } catch (e) {
            server.log.error(e);
            return reply.status(500).send({ error: "Failed to update content" });
        }
    });
};

export { contentRoutes };
