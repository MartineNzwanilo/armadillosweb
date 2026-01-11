
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const elution = await prisma.pageContent.findUnique({ where: { pageKey: 'elution' } });
    console.log("Elution:", elution?.sectionsJson ? "Found" : "Missing");
    if (elution?.sectionsJson) {
        console.log(elution.sectionsJson.substring(0, 100));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
