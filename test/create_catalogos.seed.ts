import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { blue, bold } from 'chalk';
import * as arrayUnidadesMedida from './json/cat_unidades_medida.json';

export const createUnidadesMedidaSeeder = async (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
) => {
  const result = await Promise.all(
    arrayUnidadesMedida.map((data) => {
      return prisma.unidadesMedida.upsert({
        where: { id: data.id },
        update: data,
        create: data,
      });
    }),
  );
  console.info(blue(`UnidadesMedida created: ${bold.blue(result.length)}`));
};
