import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const roomTypesAmenityRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        property: z.string().optional(),
        common: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const { property, common } = input;

      if (!property) {
        return [];
      }

      if (common) {
        //ti prendi tutte le stanze
        //ti prendi le amentises che hanno tutte le stanze di quella proprietà
        //ti prendi il numero di stanze di quella proprietà
        //ti prendi le amentises che hanno tutte le stanze di quella proprietà
        const commonAmenities = await ctx.db.$queryRaw`
          SELECT "amenityId"
          FROM public."RoomTypeAmenity"
          WHERE "roomTypeId" IN (
            SELECT "id"
            FROM public."RoomType"
            WHERE "propertyId" = ${property}
          )
          GROUP BY "amenityId"
          HAVING COUNT("roomTypeId") = (
            SELECT MAX("maxRoomTypeIdCount")
            FROM (
              SELECT COUNT("roomTypeId") as "maxRoomTypeIdCount"
              FROM public."RoomTypeAmenity"
              GROUP BY "amenityId"
            ) as subquery
          );`;

        return await ctx.db.amenity.findMany({
          where: {
            id: {
              in: (commonAmenities as { amenityId: number }[]).map(
                (a) => a.amenityId
              ),
            },
          },
        });
      }

      return await ctx.db.amenity.findMany({
        where: {
          RoomTypeAmenity: {
            some: {
              roomType: {
                propertyId: property,
              },
            },
          },
        },
      });
    }),
});
