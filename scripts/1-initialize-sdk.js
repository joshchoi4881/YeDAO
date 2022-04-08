import dotenv from "dotenv";
import ethers from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

dotenv.config();

const SDK = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(process.env.ALCHEMY_STAGING_HTTP)
  )
);

(async () => {
  try {
    const address = await SDK.getSigner().getAddress();
    console.log("Address:", address);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

export default SDK;
