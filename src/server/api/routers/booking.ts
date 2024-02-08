import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAuthToken } from "@/server/utils";
import { UserRole } from "@prisma/client";

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

  // create booking on KrossBooking
  createKb: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        surname: z.string(),
        email: z.string(),
        phone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name, surname, email, phone } = input;

      const booking = await ctx.db.booking.update({
        where: {
          id: id,
        },
        data: {
          status: "paid",
          nome: name,
          cognome: surname,
          email: email,
          phone: phone,
        },
        include: {
          roomType: {
            include: {
              Property: true,
            },
          },
        },
      });

      if (
        !booking.nome ||
        !booking.cognome ||
        !booking.email ||
        !booking.phone
      ) {
        throw new Error("Guest data not found");
      }

      if (!booking.roomType?.Property?.id) {
        throw new Error("Property not found");
      }
      const propertyId = booking.roomType?.Property?.id;

      if (!booking.roomType) {
        throw new Error("RoomType not found");
      }
      const roomTypeId = booking.roomType.code;

      const guests =
        booking.chi_adulti + booking.chi_bambini + booking.chi_neonati;

      // Call KrossBooking API
      const merchant = await ctx.db.user.findFirst({
        where: {
          role: UserRole.MERCHANT,
          properties: {
            some: {
              id: propertyId,
            },
          },
        },
      });

      const arrival = booking.checkin.toISOString().split("T")[0];
      const departure = booking.checkout.toISOString().split("T")[0];

      if (!merchant) {
        throw new Error("Merchant not found");
      }

      const body = {
        id_property: booking.roomType.Property.propertyCode,
        arrival: arrival, // "2024-02-15",
        departure: departure, // "2024-02-20",
        label: `Praia dei Borghi - ${booking.nome} ${booking.cognome}`,
        cod_channel: "BE",
        email: booking.email,
        phone: booking.phone,
        rooms: [
          {
            id_room_type: roomTypeId,
            id_rate: 1,
            guests: guests,
            accommodation_total_amount: booking.price,
          },
        ],
      };

      console.log("@@body", body);

      const authToken = await getAuthToken(merchant?.id, ctx.db);
      const responseSaveReservation = await fetch(
        "https://api.krossbooking.com/v5/reservations/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!responseSaveReservation) {
        throw new Error("Error on KrossBooking API");
      }
      const jsonResponseSaveReservation =
        (await responseSaveReservation.json()) as {
          data: {
            id_reservation: string;
            cod_reservation: string;
            arrival: string;
            departure: string;
          };
          count: number;
          ruid: string;
        };
      console.log("@@jsonResponseSaveReservation", jsonResponseSaveReservation);
      return booking.id;
    }),
});
