import React, { useState } from "react";
import Navbar from "./Navbar";
import elliptic from "elliptic";
import Hashes from "jshashes";
import CryptoJS from "crypto-js";

let wallets = {};

const CreateWallet = () => {
  const secp256k1 = new elliptic.ec("secp256k1");
  let [keyPair, setKeyPair] = useState();
  let [pubKey, setPubKey] = useState();
  let [address, setAddress] = useState();
  let [privKey, setPrivKey] = useState();
  let confirmed, pending, total;

  wallets = {
    user: privKey,
    account: {
      privKey,
      pubKey,
      address,
      balance: {
        total: 0,
        confirmed: 0,
        pending: 0,
      },
    },
  };
  localStorage.setItem("wallets", JSON.stringify(wallets));

  let getAddress = (pubKey) => {
    let ripemd160 = new Hashes.RMD160();
    address = ripemd160.hex(pubKey);
    setAddress(address);
  };
  let getPubKey = (keyPair) => {
    keyPair = secp256k1.keyFromPrivate(privKey);
    pubKey = keyPair.getPublic().getX().toString(16) + (keyPair.getPublic().getY().isOdd() ? "1" : "0");
    setPubKey(pubKey);
  };
  let getPrivateKey = (keyPair) => {
    privKey = keyPair.getPrivate().toString(16);
    setPrivKey(privKey);
  };

  const generateNewWallet = () => {
    let keyPair = secp256k1.genKeyPair();
    setKeyPair(keyPair);
    getPrivateKey(keyPair);
    getPubKey(keyPair);

    getAddress(pubKey);
    wallets[privKey] = { privKey, pubKey, address };
  };

  return (
    <div>
      <Navbar />
      <section id="viewCreateNewWallet">
        <h1>Create a New Wallet</h1>
        <p>Generate a new wallet: random private key - public key - address.</p>
        <input type="button" onClick={generateNewWallet} id="buttonGenerateNewWallet" value="Generate Now" />

        <ul>
          <li>Private Key: {privKey}</li>
          <li>Public Key: {pubKey}</li>
          <li>Address: {address}</li>
        </ul>
      </section>
    </div>
  );
};
export { wallets };
export default CreateWallet;
