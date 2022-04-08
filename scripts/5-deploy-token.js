import SDK from "./1-initialize-sdk.js";

(async () => {
  try {
    const tokenAddress = await SDK.deployer.deployToken({
      name: "YeDAO Governance Token",
      symbol: "YE",
      primary_sale_recipient: await SDK.getSigner().getAddress(),
    });
    console.log("Token Address:", tokenAddress);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
