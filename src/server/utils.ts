import { type PrismaClient } from "@prisma/client";

export const getAuthToken = async (userId: string, db: PrismaClient) => {
  try {
    const authToken = await db.authToken.findUnique({
      where: {
        userId: userId,
        type: "auth_token",
        auth_token_expire: {
          gt: new Date(),
        },
      },
    });

    const apiKey = await db.authToken.findFirst({
      where: {
        type: "api_key",
      },
    });

    const userData = await db.user.findUnique({
      where: { id: userId },
    });

    if (!authToken) {
      if (!userId || userId === "") {
        throw new Error("User ID not found");
      }

      // delete all tokens for the user
      await db.authToken.deleteMany({
        where: {
          userId: userId,
        },
      });

      if (!apiKey) {
        throw new Error("API Key not found");
      }

      if (!userData) {
        throw new Error("User data not found");
      }

      // fetch new token
      const response = await fetch(
        "https://api.krossbooking.com/v5/auth/get-token",
        {
          method: "POST",
          body: JSON.stringify({
            api_key: apiKey.token,
            hotel_id: userData.hotelId,
            username: userData.apiUsr,
            password: userData.apiPsw,
          }),
        }
      );

      const json = (await response.json()) as {
        token: string;
        auth_token_expire: string;
        auth_token_expire_seconds?: number;
      };

      if (!json.token || !json.auth_token_expire) {
        throw new Error("Error in getting token");
      }

      const newAuthToken = db.authToken.create({
        data: {
          type: "auth_token",
          token: json.token,
          auth_token_expire: new Date(json.auth_token_expire),
          auth_token_expire_seconds: json.auth_token_expire_seconds ?? 0,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return newAuthToken;
    }
    return authToken;
  } catch (error) {
    console.error("Error in getAuthToken:", error);
    throw error; // Rethrow the error to handle it where the function is called
  }
};
