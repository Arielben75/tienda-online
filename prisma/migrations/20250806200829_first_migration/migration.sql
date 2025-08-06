-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT NOT NULL,
    "fechaNacimiento" TEXT NOT NULL,
    "nacionalidad" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(0),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articulos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(500) NOT NULL,
    "descripcion" VARCHAR(500),
    "codigo" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(0),

    CONSTRAINT "articulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_medida" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(250),
    "nombre" VARCHAR(250) NOT NULL,
    "descripcion" VARCHAR(250),
    "estado" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(0),

    CONSTRAINT "unidades_medida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos_ingresados" (
    "id" SERIAL NOT NULL,
    "articuloId" INTEGER,
    "cantidad" DOUBLE PRECISION DEFAULT 0,
    "unidadMedidaId" INTEGER,
    "cantidadIngresada" DOUBLE PRECISION DEFAULT 0,
    "cantidadEgresada" DOUBLE PRECISION DEFAULT 0,
    "precioUnitario" DOUBLE PRECISION DEFAULT 0,
    "totalIngreso" DOUBLE PRECISION DEFAULT 0,
    "fechaIngreso" TIMESTAMP,
    "fechaFacturacion" TIMESTAMP,
    "fechaVencimiento" TIMESTAMP,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(0),

    CONSTRAINT "productos_ingresados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventarios" (
    "id" SERIAL NOT NULL,
    "articuloId" INTEGER NOT NULL,
    "unidadMedidaId" INTEGER,
    "cantidadMinima" DOUBLE PRECISION NOT NULL,
    "cantidad" DOUBLE PRECISION DEFAULT 0,
    "esVisibleMp" BOOLEAN NOT NULL DEFAULT true,
    "cantidadOficial" DOUBLE PRECISION DEFAULT 0,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(0),

    CONSTRAINT "inventarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_compras" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "fechaSolicitud" TIMESTAMP NOT NULL,
    "fechaCompra" TIMESTAMP,
    "fechaFacturacion" TIMESTAMP,
    "montoTotalSolicitado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "montoTotalCompra" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "esSolicitudCerrada" BOOLEAN NOT NULL DEFAULT false,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(0),

    CONSTRAINT "solicitudes_compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos_solicitados" (
    "id" SERIAL NOT NULL,
    "articuloId" INTEGER NOT NULL,
    "solicitudCompraId" INTEGER NOT NULL,
    "inventarioId" INTEGER NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "precioUnitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(0),

    CONSTRAINT "productos_solicitados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_userName_key" ON "usuarios"("userName");

-- AddForeignKey
ALTER TABLE "productos_ingresados" ADD CONSTRAINT "productos_ingresados_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "articulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_ingresados" ADD CONSTRAINT "productos_ingresados_unidadMedidaId_fkey" FOREIGN KEY ("unidadMedidaId") REFERENCES "unidades_medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "articulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_compras" ADD CONSTRAINT "solicitudes_compras_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_solicitados" ADD CONSTRAINT "productos_solicitados_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "articulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_solicitados" ADD CONSTRAINT "productos_solicitados_solicitudCompraId_fkey" FOREIGN KEY ("solicitudCompraId") REFERENCES "solicitudes_compras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_solicitados" ADD CONSTRAINT "productos_solicitados_inventarioId_fkey" FOREIGN KEY ("inventarioId") REFERENCES "inventarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
