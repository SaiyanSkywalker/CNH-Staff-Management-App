import jwt from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, Response } from "express";
import UserInformation from "../models/UserInformation";

interface UserRequest extends Request {
  user?: any;
}
/**
 * Verfies JWT for any request made to server
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const verifyToken = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string | undefined = req.headers["authorization"];
  const token: string | undefined = authHeader && authHeader.split(" ")[1];
  if (!token) {
    // No token, user can't be authenticated
    return res.status(401).json({
      error: "Unauthorized",
      message: "No JWT token found; user could not be authenticated",
    });
  }
  jwt.verify(token, config.jwtSecretKey, (err: any, user: any) => {
    if (err) {
      // invalid token, user is unauthorized
      return res.status(403).json({
        error: "Forbidden",
        message: "JWT Token invalid; user could not be authorized",
      });
    } else {
      req.user = user;
      next(); // proceed to next middleware function
    }
  });
};


export const createAccessToken = (
  user: UserInformation,
  secret: string
): string => {
  return jwt.sign(user, secret, { expiresIn: "15m" });
};
export const createRefreshToken = (
  user: UserInformation,
  secret: string
): string => {
  return jwt.sign(user, secret, { expiresIn: "3d" });
};
