import { Faker, es } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from './test-data-base-seeder-catalogos';
// import { seedDatabase } from '../seeders/main-test.seed';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_TEST_URL,
    },
  },
});

const cleanDatabase = async () => {
  console.log('Cleaning database dynamically...');

  const tables = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;

  // // Desactiva temporalmente las restricciones de claves foráneas
  // await prisma.$executeRawUnsafe('SET session_replication_role = replica;');

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
    }
  }

  // Reactiva las restricciones de claves foráneas
  // await prisma.$executeRawUnsafe('SET session_replication_role = DEFAULT;');
  console.log('Database cleaned successfully.');
};

const seedCatalogs = async () => {
  console.log('Seeding catalogs...');
  try {
    await seedDatabase();
    console.log('Catalogs seeded successfully.');
  } catch (err) {
    console.error('Error during seeding:', err);
    throw err;
  }
};

const configFaker = async () => {
  console.warn('Configuring Faker...');

  globalThis.faker = new Faker({ locale: es });

  console.log('Faker configured successfully.');
};

export default async () => {
  console.log('Running global setup...');
  await cleanDatabase();
  await seedCatalogs();
  await configFaker();
};
