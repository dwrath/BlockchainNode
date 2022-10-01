import React, { useState } from "react";
import Navbar from "./Navbar";
import elliptic from "elliptic";
import { ripemd160 } from "@noble/hashes/ripemd160";

function CreateWallet() {
  const secp256k1 = new elliptic.ec("secp256k1");
  let [keyPair, setKeyPair] = useState();
  let [pubKey, setPubKey] = useState();
  let [address, setAddress] = useState();
  let [privKey, setPrivKey] = useState();

  let getAddress = (pubKey) => {
    address = ripemd160(pubKey);
    setAddress(address);
  };
  let getPubKey = (keyPair) => {
    pubKey = keyPair.getPublic().getX().toString(16)(keyPair.getPublic().getY().isOdd() ? "1" : "0");
    setPubKey(pubKey);
  };
  let getPrivateKey = (keyPair) => {
    privKey = keyPair.getPrivate().toString(16);
    setPrivKey(privKey);
  };

  const generateNewWallet = () => {
    let keyPair = secp256k1.genKeyPair();
    setKeyPair(keyPair);
    getPubKey(keyPair);
    getPrivateKey(keyPair);
    getAddress(pubKey);
  };
  return (
    <div>
      <Navbar />
      <section id="viewCreateNewWallet">
        <h1>Create a New Wallet</h1>
        <p>Generate a new wallet: random private key - public key - address.</p>
        <input type="button" onClick={generateNewWallet} id="buttonGenerateNewWallet" value="Generate Now" />
        <textarea id="textareaCreateWalletResult" className="result" readOnly={true}>
          {privKey}
        </textarea>
      </section>
    </div>
  );
}

export default CreateWallet;
