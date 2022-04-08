import dotenv from "dotenv";
import SDK from "./1-initialize-sdk.js";

dotenv.config();

const TOKEN = SDK.getToken(process.env.THIRDWEB_TOKEN_ADDRESS);
const VOTE = SDK.getVote(process.env.THIRDWEB_VOTE_ADDRESS);
const PUBLIC_KEY = process.env.PUBLIC_KEY;

(async () => {
  try {
    await TOKEN.roles.grant("minter", VOTE.getAddress());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  try {
    let balance = await TOKEN.balanceOf(PUBLIC_KEY);
    balance = balance.displayValue;
    balance = (Number(balance) / 100) * 90;
    await TOKEN.transfer(VOTE.getAddress(), balance);
    console.log("Success");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
