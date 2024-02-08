import { z } from "zod";
import {
  createTRPCRouter,
  protectedMerchantProcedure,
  publicProcedure,
} from "../trpc";
import { type PrismaClient } from "@prisma/client";

const getProperty = async (propertyId: string, prisma: PrismaClient) => {
  console.log("propertyId", propertyId);
  return await prisma.property.findFirstOrThrow({
    where: {
      id: propertyId,
    },
    include: {
      type: true,
    },
  });
};
export const propertyRouter = createTRPCRouter({
  create: protectedMerchantProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.number(),
        address: z.string(),
        city: z.string(),
        codCountry: z.string(),
        postCode: z.string(),
        area: z.string(),
        phone: z.string(),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.property.create({
        data: {
          name: input.name,
          type: {
            connect: { id: input.type },
          },
          address: input.address,
          city: input.city,
          codCountry: input.codCountry,
          postCode: input.postCode,
          area: input.area,
          phone: input.phone,
          email: input.email,
          merchant: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),
  edit: protectedMerchantProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        address: z.string(),
        city: z.string(),
        codCountry: z.string(),
        postCode: z.string(),
        area: z.string(),
        phone: z.string(),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await getProperty(input.id, ctx.db);
      return ctx.db.property.update({
        where: { id: input.id },
        data: {
          name: input.name,
          address: input.address,
          city: input.city,
          codCountry: input.codCountry,
          postCode: input.postCode,
          area: input.area,
          phone: input.phone,
          email: input.email,
        },
      });
    }),
  list: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    return ctx.db.property.findMany({});
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return getProperty(input.id, ctx.db);
    }),
});
