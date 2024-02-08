import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getUserFromCtx: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),

  getUserFromId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.db.user.findUnique({
        where: { id: id },
      });
      return user;
    }),

  updateStripe: protectedProcedure
    .input(
      z.object({
        stripePk: z.string(),
        stripeSk: z.string(),
        stripeTestMode: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { stripePk, stripeSk, stripeTestMode } = input;

      try {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            stripePk,
            stripeSk,
            stripeTestMode,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Errore in fase di creazione del ticket",
        });
      }
    }),

  updateKrossBooking: protectedProcedure
    .input(
      z.object({
        apiUsr: z.string(),
        apiPsw: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { apiUsr, apiPsw } = input;

      try {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            apiUsr,
            apiPsw,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Errore in fase di creazione del ticket",
        });
      }
    }),
});
