import React from "react";
import Navbar from "./Navbar";

function OpenExistingWallet() {
  return (
    <div>
      <Navbar />
      <section id="viewOpenExistingWallet">
        <h1>Open an Existing Wallet</h1>
        <p>Enter your wallet private key (compressed ECDSA key, 65 hex digits):</p>
        <input
          type="text"
          id="textBoxPrivateKey"
          class="privateKey"
          value="838ff8634c41ba62467cc874ca156830ba55efe3e41ceeeeae5f3e77238f4eef"
        />
        <input type="button" id="buttonOpenExistingWallet" value="Open Wallet" />
        <textarea id="textareaOpenWalletResult" class="result" readonly="true"></textarea>
      </section>
      <section id="panelAccountInfo">
        <h1>Account Info</h1>
        <div>
          <span>Account address:</span>
          <input type="text" id="currentAccountAddress" readonly="readonly" />
        </div>
        <div>
          <span>Blockchain node:</span>
          <input type="text" id="currentNodeUrl" value="http://localhost:5001" />
        </div>
      </section>
    </div>
  );
}

export default OpenExistingWallet;
