import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user, password } = req.body as {
    user: string;
    password: string;
  };

  res.status(200).json({ user: user, password: password });
}
