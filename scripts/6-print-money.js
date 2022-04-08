import dotenv from "dotenv";
import SDK from "./1-initialize-sdk.js";

dotenv.config();

const TOKEN = SDK.getToken(process.env.THIRDWEB_TOKEN_ADDRESS);

(async () => {
  try {
    const amount = 1_000_000;
    await TOKEN.mint(amount);
    const totalSupply = await TOKEN.totalSupply();
    console.log("Total Supply:", totalSupply);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
