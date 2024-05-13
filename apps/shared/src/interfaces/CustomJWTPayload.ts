import { JwtPayload } from "jwt-decode";
import UserInformationAttributes from "./UserInformationAttributes";

export default interface CustomJWTPayload extends JwtPayload {
  user?: UserInformationAttributes;
}
