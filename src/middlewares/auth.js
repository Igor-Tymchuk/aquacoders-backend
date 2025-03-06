import createHttpError from "http-errors";
import { Session } from "../db/models/session.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw createHttpError(401, "Unauthorized");

    const session = await Session.findOne({ accessToken: token });
    if (!session || session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, "Session expired or invalid");
    }

    req.user = { id: session.userId };
    next();
  } catch (error) {
    next(error);
  }
};
