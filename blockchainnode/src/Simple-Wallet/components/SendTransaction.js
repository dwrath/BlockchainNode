import React from "react";

function SendTransaction() {
  return (
    <div>
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
      ;
    </div>
  );
}

export default SendTransaction;
