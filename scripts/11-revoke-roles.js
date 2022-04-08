import dotenv from "dotenv";
import SDK from "./1-initialize-sdk.js";

dotenv.config();

const TOKEN = SDK.getToken(process.env.THIRDWEB_TOKEN_ADDRESS);

(async () => {
  try {
    console.log("Roles Before:", await TOKEN.roles.getAll());
    await TOKEN.roles.setAll({ admin: [], minter: [] });
    console.log("Roles After:", await TOKEN.roles.getAll());
    console.log("Success");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
