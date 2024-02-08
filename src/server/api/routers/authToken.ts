import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const authTokenRouter = createTRPCRouter({
  createAuthToken: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        type: z.enum(["api_key", "auth_token"]),
        token: z.string(),
        authTokenExpire: z.string(),
        authTokenExpireSeconds: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        userId,
        type,
        token,
        authTokenExpire: auth_token_expire,
        authTokenExpireSeconds: auth_token_expire_seconds,
      } = input;

      const authToken = await ctx.db.authToken.create({
        data: {
          type: type,
          token: token,
          auth_token_expire: new Date(auth_token_expire),
          auth_token_expire_seconds: auth_token_expire_seconds,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return authToken;
    }),

  getApiKey: protectedProcedure.query(({ ctx }) => {
    return ctx.db.authToken.findFirst({
      where: {
        type: "api_key",
      },
    });
  }),

  getAuthToken: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      const { userId } = input;
      return ctx.db.authToken.findUnique({
        where: {
          userId: userId,
          type: "auth_token",
          auth_token_expire: {
            gt: new Date(),
          },
        },
      });
    }),

  deleteAllUserToken: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      await ctx.db.authToken.deleteMany({
        where: {
          userId: userId,
        },
      });
    }),
});
