
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to database...");
        // @ts-ignore
        const users = await prisma.adminUser.findMany();
        console.log("Users found:", users.length);
        // @ts-ignore
        users.forEach(u => console.log(`- ID: ${u.id}, User: ${u.username}, Role: ${u.role}`));
    } catch (e) {
        console.error("Error verifying users:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
