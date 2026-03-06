import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// toda vez que fazemos um chamda ao banco a gente crima um novo PRISMA CLIENT 
// LOGO, esse codigo cria um CACHE, para armezenar essa chamada e não precisar fazer essa chamada sempre