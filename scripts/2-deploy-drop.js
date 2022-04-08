import { readFileSync } from "fs";
import SDK from "./1-initialize-sdk.js";

(async () => {
  try {
    const editionDropAddress = await SDK.deployer.deployEditionDrop({
      name: "YeDAO Membership",
      description: "the DAO for Kanye West memes",
      image: readFileSync("assets/kanye.jpeg"),
      primary_sale_recipient: await SDK.getSigner().getAddress(),
    });
    const editionDrop = SDK.getEditionDrop(editionDropAddress);
    const editionDropMetadata = await editionDrop.metadata.get();
    console.log("Edition Drop Address:", editionDropAddress);
    console.log("Edition Drop Metadata:", editionDropMetadata);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
