import dotenv from "dotenv";
import { MaxUint256 } from "@ethersproject/constants";
import SDK from "./1-initialize-sdk.js";

dotenv.config();

const EDITION_DROP = SDK.getEditionDrop(
  process.env.THIRDWEB_EDITION_DROP_ADDRESS
);

(async () => {
  try {
    const claimConditions = [
      {
        startTime: new Date(),
        maxQuantity: 100,
        quantityLimitPerTransaction: 1,
        price: 0,
        waitInSeconds: MaxUint256,
      },
    ];
    await EDITION_DROP.claimConditions.set("0", claimConditions);
    console.log("Success");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
