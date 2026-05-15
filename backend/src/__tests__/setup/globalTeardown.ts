import { PrismaClient } from "@prisma/client";

export default async function globalTeardown(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    console.log("🧹 Cleaning up test database...");
    await prisma.$executeRawUnsafe(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);
    console.log("✅ Test database cleaned.");
  } finally {
    await prisma.$disconnect();
  }
}