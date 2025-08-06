import { PrismaClient } from '@prisma/client';
import { createUnidadesMedidaSeeder } from './create_catalogos.seed';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_TEST_URL, // Usar la variable de entorno para la URL de la base de datos de pruebas
    },
  },
});

async function main() {
  await createUnidadesMedidaSeeder(prisma);
}

export async function seedDatabase() {
  await main()
    .catch(async (e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
}
