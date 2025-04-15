import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { requirePermission } from "../lib/roles";
import { Prisma } from "@prisma/client";

export async function inventoryRoutes(fastify: FastifyInstance) {
  // Sellers
  fastify.post(
    "/api/v1/sellers/create",
    { preHandler: requirePermission(["sellers::create"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { name, contact, email, address } = request.body as any;
  
        if (!name) {
          return reply.status(400).send({ success: false, message: "Name is required" });
        }
  
        const seller = await prisma.seller.create({
          data: { name, contact, email, address },
          select: { id: true, name: true, contact: true, email: true, address: true }, // ✅ Fixed Selection
        });
  
        reply.send({ success: true, seller });
      } catch (error) {
        reply.status(500).send({ success: false, message: "Error creating seller", error });
      }
    }
  );
  
  fastify.get(
    "/api/v1/sellers/all",
    { preHandler: requirePermission(["sellers::read"]) },
    async (_, reply: FastifyReply) => {
      try {
        const sellers = await prisma.seller.findMany({
          select: { id: true, name: true, contact: true, email: true, address: true }, // ✅ Fixed Selection
        });
        reply.send({ success: true, sellers });
      } catch (error) {
        reply.status(500).send({ success: false, message: "Error fetching sellers", error });
      }
    }
  );
  
  fastify.get(
    "/api/v1/sellers/:id",
    { preHandler: requirePermission(["sellers::read"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id }: any = request.params;
  
        const seller = await prisma.seller.findUnique({
          where: { id },
          select: { id: true, name: true, contact: true, email: true, address: true }, // ✅ Fixed Selection
        });
  
        if (!seller) {
          return reply.status(404).send({ success: false, message: "Seller not found" });
        }
  
        reply.send({ success: true, seller });
      } catch (error) {
        reply.status(500).send({ success: false, message: "Error fetching seller", error });
      }
    }
  );
  
  fastify.put(
    "/api/v1/sellers/update/:id",
    { preHandler: requirePermission(["sellers::update"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id }: any = request.params;
        const { name, contact, email, address } = request.body as any;
  
        const seller = await prisma.seller.update({
          where: { id },
          data: { name, contact, email, address },
          select: { id: true, name: true, contact: true, email: true, address: true }, // ✅ Fixed Selection
        });
  
        reply.send({ success: true, seller });
      } catch (error) {
        reply.status(500).send({ success: false, message: "Error updating seller", error });
      }
    }
  );
  
  fastify.delete(
    "/api/v1/sellers/delete/:id",
    { preHandler: requirePermission(["sellers::delete"]) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id }: any = request.params;
  
        await prisma.seller.delete({ where: { id } });
  
        reply.send({ success: true, message: "Seller deleted successfully" });
      } catch (error) {
        reply.status(500).send({ success: false, message: "Error deleting seller", error });
      }
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


  fastify.post("/api/v1/departments/create", async (request, reply) => {
    try {
      const { name } = request.body as { name: string };
      const department = await prisma.department.create({
        data: { name },
      });
      reply.send({ success: true, department });
    } catch (error) {
      reply.status(500).send({ success: false, message: "Error creating department", error });
    }
  });

  // Get all Departments
  fastify.get("/api/v1/departments", async (_, reply) => {
    const departments = await prisma.department.findMany({
      include: { labs: true },
    });
    reply.send({ success: true, departments });
  });

  // Create Lab
  fastify.post("/api/v1/labs/create", async (request, reply) => {
    try {
      const { name, location, departmentId } = request.body as {
        name: string;
        location?: string;
        departmentId: string;
      };

      const lab = await prisma.lab.create({
        data: {
          name,
          location,
          departmentId,
        },
      });
      reply.send({ success: true, lab });
    } catch (error) {
      reply.status(500).send({ success: false, message: "Error creating lab", error });
    }
  });

  // Get all Labs
  fastify.get("/api/v1/labs", async (_, reply) => {
    const labs = await prisma.lab.findMany({
      include: { department: true },
    });
    reply.send({ success: true, labs });
  });

  // Get Labs by Department
  fastify.get("/api/v1/departments/:id/labs", async (request, reply) => {
    const { id } = request.params as { id: string };
    const labs = await prisma.lab.findMany({
      where: { departmentId: id },
    });
    reply.send({ success: true, labs });
  });

  // Update Lab
  fastify.put("/api/v1/labs/update/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, location } = request.body as { name?: string; location?: string };

    const updatedLab = await prisma.lab.update({
      where: { id },
      data: { name, location },
    });
    reply.send({ success: true, lab: updatedLab });
  });

  // Delete Lab
  fastify.delete("/api/v1/labs/delete/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.lab.delete({ where: { id } });
    reply.send({ success: true, message: "Lab deleted" });
  });

  fastify.post(
    "/api/v1/purchases/create",
    { preHandler: requirePermission(["purchases::create"]) },
    async (request, reply) => {
      try {
        const { stockId, quantity, price, sellerId, proofType,proofFile } = request.body as {
          stockId: string;
          quantity: number;
          price: number;
          sellerId: string;
          proofType: string;
          proofFile :string | null;
        };
    
        const purchase = await prisma.purchase.create({
          data: {
            stockId,
            quantity,
            price,
            sellerId,
            proofType,
            proofFile, // will be added later during edit
          },
        });
        reply.send({ success: true, purchase });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // 📌 Get all Purchases   
  fastify.get(
    "/api/v1/purchases/all",
    { preHandler: requirePermission(["purchases::read"]) },
    async (_, reply: FastifyReply) => {
      try {
        const purchases = await prisma.purchase.findMany({
          include: {
            stock: true,
            seller: true,
          },
        });
        reply.send({ success: true, purchases });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // 📌 Get a Specific Purchase by ID
  fastify.get(
    "/api/v1/purchases/:id",
    { preHandler: requirePermission(["purchases::read"]) },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const purchase = await prisma.purchase.findUnique({
          where: { id: request.params.id },
          include: {
            stock: true,
            seller: true,
          },
        });

        if (!purchase) {
          return reply.status(404).send({ success: false, message: "Purchase not found" });
        }

        reply.send({ success: true, purchase });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // 📌 Update a Purchase
  fastify.put(
    "/api/v1/purchases/update/:id",
    { preHandler: requirePermission(["purchases::update"]) },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: Prisma.PurchaseUpdateInput }>,
      reply: FastifyReply
    ) => {
      try {
        const updatedPurchase = await prisma.purchase.update({
          where: { id: request.params.id },
          data: request.body,
        });

        reply.send({ success: true, purchase: updatedPurchase });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // 📌 Delete a Purchase
  fastify.delete(
    "/api/v1/purchases/delete/:id",
    { preHandler: requirePermission(["purchases::delete"]) },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        await prisma.purchase.delete({ where: { id: request.params.id } });
        reply.send({ success: true, message: "Purchase deleted successfully" });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // Stock Movements
  fastify.post("/api/v1/movements/create", { preHandler: requirePermission(["movements::create"]) }, async (request: FastifyRequest, reply: FastifyReply) => {
    const movement = await prisma.stockMovement.create({ data: request.body as any });
    reply.send({ success: true, movement });
  });
  fastify.get("/api/v1/movements/all", { preHandler: requirePermission(["movements::read"]) }, async (_, reply: FastifyReply) => {
    const movements = await prisma.stockMovement.findMany();
    reply.send({ success: true, movements });
  });

  fastify.get(
    "/api/v1/lab-stocks/all",
    { preHandler: requirePermission(["lab-stocks::read"]) },
    async (_, reply: FastifyReply) => {
      try {
        const labStocks = await prisma.labStock.findMany({
          include: {
            stock: true,
            lab: true,
            serviceEntries: true,
          },
        });
        reply.send({ success: true, labStocks });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // Get a single LabStock by ID
  fastify.get(
    "/api/v1/lab-stocks/:id",
    { preHandler: requirePermission(["lab-stocks::read"]) },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const labStock = await prisma.labStock.findUnique({
          where: { id },
          include: {
            stock: true,
            lab: true,
            serviceEntries: true,
          },
        });
        if (!labStock) {
          return reply.status(404).send({ success: false, message: "LabStock not found" });
        }
        reply.send({ success: true, labStock });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // Create a new LabStock
  fastify.post(
    "/api/v1/lab-stocks/create",
    { preHandler: requirePermission(["lab-stocks::create"]) },
    async (request: FastifyRequest<{ Body: { stockId: string; labId: string; quantity: number; serialNumber?: string; condition: string } }>, reply: FastifyReply) => {
      try {
        const { stockId, labId, quantity, serialNumber, condition } = request.body;
        const newLabStock = await prisma.labStock.create({
          data: {
            stockId,
            labId,
            quantity,
            serialNumber,
            condition,
          },
        });
        reply.status(201).send({ success: true, labStock: newLabStock });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // Update an existing LabStock
  fastify.put(
    "/api/v1/lab-stocks/:id",
    { preHandler: requirePermission(["lab-stocks::update"]) },
    async (request: FastifyRequest<{ Params: { id: string }; Body: { quantity?: number; serialNumber?: string; condition?: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const { quantity, serialNumber, condition } = request.body;
        const updatedLabStock = await prisma.labStock.update({
          where: { id },
          data: {
            quantity,
            serialNumber,
            condition,
          },
        });
        reply.send({ success: true, labStock: updatedLabStock });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // Delete a LabStock
  fastify.delete(
    "/api/v1/lab-stocks/:id",
    { preHandler: requirePermission(["lab-stocks::delete"]) },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        await prisma.labStock.delete({
          where: { id },
        });
        reply.send({ success: true, message: "LabStock deleted successfully" });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // Vendors
  fastify.post(
    "/api/v1/vendors/create",
    { preHandler: requirePermission(["vendors::create"]) },
    async (request: FastifyRequest<{ Body: Prisma.VendorUncheckedCreateInput }>, reply: FastifyReply) => {
      try {
        const { name, contact, address,  serviceRecords } = request.body;

        if (!name) {
          return reply.status(400).send({ success: false, message: "Vendor name is required." });
        }

        const vendor = await prisma.vendor.create({
          data: {
            name,
            contact,
            address,
           
            serviceRecords: serviceRecords
              ? {
                  create: (serviceRecords as any).map((record: any) => ({
                    ...record,
                  })),
                }
              : undefined,
          },
        });

        reply.send({ success: true, vendor });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );

  // Get All Vendors
  fastify.get(
    "/api/v1/vendors/all",
    { preHandler: requirePermission(["vendors::read"]) },
    async (_, reply: FastifyReply) => {
      
        const vendors = await prisma.vendor.findMany({
          include: {
            serviceRecords: true,
          },
        });
        reply.send({ success: true, vendors });
    
    }
  );

  // Get Single Vendor by ID
  fastify.get(
    "/api/v1/vendors/:id",
    { preHandler: requirePermission(["vendors::read"]) },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
     
        const vendor = await prisma.vendor.findUnique({
          where: { id: request.params.id },
          include: {
             
            serviceRecords: true,
          },
        });
        if (!vendor) {
          return reply.status(404).send({ success: false, message: "Vendor not found" });
        }
        reply.send({ success: true, vendor });
     
    }
  );

  // Update Vendor
  fastify.put(
    "/api/v1/vendors/update/:id",
    { preHandler: requirePermission(["vendors::update"]) },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: Prisma.VendorUpdateInput }>,
      reply: FastifyReply
    ) => {
      try {
        const updatedVendor = await prisma.vendor.update({
          where: { id: request.params.id },
          data: request.body, // Typed correctly as Prisma.VendorUpdateInput
        });
  
        reply.send({ success: true, vendor: updatedVendor });
      } catch (error) {
        reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );
  

  // Delete Vendor
  fastify.delete(
    "/api/v1/vendors/delete/:id",
    { preHandler: requirePermission(["vendors::delete"]) },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      
        await prisma.vendor.delete({
          where: { id: request.params.id },
        });
        reply.send({ success: true, message: "Vendor deleted successfully" });
      
    }
  );

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
