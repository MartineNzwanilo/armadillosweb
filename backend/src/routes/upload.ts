
import { FastifyPluginAsync } from 'fastify';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import util from 'util';

const pump = util.promisify(pipeline);

const uploadRoutes: FastifyPluginAsync = async (server) => {

    server.post('/', async (req, reply) => {
        const data = await req.file();

        if (!data) {
            return reply.status(400).send({ error: "No file uploaded" });
        }

        const uploadDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const ext = path.extname(data.filename);
        const filename = `file-${timestamp}${ext}`;
        const savePath = path.join(uploadDir, filename);

        await pump(data.file, fs.createWriteStream(savePath));

        const fileUrl = `/uploads/${filename}`; // Public URL

        return { url: fileUrl };
    });
};

export { uploadRoutes };
