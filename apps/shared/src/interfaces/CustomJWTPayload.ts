/**
 * File: CustomJWTPayload.ts
 * Purpose: define shape of data for JWT payloads used in project
 * Attaches user info to JWT token
 */
import { JwtPayload } from "jwt-decode";
import UserInformationAttributes from "./UserInformationAttributes";

export default interface CustomJWTPayload extends JwtPayload {
  user?: UserInformationAttributes;
}
