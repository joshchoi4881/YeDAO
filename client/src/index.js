import React from "react";
import ReactDOM from "react-dom";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import App from "./App";
import "./styles/index.css";

const desiredChainId = ChainId.Rinkeby;

ReactDOM.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
