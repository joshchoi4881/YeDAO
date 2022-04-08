import dotenv from "dotenv";
import { readFileSync } from "fs";
import SDK from "./1-initialize-sdk.js";

dotenv.config();

const EDITION_DROP = SDK.getEditionDrop(
  process.env.THIRDWEB_EDITION_DROP_ADDRESS
);

(async () => {
  try {
    await EDITION_DROP.createBatch([
      {
        name: "Pink Polo",
        description: "this NFT will give you access to YeDAO",
        image: readFileSync("assets/pinkPolo.png"),
      },
    ]);
    console.log("Success");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
