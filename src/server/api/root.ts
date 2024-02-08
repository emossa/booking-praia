import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";
import { roomTypesRouter } from "./routers/roomTypes";
import { propertyRouter } from "./routers/property";
import { authTokenRouter } from "./routers/authToken";
import { roomTypesAmenityRouter } from "./routers/roomTypesAmenity";
import { bookingRouter } from "./routers/booking";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  property: propertyRouter,
  roomTypes: roomTypesRouter,
  roomTypesAmenity: roomTypesAmenityRouter,
  booking: bookingRouter,
  authToken: authTokenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
