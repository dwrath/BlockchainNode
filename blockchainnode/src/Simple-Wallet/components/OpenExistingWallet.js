import React, { useState } from "react";

import Navbar from "./Navbar";

function OpenExistingWallet() {
  let walletsJson = localStorage.getItem("wallets");
  let wallets = JSON.parse(walletsJson);

  let [userWallet, setUserWallet] = useState("");
  let [userPrivKey, setUserPrivKey] = useState();
  let handleChange = (e) => {
    setUserPrivKey(e.target.value);
  };
  let handleSubmit = (e) => {
    if (userPrivKey === wallets.user) {
      setUserWallet(wallets.account);
    }
  };
  return (
    <div>
      <Navbar />
      <section id="viewOpenExistingWallet">
        <h1>Open an Existing Wallet</h1>
        <p>Enter your wallet private key (compressed ECDSA key, 65 hex digits):</p>
        <form onSubmit={handleSubmit}>
          <input type="text" id="textBoxPrivateKey" className="privateKey" onChange={handleChange} />
          <input type="submit" value="Generate Now" />
        </form>
        <ul>
          <li>Private Key: {userWallet.privKey}</li>
          <li>Public Key: {userWallet.pubKey}</li>
          <li>Address: {userWallet.address}</li>
        </ul>
      </section>
    </div>
  );
}

export default OpenExistingWallet;
