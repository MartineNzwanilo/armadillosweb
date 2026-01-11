import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const authRoutes: FastifyPluginAsync = async (server) => {

    const loginSchema = z.object({
        username: z.string().min(3),
        password: z.string().min(3)
    });

    server.post('/login', async (request, reply) => {
        try {
            console.log("Login Request Body:", request.body);
            const { username, password } = loginSchema.parse(request.body);
            console.log("Attempting login for:", username);

            // @ts-ignore
            const user = await server.prisma.adminUser.findUnique({
                where: { username }
            });
            console.log("User found:", user ? "YES" : "NO");

            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                return reply.status(401).send({ error: 'Invalid credentials' });
            }

            const token = server.jwt.sign({
                id: user.id,
                username: user.username,
                role: 'admin'
            });

            const { password: _, ...cleanUser } = user;
            return { user: cleanUser, token };

        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: "Validation Error", details: error.errors });
            }
            server.log.error(error);
            return reply.status(500).send({ error: error || 'Internal Server Error' });
        }
    });

    server.get('/me', {
        onRequest: [async (request, reply) => {
            try { await request.jwtVerify(); }
            catch (err) { reply.send(err); }
        }]
    }, async (request: any, reply) => {
        try {
            const user = request.user;
            // @ts-ignore
            const dbUser = await server.prisma.adminUser.findUnique({
                where: { id: user.id }
            });
            if (!dbUser) return reply.status(401).send({ error: "User not found" });

            const { password: _, ...cleanUser } = dbUser;
            return { user: cleanUser };
        } catch (e) {
            return reply.status(500).send(e);
        }
    });

    // Change Password
    server.post('/change-password', { onRequest: [server.authenticate] }, async (request: any, reply) => {
        try {
            const { currentPassword, newPassword } = z.object({
                currentPassword: z.string().min(1),
                newPassword: z.string().min(6)
            }).parse(request.body);

            const user = request.user;
            // @ts-ignore
            const dbUser = await server.prisma.adminUser.findUnique({
                where: { id: user.id }
            });

            if (!dbUser) return reply.status(404).send({ error: "User not found" });

            const isValid = await bcrypt.compare(currentPassword, dbUser.password);
            if (!isValid) {
                return reply.status(400).send({ error: "Incorrect current password" });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            // @ts-ignore
            await server.prisma.adminUser.update({
                where: { id: user.id },
                data: { password: hashedNewPassword }
            });

            return { success: true, message: "Password updated successfully" };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: "Validation Error", details: error.errors });
            }
            server.log.error(error);
            return reply.status(500).send({ error: "Failed to update password" });
        }
    });
};

export { authRoutes };
