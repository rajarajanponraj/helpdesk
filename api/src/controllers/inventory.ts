import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { requirePermission } from "../lib/roles";

export async function inventoryRoutes(fastify: FastifyInstance) {
  // Sellers
  fastify.post(
    "/api/v1/sellers/create",
    { preHandler: requirePermission(["sellers::create"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const seller = await prisma.seller.create({
        data: request.body as any,
      });
      reply.send({ success: true, sellers:seller });
    }
  );

  fastify.get(
    "/api/v1/sellers/all",
    { preHandler: requirePermission(["sellers::read"]) },
    async (_, reply: FastifyReply) => {
      const sellers = await prisma.seller.findMany();
      reply.send({ success: true, sellers });
    }
  );

  fastify.get(
    "/api/v1/sellers/:id",
    { preHandler: requirePermission(["sellers::read"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      const seller = await prisma.seller.findUnique({ where: { id } });
      seller
        ? reply.send({ success: true, seller })
        : reply.status(404).send({ success: false, message: "Seller not found" });
    }
  );

  fastify.put(
    "/api/v1/sellers/update/:id",
    { preHandler: requirePermission(["sellers::update"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      const seller = await prisma.seller.update({
        where: { id },
        data: request.body as any,
      });
      reply.send({ success: true, seller });
    }
  );

  fastify.delete(
    "/api/v1/sellers/delete/:id",
    { preHandler: requirePermission(["sellers::delete"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      await prisma.seller.delete({ where: { id } });
      reply.send({ success: true, message: "Seller deleted" });
    }
  );

  // Stocks
  fastify.post(
    "/api/v1/stocks/create",
    { preHandler: requirePermission(["stocks::create"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const stock = await prisma.stock.create({
        data: request.body as any,
      });
      reply.send({ success: true, stock });
    }
  );

  fastify.get(
    "/api/v1/stocks/all",
    { preHandler: requirePermission(["stocks::read"]) },
    async (_, reply: FastifyReply) => {
      const stocks = await prisma.stock.findMany();
      reply.send({ success: true, stocks });
    }
  );

  fastify.get(
    "/api/v1/stocks/:id",
    { preHandler: requirePermission(["stocks::read"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      const stock = await prisma.stock.findUnique({ where: { id } });
      stock
        ? reply.send({ success: true, stock })
        : reply.status(404).send({ success: false, message: "Stock not found" });
    }
  );

  fastify.put(
    "/api/v1/stocks/update/:id",
    { preHandler: requirePermission(["stocks::update"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      const stock = await prisma.stock.update({
        where: { id },
        data: request.body as any,
      });
      reply.send({ success: true, stock });
    }
  );

  fastify.delete(
    "/api/v1/stocks/delete/:id",
    { preHandler: requirePermission(["stocks::delete"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      await prisma.stock.delete({ where: { id } });
      reply.send({ success: true, message: "Stock deleted" });
    }
  );

  fastify.post("/api/v1/purchases/create", { preHandler: requirePermission(["purchases::create"]) }, async (request: FastifyRequest, reply: FastifyReply) => {
    const purchase = await prisma.purchase.create({ data: request.body as any });
    reply.send({ success: true, purchase });
  });
  fastify.get("/api/v1/purchases/all", { preHandler: requirePermission(["purchases::read"]) }, async (_, reply: FastifyReply) => {
    const purchases = await prisma.purchase.findMany();
    reply.send({ success: true, purchases });
  });

  // Stock Movements
  fastify.post("/api/v1/movements/create", { preHandler: requirePermission(["movements::create"]) }, async (request: FastifyRequest, reply: FastifyReply) => {
    const movement = await prisma.stockMovement.create({ data: request.body as any });
    reply.send({ success: true, movement });
  });
  fastify.get("/api/v1/movements/all", { preHandler: requirePermission(["movements::read"]) }, async (_, reply: FastifyReply) => {
    const movements = await prisma.stockMovement.findMany();
    reply.send({ success: true, movements });
  });

  fastify.post("/api/v1/lab-stocks/allocate", { preHandler: requirePermission(["lab-stocks::allocate"]) }, async (request: FastifyRequest, reply: FastifyReply) => {
    const labStock = await prisma.labStock.create({ data: request.body as any });
    reply.send({ success: true, labStock });
  });
  fastify.get("/api/v1/lab-stocks/all", { preHandler: requirePermission(["lab-stocks::read"]) }, async (_, reply: FastifyReply) => {
    const labStocks = await prisma.labStock.findMany();
    reply.send({ success: true, labStocks });
  });

  // Vendors
  fastify.post("/api/v1/vendors/create", { preHandler: requirePermission(["vendors::create"]) }, async (request: FastifyRequest, reply: FastifyReply) => {
    const vendor = await prisma.vendor.create({ data: request.body as any });
    reply.send({ success: true, vendor });
  });
  fastify.get("/api/v1/vendors/all", { preHandler: requirePermission(["vendors::read"]) }, async (_, reply: FastifyReply) => {
    const vendors = await prisma.vendor.findMany();
    reply.send({ success: true, vendors });
  });

  // Stock Scraps
  fastify.post("/api/v1/stock-scraps/scrap", { preHandler: requirePermission(["stock-scraps::scrap"]) }, async (request: FastifyRequest, reply: FastifyReply) => {
    const stockScrap = await prisma.stockScrap.create({ data: request.body as any });
    reply.send({ success: true, stockScrap });
  });
  fastify.get("/api/v1/stock-scraps/all", { preHandler: requirePermission(["stock-scraps::read"]) }, async (_, reply: FastifyReply) => {
    const stockScraps = await prisma.stockScrap.findMany();
    reply.send({ success: true, stockScraps });
  });

  // Service Records
  fastify.post("/api/v1/service-records/create", { preHandler: requirePermission(["service-records::create"]) }, async (request: FastifyRequest, reply: FastifyReply) => {
    const serviceRecord = await prisma.serviceRecord.create({ data: request.body as any });
    reply.send({ success: true, serviceRecord });
  });
  fastify.get("/api/v1/service-records/all", { preHandler: requirePermission(["service-records::read"]) }, async (_, reply: FastifyReply) => {
    const serviceRecords = await prisma.serviceRecord.findMany();
    reply.send({ success: true, serviceRecords });
  });

  // Service Registers
  fastify.post("/api/v1/service-registers/register", { preHandler: requirePermission(["service-registers::register"]) }, async (request: FastifyRequest, reply: FastifyReply) => {
    const serviceRegister = await prisma.serviceRegister.create({ data: request.body as any });
    reply.send({ success: true, serviceRegister });
  });
  fastify.get("/api/v1/service-registers/all", { preHandler: requirePermission(["service-registers::read"]) }, async (_, reply: FastifyReply) => {
    const serviceRegisters = await prisma.serviceRegister.findMany();
    reply.send({ success: true, serviceRegisters });
  });
}
