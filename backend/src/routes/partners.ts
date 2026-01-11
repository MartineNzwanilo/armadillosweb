import { FastifyPluginAsync } from 'fastify';

const partnersRoutes: FastifyPluginAsync = async (server) => {

    // GET /api/v1/partners
    server.get('/', async (req, reply) => {
        try {
            const partners = await server.prisma.partner.findMany({
                orderBy: { createdAt: 'desc' }
            });
            // Map DB fields to Frontend fields
            return partners.map(p => ({
                ...p,
                type: p.category || 'Image',
                logo: p.logoUrl
            }));
        } catch (e) {
            console.error("GET /partners Error:", e);
            const msg = e instanceof Error ? e.message : "Unknown error";
            return reply.status(500).send({ error: msg, details: e });
        }
    });

    // POST /api/v1/partners
    server.post<{ Body: { name: string, type: string, logo: string } }>('/', { onRequest: [server.authenticate] }, async (req, reply) => {
        const { name, type, logo } = req.body;
        try {
            const partner = await server.prisma.partner.create({
                data: {
                    name,
                    category: type, // Map type -> category
                    logoUrl: logo   // Map logo -> logoUrl
                }
            });
            return {
                ...partner,
                type: partner.category || 'Image',
                logo: partner.logoUrl
            };
        } catch (e) {
            console.error("POST /partners Error:", e);
            const msg = e instanceof Error ? e.message : "Unknown error";
            return reply.status(500).send({ error: msg, details: e });
        }
    });

    // DELETE /api/v1/partners/:id
    server.delete<{ Params: { id: string } }>('/:id', { onRequest: [server.authenticate] }, async (req, reply) => {
        const { id } = req.params;
        try {
            await server.prisma.partner.delete({
                where: { id } // id is String uuid
            });
            return { success: true };
        } catch (e) {
            console.error("DELETE /partners Error:", e);
            const msg = e instanceof Error ? e.message : "Unknown error";
            return reply.status(500).send({ error: msg, details: e });
        }
    });
};

export { partnersRoutes };
