
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function contactRoutes(fastify: FastifyInstance) {

    // Public: Submit a Message
    fastify.post('/', async (req: any, reply) => {
        try {
            const { name, email, subject, message, inquiryType } = req.body;

            const finalSubject = inquiryType ? `[${inquiryType}] ${subject || 'No Subject'}` : subject;

            const newMessage = await prisma.contactMessage.create({
                data: {
                    name,
                    email,
                    subject: finalSubject || "General Inquiry",
                    message,
                    status: 'NEW'
                }
            });
            return newMessage;
        } catch (e) {
            console.error("Submit Message Error:", e);
            reply.code(500).send({ error: "Failed to send message" });
        }
    });

    // Admin: Get All Messages
    fastify.get('/', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        try {
            const messages = await prisma.contactMessage.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return messages;
        } catch (e) {
            console.error("Fetch Messages Error:", e);
            reply.code(500).send({ error: "Failed to fetch messages" });
        }
    });

    // Admin: Get Single Message (and mark as read if needed)
    fastify.get('/:id', { onRequest: [fastify.authenticate] }, async (req: any, reply) => {
        try {
            const { id } = req.params;
            const message = await prisma.contactMessage.findUnique({
                where: { id }
            });
            return message;
        } catch (e) {
            reply.code(500).send({ error: "Failed to fetch message" });
        }
    });


    // Admin: Update Status
    fastify.put('/:id', { onRequest: [fastify.authenticate] }, async (req: any, reply) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const updated = await prisma.contactMessage.update({
                where: { id },
                data: { status }
            });
            return updated;
        } catch (e) {
            reply.code(500).send({ error: "Failed to update status" });
        }
    });

    // Admin: Reply to Message
    fastify.post('/:id/reply', { onRequest: [fastify.authenticate] }, async (req: any, reply) => {
        try {
            const { id } = req.params;
            const { replyBody } = req.body;

            // In a real app, send email here via Nodemailer/SendGrid logic
            console.log(`Sending email to message ${id}: ${replyBody}`);

            const updated = await prisma.contactMessage.update({
                where: { id },
                data: {
                    status: 'REPLIED',
                    reply: replyBody
                }
            });
            return updated;
        } catch (e) {
            reply.code(500).send({ error: "Failed to send reply" });
        }
    });

    // Admin: Delete Message
    fastify.delete('/:id', { onRequest: [fastify.authenticate] }, async (req: any, reply) => {
        try {
            const { id } = req.params;
            await prisma.contactMessage.delete({ where: { id } });
            return { success: true };
        } catch (e) {
            reply.code(500).send({ error: "Failed to delete message" });
        }
    });
}
