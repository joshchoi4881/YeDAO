import dotenv from "dotenv";
import SDK from "./1-initialize-sdk.js";

dotenv.config();

const EDITION_DROP = SDK.getEditionDrop(
  process.env.THIRDWEB_EDITION_DROP_ADDRESS
);
const token = SDK.getToken(process.env.THIRDWEB_TOKEN_ADDRESS);

(async () => {
  try {
    const claimerAddresses = await EDITION_DROP.history.getAllClaimerAddresses(
      0
    );
    if (claimerAddresses.length === 0) {
      console.log("No claimer addresses");
      process.exit(0);
    }
    const airdropTargets = claimerAddresses.map((address) => {
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      const airdropTarget = {
        address,
        amount: randomAmount,
      };
      console.log("Airdropping", randomAmount, "tokens to", address);
      return airdropTarget;
    });
    console.log("Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("Successfully airdropped tokens");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
