import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const bookingRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        roomTypeId: z.number(),
        userIdentifier: z.string(),
        checkin: z.date(),
        checkout: z.date(),
        chi_adulti: z.number(),
        chi_bambini: z.number(),
        chi_neonati: z.number(),
        chi_pets: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const nights = Math.floor(
        (input.checkout.getTime() - input.checkin.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      console.log(nights, input.checkout.getTime(), input.checkin.getTime());
      if (nights <= 0) {
        throw new Error("Invalid dates");
      }
      const roomType = await ctx.db.roomType.findUnique({
        where: {
          id: input.roomTypeId,
        },
      });
      if (!roomType) {
        throw new Error("Room type not found");
      }
      const priceAvailability =
        await ctx.db.roomTypePricesAvailability.findFirst({
          where: {
            roomTypeId: input.roomTypeId,
            dateFrom: {
              lte: input.checkin,
            },
            dateTo: {
              gte: input.checkout,
            },
          },
        });
      console.log(priceAvailability);
      if (!priceAvailability?.price) {
        throw new Error("Room type not available");
      }

      return ctx.db.booking.create({
        data: {
          ...input,
          price: priceAvailability.price * nights,
        },
      });
    }),
  get: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    return ctx.db.booking.findUnique({
      where: {
        id: input,
      },
      include: {
        roomType: {
          include: {
            Property: true,
          },
        },
      },
    });
  }),
});
