import { FastifyPluginAsync } from 'fastify';

const projectsRoutes: FastifyPluginAsync = async (server) => {

    const tryParse = (jsonString: string | null) => {
        if (!jsonString) return null;
        try { return JSON.parse(jsonString); }
        catch (e) { return jsonString; }
    };

    // GET /api/v1/projects
    server.get<{ Querystring: { type: string } }>('/', async (request, reply) => {
        const { type } = request.query;

        try {
            if (type === 'REAL_ESTATE') {
                const listings = await server.prisma.realEstateListing.findMany({ orderBy: { updatedAt: 'desc' } });
                return listings.map(r => ({
                    ...r,
                    location: tryParse(r.location),
                    gallery: tryParse(r.images),
                    features: tryParse(r.features),
                    stats: {
                        sqft: r.sqft,
                        beds: r.bedrooms,
                        baths: r.bathrooms
                    }
                }));
            }

            if (type === 'MINING') {
                return (await server.prisma.miningProject.findMany({ orderBy: { createdAt: 'desc' } })).map(p => ({
                    ...p, type: 'MINING',
                    image: p.imageUrl,
                    yield: p.reservesEstimate
                }));
            }

            if (type === 'CROP_CYCLE') {
                return (await server.prisma.agrobusinessProject.findMany({ orderBy: { createdAt: 'desc' } })).map(p => ({
                    ...p, type: 'CROP_CYCLE',
                    details: tryParse(p.detailsJson)
                }));
            }

            if (type === 'SHIPMENT') {
                return (await server.prisma.chemicalProduct.findMany({ orderBy: { createdAt: 'desc' } })).map(p => ({
                    ...p, type: 'SHIPMENT',
                    details: tryParse(p.technicalSpecsJson),
                    stock: p.stockStatus
                }));
            }

            if (type === 'FACILITY') {
                return (await server.prisma.elutionPlant.findMany({ orderBy: { createdAt: 'desc' } })).map(p => ({
                    ...p, type: 'FACILITY',
                    details: tryParse(p.featuresJson)
                }));
            }

            // Aggregated fetch for main dashboard
            if (!type) {
                const mining = (await server.prisma.miningProject.findMany()).map(p => ({ ...p, type: 'MINING', image: p.imageUrl, yield: p.reservesEstimate }));
                const agro = (await server.prisma.agrobusinessProject.findMany()).map(p => ({ ...p, type: 'CROP_CYCLE', details: tryParse(p.detailsJson) }));
                const chem = (await server.prisma.chemicalProduct.findMany()).map(p => ({ ...p, type: 'SHIPMENT', details: tryParse(p.technicalSpecsJson) }));
                const elution = (await server.prisma.elutionPlant.findMany()).map(p => ({ ...p, type: 'FACILITY', details: tryParse(p.featuresJson) }));

                return [...mining, ...agro, ...chem, ...elution].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }

            return [];
        } catch (e) {
            server.log.error(e);
            return reply.status(500).send(e);
        }
    });

    // GET /api/v1/projects/:id
    server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const mining = await server.prisma.miningProject.findUnique({ where: { id } });
            if (mining) return { ...mining, type: 'MINING', image: mining.imageUrl, yield: mining.reservesEstimate };

            const agro = await server.prisma.agrobusinessProject.findUnique({ where: { id } });
            if (agro) return { ...agro, type: 'CROP_CYCLE', details: tryParse(agro.detailsJson) };

            const chem = await server.prisma.chemicalProduct.findUnique({ where: { id } });
            if (chem) return { ...chem, type: 'SHIPMENT', details: tryParse(chem.technicalSpecsJson), stock: chem.stockStatus };

            const elution = await server.prisma.elutionPlant.findUnique({ where: { id } });
            if (elution) return { ...elution, type: 'FACILITY', details: tryParse(elution.featuresJson) };

            const re = await server.prisma.realEstateListing.findUnique({ where: { id } });
            if (re) return {
                ...re,
                location: tryParse(re.location),
                gallery: tryParse(re.images),
                features: tryParse(re.features),
                stats: { sqft: re.sqft, beds: re.bedrooms, baths: re.bathrooms }
            };

            return reply.status(404).send({ error: "Project not found" });
        } catch (e) {
            return reply.status(500).send(e);
        }
    });

    // POST /api/v1/projects
    server.post<{ Body: { type: string, name?: string, status?: string, details?: any } }>('/', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { type, name, status, details } = request.body;
        const data = details || {};

        try {
            switch (type) {
                case 'REAL_ESTATE':
                    return await server.prisma.realEstateListing.create({
                        data: {
                            title: name || data.title,
                            slug: (name || data.title || 'untitled').toLowerCase().replace(/ /g, '-'),
                            price: Number(data.price) || 0,
                            location: typeof data.location === 'object' ? JSON.stringify(data.location) : (data.location?.address || data.location || ''),
                            type: data.category || 'Sale',
                            description: data.description || '',
                            features: JSON.stringify(data.features || []),
                            images: JSON.stringify(data.gallery || []),
                            sqft: Number(data.stats?.sqft || 0),
                            bedrooms: Number(data.stats?.beds || 0),
                            bathrooms: Number(data.stats?.baths || 0),
                            status: status || 'Available'
                        }
                    });

                case 'MINING':
                    return await server.prisma.miningProject.create({
                        data: {
                            name: name!,
                            code: name!.substring(0, 3).toUpperCase(),
                            location: data.location || '',
                            status: status || 'Active',
                            mineralType: data.mineralType || 'Gold',
                            reservesEstimate: data.yield || '',
                            imageUrl: data.imageUrl || data.image || ''
                        }
                    });

                case 'CROP_CYCLE': // Agrobusiness
                    return await server.prisma.agrobusinessProject.create({
                        data: {
                            name: name!,
                            crop: name!,
                            stage: status || 'Planted',
                            startDate: new Date(),
                            expectedHarvest: new Date(),
                            status: status || 'Active',
                            detailsJson: JSON.stringify(data)
                        }
                    });

                case 'SHIPMENT': // Chemicals
                    return await server.prisma.chemicalProduct.create({
                        data: {
                            name: name!,
                            category: 'Industrial',
                            description: '',
                            stockStatus: status || 'In Stock',
                            technicalSpecsJson: JSON.stringify(data),
                            imageUrl: ''
                        }
                    });

                case 'FACILITY': // Elution
                    return await server.prisma.elutionPlant.create({
                        data: {
                            name: name!,
                            location: data.location || 'Site',
                            capacity: data.capacity || '',
                            status: status || 'Active',
                            featuresJson: JSON.stringify(data),
                            imageUrl: ''
                        }
                    });

                default:
                    return reply.status(400).send({ error: "Invalid Project Type" });
            }
        } catch (e) {
            server.log.error(e);
            return reply.status(500).send({ error: "Failed to create item" });
        }
    });

    // PUT /api/v1/projects/:id
    server.put<{ Params: { id: string }, Body: { name?: string, status?: string, details?: any } }>('/:id', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { id } = request.params;
        const { name, status, details } = request.body;
        const data = details || {};

        try {
            // Try Mining
            const mining = await server.prisma.miningProject.findUnique({ where: { id } });
            if (mining) {
                return await server.prisma.miningProject.update({
                    where: { id },
                    data: {
                        name: name || undefined,
                        status: status || undefined,
                        location: data.location,
                        reservesEstimate: data.yield,
                        imageUrl: data.imageUrl || data.image,
                        mineralType: data.mineralType
                    }
                });
            }

            // Try Agro
            const agro = await server.prisma.agrobusinessProject.findUnique({ where: { id } });
            if (agro) {
                return await server.prisma.agrobusinessProject.update({
                    where: { id },
                    data: {
                        name: name || undefined,
                        status: status || undefined,
                        detailsJson: JSON.stringify(data)
                    }
                });
            }

            // Try Chem
            const chem = await server.prisma.chemicalProduct.findUnique({ where: { id } });
            if (chem) {
                return await server.prisma.chemicalProduct.update({
                    where: { id },
                    data: {
                        name: name || undefined,
                        stockStatus: status || undefined,
                        technicalSpecsJson: JSON.stringify(data)
                    }
                });
            }

            // Try Elution
            const elution = await server.prisma.elutionPlant.findUnique({ where: { id } });
            if (elution) {
                return await server.prisma.elutionPlant.update({
                    where: { id },
                    data: {
                        name: name || undefined,
                        status: status || undefined,
                        location: data.location,
                        featuresJson: JSON.stringify(data)
                    }
                });
            }

            // Try Real Estate
            const re = await server.prisma.realEstateListing.findUnique({ where: { id } });
            if (re) {
                return await server.prisma.realEstateListing.update({
                    where: { id },
                    data: {
                        title: name || undefined,
                        status: status || undefined,
                        price: data.price ? Number(data.price) : undefined,
                        location: typeof data.location === 'object' ? JSON.stringify(data.location) : (data.location?.address || data.location),
                        type: data.category || undefined,
                        description: data.description || undefined,
                        features: data.features ? JSON.stringify(data.features) : undefined,
                        images: data.gallery ? JSON.stringify(data.gallery) : undefined,
                        sqft: data.stats?.sqft ? Number(data.stats.sqft) : undefined,
                        bedrooms: data.stats?.beds ? Number(data.stats.beds) : undefined,
                        bathrooms: data.stats?.baths ? Number(data.stats.baths) : undefined,
                    }
                });
            }

            return reply.status(404).send({ error: "Item not found" });

        } catch (e) {
            server.log.error(e);
            return reply.status(500).send({ error: "Update failed" });
        }
    });

    // DELETE /api/v1/projects/:id
    server.delete<{ Params: { id: string } }>('/:id', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { id } = request.params;
        try {
            if (await server.prisma.miningProject.findUnique({ where: { id } })) {
                await server.prisma.miningProject.delete({ where: { id } });
                return { success: true };
            }
            if (await server.prisma.agrobusinessProject.findUnique({ where: { id } })) {
                await server.prisma.agrobusinessProject.delete({ where: { id } });
                return { success: true };
            }
            if (await server.prisma.chemicalProduct.findUnique({ where: { id } })) {
                await server.prisma.chemicalProduct.delete({ where: { id } });
                return { success: true };
            }
            if (await server.prisma.elutionPlant.findUnique({ where: { id } })) {
                await server.prisma.elutionPlant.delete({ where: { id } });
                return { success: true };
            }
            if (await server.prisma.realEstateListing.findUnique({ where: { id } })) {
                await server.prisma.realEstateListing.delete({ where: { id } });
                return { success: true };
            }

            return reply.status(404).send({ error: "Item not found" });
        } catch (e) {
            server.log.error(e);
            return reply.status(500).send({ error: "Delete failed" });
        }
    });
};

export { projectsRoutes };
