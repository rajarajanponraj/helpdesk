import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma";

export function inventoryRoutes(fastify: FastifyInstance) {

  // ✅ 1. Create a Seller
  fastify.post("/api/v1/sellers", async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, contact, email, address } = request.body as any;
    const seller = await prisma.seller.create({ data: { name, contact, email, address } });
    reply.send({ success: true, seller });
  });

  // ✅ 2. Get all Sellers
  fastify.get("/api/v1/sellers", async (_, reply) => {
    const sellers = await prisma.seller.findMany();
    reply.send({ success: true, sellers });
  });

  // ✅ 3. Get Seller by ID
  fastify.get("/api/v1/sellers/:id", async (request, reply) => {
    const { id } = request.params as any;
    const seller = await prisma.seller.findUnique({ where: { id } });
    reply.send({ success: true, seller });
  });

  // ✅ 4. Update Seller
  fastify.put("/api/v1/sellers/:id", async (request, reply) => {
    const { id } = request.params as any;
    const { name, contact, email, address } = request.body as any;
    const updatedSeller = await prisma.seller.update({ where: { id }, data: { name, contact, email, address } });
    reply.send({ success: true, seller: updatedSeller });
  });

  // ✅ 5. Delete Seller
  fastify.delete("/api/v1/sellers/:id", async (request, reply) => {
    const { id } = request.params as any;
    await prisma.seller.delete({ where: { id } });
    reply.send({ success: true, message: "Seller deleted" });
  });

  // ✅ 6. Create Stock
  fastify.post("/api/v1/stocks", async (request, reply) => {
    const { name, category, description, quantity, unitPrice, sellerId } = request.body as any;
    const stock = await prisma.stock.create({
      data: { name, category, description, quantity, unitPrice, sellerId },
    });
    reply.send({ success: true, stock });
  });

  // ✅ 7. Get all Stocks
  fastify.get("/api/v1/stocks", async (_, reply) => {
    const stocks = await prisma.stock.findMany();
    reply.send({ success: true, stocks });
  });

  // ✅ 8. Get Stock by ID
  fastify.get("/api/v1/stocks/:id", async (request, reply) => {
    const { id } = request.params as any;
    const stock = await prisma.stock.findUnique({ where: { id } });
    reply.send({ success: true, stock });
  });

  // ✅ 9. Update Stock
  fastify.put("/api/v1/stocks/:id", async (request, reply) => {
    const { id } = request.params as any;
    const { name, category, description, quantity, unitPrice, sellerId } = request.body as any;
    const updatedStock = await prisma.stock.update({
      where: { id },
      data: { name, category, description, quantity, unitPrice, sellerId },
    });
    reply.send({ success: true, stock: updatedStock });
  });

  // ✅ 10. Delete Stock
  fastify.delete("/api/v1/stocks/:id", async (request, reply) => {
    const { id } = request.params as any;
    await prisma.stock.delete({ where: { id } });
    reply.send({ success: true, message: "Stock deleted" });
  });

  // ✅ 11. Create Purchase
  fastify.post("/api/v1/purchases", async (request, reply) => {
    const { stockId, sellerId, quantity, price, proofType, proofFile } = request.body as any;
    const purchase = await prisma.purchase.create({
      data: { stockId, sellerId, quantity, price, proofType, proofFile },
    });
    reply.send({ success: true, purchase });
  });

  // ✅ 12. Get all Purchases
  fastify.get("/api/v1/purchases", async (_, reply) => {
    const purchases = await prisma.purchase.findMany();
    reply.send({ success: true, purchases });
  });

  // ✅ 13. Get Purchase by ID
  fastify.get("/api/v1/purchases/:id", async (request, reply) => {
    const { id } = request.params as any;
    const purchase = await prisma.purchase.findUnique({ where: { id } });
    reply.send({ success: true, purchase });
  });

  // ✅ 14. Create Stock Movement
  fastify.post("/api/v1/stock-movements", async (request, reply) => {
    const { stockId, fromLabId, toLabId, quantity } = request.body as any;
    const movement = await prisma.stockMovement.create({
      data: { stockId, fromLabId, toLabId, quantity },
    });
    reply.send({ success: true, movement });
  });

  // ✅ 15. Get all Stock Movements
  fastify.get("/api/v1/stock-movements", async (_, reply) => {
    const movements = await prisma.stockMovement.findMany();
    reply.send({ success: true, movements });
  });

  // ✅ 16. Scrap Stock
  fastify.post("/api/v1/stock-scraps", async (request, reply) => {
    const { stockId, labId, quantity, reason } = request.body as any;
    const scrap = await prisma.stockScrap.create({ data: { stockId, labId, quantity, reason } });
    reply.send({ success: true, scrap });
  });

  // ✅ 17. Get all Stock Scraps
  fastify.get("/api/v1/stock-scraps", async (_, reply) => {
    const scraps = await prisma.stockScrap.findMany();
    reply.send({ success: true, scraps });
  });

}
