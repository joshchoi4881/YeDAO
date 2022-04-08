import dotenv from "dotenv";
import SDK from "./1-initialize-sdk.js";

dotenv.config();

const TOKEN = SDK.getToken(process.env.THIRDWEB_TOKEN_ADDRESS);

(async () => {
  try {
    const voteAddress = await SDK.deployer.deployVote({
      name: "YeDAO's Proposals",
      voting_token_address: TOKEN.getAddress(),
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: 6570,
      voting_quorum_fraction: 0,
      proposal_token_threshold: 0,
    });
    console.log("Vote Address:", voteAddress);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
