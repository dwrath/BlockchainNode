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
  let [userAddress, setUserAddres] = useState();
  let handleChange = (e) => {
    setUserAddres(e.target.value);
  };
  let handleSubmit = () => {
    if (userAddress === address) {
      getAccountBalance(address).then((res) => {
        setBalance(res.data);
      });

      setBalance(accountBalance);
    }
  };
  return (
    <div>
      <Navbar />
      <section className="viewAccountBalance">
        <h1>View Account Balance</h1>
        <form>
          Address: <input type="text" id="textBoxAccountAddress" className="address" onChange={handleChange} />
          <input type="button" id="buttonDisplayBalance" value="Display Balance" onClick={handleSubmit} />
        </form>
      </section>
      <ul className="balance_list">
        <li>Total: {balance.total}</li>
        <li>confirmed: {balance.confirmedBalance}</li>
        <li>Pending: {balance.pendingBalance}</li>
      </ul>
    </div>
  );
}

export default ViewBalance;
