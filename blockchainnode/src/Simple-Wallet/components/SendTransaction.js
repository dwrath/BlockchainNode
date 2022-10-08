import React, { useState } from "react";
import Navbar from "./Navbar";
import { sendTransaction } from "../../api/index";
import elliptic from "elliptic";
import Hashes from "jshashes";
import CryptoJS from "crypto-js";

function SendTransaction() {
  let walletsJson = localStorage.getItem("wallets");
  let wallets = JSON.parse(walletsJson);
  let account = wallets.account;
  let pubKey = account.pubKey;
  let address = account.address;
  let privKey = account.privKey;

  let [recipient, setRecipient] = useState();
  let [from, setFrom] = useState();
  let [transaction, setTransaction] = useState();
  let [value, setValue] = useState();
  let [fee, setFee] = useState();
  let [data, setData] = useState();
  let [transactionHash, setTransactionHash] = useState();
  let [textarea, setTextArea] = useState(`notSigned`);

  const secp256k1 = new elliptic.ec("secp256k1");
  let fromHandler = (e) => {
    setFrom(e.target.value);
  };
  let recipientHandler = (e) => {
    setRecipient(e.target.value);
  };
  let valueHandler = (e) => {
    setValue(e.target.value);
  };
  let feeHandler = (e) => {
    setFee(e.target.value);
  };
  let dataHandler = (e) => {
    setData(e.target.value);
  };
  let signData = () => {
    let keyPair = secp256k1.keyFromPrivate(privKey);
    let signature = keyPair.sign(data);
    return [signature.r.toString(16), signature.s.toString(16)];
  };
  let signTransaction = () => {
    //let transactionJSON = JSON.stringify(transaction);
    transaction = {
      from: from,
      to: recipient,
      value: value,
      fee: fee,
      dateCreated: new Date().toISOString(),
      data: data,
      senderPubKey: pubKey,
    };
    setTransaction(transaction);
    transaction.transactionDataHash = new Hashes.SHA256().hex(transaction);
    transaction.senderSignature = signData(transaction.transactionDataHash, privKey);
  };
  let sendTran = () => {
    sendTransaction(transaction).then((res) => {
      setTransactionHash(res.data);
    });
  };
  return (
    <div>
      <Navbar />
      <section id="viewSendTransaction">
        <h1>Send Transaction</h1>
        <div>
          <span>From:</span>
          <input type="text" id="recipientAddress" className="address" onChange={fromHandler} />
        </div>
        <div>
          <span>Recipient:</span>
          <input type="text" id="recipientAddress" className="address" onChange={recipientHandler} />
        </div>
        <div>
          <span>Value:</span>
          <input type="number" id="transferValue" onChange={valueHandler} />
        </div>
        <div>
          <span>Fee:</span>
          <input type="number" id="miningFee" onChange={feeHandler} />
        </div>
        <div>
          <span>Data:</span>
          <input type="text" id="tranData" onChange={dataHandler} />
        </div>
        <input type="button" id="buttonSignTransaction" value="Sign Transaction" onClick={signTransaction} />
        <textarea
          id="textareaSignedTransaction"
          className="signedTransaction"
          value={JSON.stringify(transaction)}
          readOnly={true}
        ></textarea>

        <input type="button" id="buttonSendSignedTransaction" value="Send Transaction" onClick={sendTran} />
        <textarea id="textareaSendTransactionResult" className="result" readOnly={true}></textarea>
      </section>
    </div>
  );
}

export default SendTransaction;
