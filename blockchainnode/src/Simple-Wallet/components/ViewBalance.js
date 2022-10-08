import React, { useState } from "react";
import Navbar from "./Navbar";

import { getAccountBalance } from "../../api/index";

function ViewBalance() {
  let walletsJson = localStorage.getItem("wallets");
  let wallets = JSON.parse(walletsJson);
  let account = wallets.account;
  let address = account.address;
  let accountBalance = {};

  let [balance, setBalance] = useState("");

  let handleSubmit = (e) => {
    if (e.target[0].value === address) {
      getAccountBalance(address).then((res) => {
        setBalance(res.data);
      });

      setBalance(accountBalance);
    }
  };
  return (
    <div>
      <Navbar />
      <section id="viewAccountBalance">
        <h1>View Account Balance</h1>
        <form onSubmit={handleSubmit}>
          Address: <input type="text" id="textBoxAccountAddress" className="address" />
          <input type="submit" id="buttonDisplayBalance" value="Display Balance" />
        </form>
      </section>
      <ul>
        <li>Total: {balance.total}</li>
        <li>confirmed: {balance.confirmedBalance}</li>
        <li>Pending: {balance.pendingBalance}</li>
      </ul>
    </div>
  );
}

export default ViewBalance;
