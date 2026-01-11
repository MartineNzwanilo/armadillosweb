import { FastifyPluginAsync } from 'fastify';

const settingsRoutes: FastifyPluginAsync = async (server) => {

    // GET /api/v1/settings
    server.get('/', async (request, reply) => {
        try {
            // Get Global Settings (singleton, just take first or by generic ID if we had one)
            // Seed creates one.
            let global = await server.prisma.globalSettings.findFirst();

            if (!global) {
                return {
                    settings: { identity: {}, contact: {}, footer: {} },
                    locations: []
                };
            }

            const settingsObj = global.settingsJson ? JSON.parse(global.settingsJson) : {};
            const locationsArr = global.locationsJson ? JSON.parse(global.locationsJson) : [];

            return {
                settings: settingsObj,
                locations: locationsArr
            };
        } catch (e) {
            return reply.status(500).send(e);
        }
    });

    // GET /api/v1/settings/admin (Protected)
    server.get('/admin', { preValidation: [server.authenticate] }, async (request, reply) => {
        try {
            const global = await server.prisma.globalSettings.findFirst();
            if (!global) return { smtpConfig: {} };

            // @ts-ignore
            const smtpConfig = global.smtpConfigJson ? JSON.parse(global.smtpConfigJson) : {};
            return { smtpConfig };
        } catch (e) {
            return reply.status(500).send(e);
        }
    });

    // POST /api/v1/settings
    server.post<{ Body: { settings: any, locations: any[], smtpConfig?: any } }>('/', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { settings, locations, smtpConfig } = request.body;

        try {
            // We'll update the first one or create new
            const existing = await server.prisma.globalSettings.findFirst();

            const settingsData = settings || (existing?.settingsJson ? JSON.parse(existing.settingsJson) : {});
            // If settings passed, merge or replace? Usually entire object is sent back.
            // But let's assume 'settings' provided is the full object.

            // If locations passed, replace.
            const locationsData = locations || (existing?.locationsJson ? JSON.parse(existing.locationsJson) : []);

            // @ts-ignore
            const smtpConfigData = request.body.smtpConfig || (existing?.smtpConfigJson ? JSON.parse(existing.smtpConfigJson) : null);

            if (existing) {
                await server.prisma.globalSettings.update({
                    where: { id: existing.id },
                    data: {
                        settingsJson: JSON.stringify(settingsData),
                        locationsJson: JSON.stringify(locationsData),
                        // @ts-ignore
                        smtpConfigJson: smtpConfigData ? JSON.stringify(smtpConfigData) : null
                    }
                });
            } else {
                await server.prisma.globalSettings.create({
                    data: {
                        settingsJson: JSON.stringify(settingsData),
                        locationsJson: JSON.stringify(locationsData),
                        // @ts-ignore
                        smtpConfigJson: smtpConfigData ? JSON.stringify(smtpConfigData) : null
                    }
                });
            }

            return { success: true };
        } catch (e) {
            server.log.error(e);
            return reply.status(500).send({ error: "Failed to save settings" });
        }
    });
};

export { settingsRoutes };
