import { authConfig } from "./auth";
const isProduction = process.env.NODE_ENV === "production";
const serverPort = process.env.PORT || 5300;
export { serverPort, authConfig, isProduction };
