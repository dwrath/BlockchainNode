import React, { useState } from "react";
import Navbar from "../Simple-Wallet/components/Navbar";
import { sendTransaction } from "../api/index";
import elliptic from "elliptic";
import Hashes from "jshashes";

function Faucet() {
  let [transactionHash, setTransactionHash] = useState();
  let [transaction, setTransaction] = useState();
  let [disable, setDisable] = useState(false);
  let privKey = "d7fb7c01100eb000dbd9e68f901b4652d9466f1dffd799af4d3922cfc85e4f9e";
  let address = "beb99601c2240f9b11cce6b1ef75991fd28c6b53";
  let value = 50;
  let fee = 10;
  let data = "Faucet Transaction";
  let pubKey = "e5277654e9b06fe4ee273b0907e32b5bdf4f07be404e4a8846c63e24ac7457441";
  let [userAddress, setUserAddress] = useState();
  const secp256k1 = new elliptic.ec("secp256k1");

  const setAddress = (e) => {
    setUserAddress(e.target.value);
  };
  let signData = () => {
    let keyPair = secp256k1.keyFromPrivate(privKey);
    let signature = keyPair.sign(data);
    return [signature.r.toString(16), signature.s.toString(16)];
  };
  let signTransaction = () => {
    //let transactionJSON = JSON.stringify(transaction);
    transaction = {
      from: address,
      to: userAddress,
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

  let sendFaucetTran = () => {
    signTransaction();
    sendTransaction(transaction).then((res) => {
      setTransactionHash(res.data.transactionDataHash);
    });
    toggle();
  };
  let toggle = () => {
    setDisable(true);
    setTimeout(() => setDisable(false), 30000);
  };
  return (
    <div>
      <Navbar />
      <div className="faucet">
        <form className="faucet-form">
          <p> Your Blockchain address: </p>
          <input onChange={setAddress}></input>
          <input type="button" disabled={disable} onClick={sendFaucetTran} value="Send"></input>
        </form>
        <p>Your transaction hash is: {transactionHash}</p>
      </div>
    </div>
  );
}

export default Faucet;
