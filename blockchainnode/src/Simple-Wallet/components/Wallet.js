import React from "react";

function Wallet() {
  let x = null;
  let y = null;
  return (
    <div>
      <header id="menu">
        <a href="#" id="linkHome">
          Home
        </a>
        <a href="#" id="linkCreateNewWallet">
          Create New Wallet
        </a>
        <a href="#" id="linkOpenExistingWallet">
          Open Existing Wallet
        </a>
        <a href="#" id="linkAccountBalance" class="after-login">
          Account Balance
        </a>
        <a href="#" id="linkSendTransaction" class="after-login">
          Send Transaction
        </a>
      </header>

      <main>
        <section id="viewHome">
          <h1>Simple Wallet </h1>
          Welcome to the simple wallet for the SenseChain blockchain network.
        </section>

        <section id="viewCreateNewWallet">
          <h1>Create a New Wallet</h1>
          <p>Generate a new wallet: random private key - public key - address.</p>
          <input type="button" id="buttonGenerateNewWallet" value="Generate Now" />
          <textarea id="textareaCreateWalletResult" class="result" readonly="true"></textarea>
        </section>

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

        <section id="viewAccountBalance">
          <h1>View Account Balance</h1>
          Address:{" "}
          <input
            type="text"
            id="textBoxAccountAddress"
            class="address"
            value="f3a1e69b6176052fcc4a3248f1c5a91dea308ca9"
          />
          <input type="button" id="buttonDisplayBalance" value="Display Balance" />
          <textarea id="textareaAccountBalanceResult" class="result" readonly="true"></textarea>
        </section>

        <section id="viewSendTransaction">
          <h1>Send Transaction</h1>
          <div>
            <span>Recipient:</span>
            <input type="text" id="recipientAddress" class="address" value="a1de0763f26176c6d68cc77e0a1c2c42045f2314" />
          </div>
          <div>
            <span>Value:</span>
            <input type="number" id="transferValue" value="5000" />
          </div>
          <div>
            <span>Fee:</span>
            <input type="number" id="miningFee" value="20" />
          </div>
          <div>
            <span>Data:</span>
            <input type="text" id="tranData" value="Transaction from the simple JS wallet" />
          </div>
          <input type="button" id="buttonSignTransaction" value="Sign Transaction" />
          <textarea id="textareaSignedTransaction" class="signedTransaction" readonly="true"></textarea>

          <input type="button" id="buttonSendSignedTransaction" value="Send Transaction" />
          <textarea id="textareaSendTransactionResult" class="result" readonly="true"></textarea>
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
      </main>
    </div>
  );
}

export default Wallet;
