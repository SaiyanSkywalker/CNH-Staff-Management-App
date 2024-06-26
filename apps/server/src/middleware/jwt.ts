/**
 * File: jwt.ts
 * Purpose: contains functions that handle operations involving JWT tokens
 */
import jwt from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, Response } from "express";
import UserInformation from "../models/UserInformation";
import UserInformationAttributes from "@shared/src/interfaces/UserInformationAttributes";

interface UserRequest extends Request {
  user?: any; // contains info about user (usually of type UserInformationAttributes)
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
  // Attempy to verfiy token
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

/**
 * Encrypts user info as a JWT token
 * @param user user information
 * @param secret jwt secret
 * @param lifetime how long token will last
 * @returns
 */
export const createToken = (
  user: UserInformationAttributes,
  secret: string,
  lifetime: string
): string => {
  return jwt.sign({ user: user }, secret, { expiresIn: lifetime });
};
