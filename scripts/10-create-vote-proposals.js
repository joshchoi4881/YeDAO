import dotenv from "dotenv";
import { ethers } from "ethers";
import SDK from "./1-initialize-sdk.js";

dotenv.config();

const TOKEN = SDK.getToken(process.env.THIRDWEB_TOKEN_ADDRESS);
const VOTE = SDK.getVote(process.env.THIRDWEB_VOTE_ADDRESS);
const PUBLIC_KEY = process.env.PUBLIC_KEY;

const shortenAddress = (address) => {
  return (
    address.substring(0, 8) + "..." + address.substring(address.length - 3)
  );
};

(async () => {
  try {
    const amount = 1_000_000;
    const description =
      "Should the DAO mint an additional " +
      amount +
      " tokens into the treasury?";
    const execution = [
      {
        toAddress: TOKEN.getAddress(),
        nativeTokenValue: 0,
        transactionData: TOKEN.encoder.encode("mintTo", [
          VOTE.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];
    await VOTE.propose(description, execution);
    console.log("Success");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  try {
    const amount = 1_000;
    const description =
      "Should the DAO transfer " +
      amount +
      " tokens from the treasury to " +
      shortenAddress(PUBLIC_KEY) +
      " for being awesome?";
    const execution = [
      {
        toAddress: TOKEN.getAddress(),
        nativeTokenValue: 0,
        transactionData: TOKEN.encoder.encode("transfer", [
          PUBLIC_KEY,
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];
    await VOTE.propose(description, execution);
    console.log("Success");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
