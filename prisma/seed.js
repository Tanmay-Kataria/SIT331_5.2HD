// prisma/seed.js
import { prisma } from './client.js';

async function main() {
  await prisma.artist.create({
    data: { name: "Emily Kame Kngwarreye", nationality: "Australian" }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());