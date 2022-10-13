import React, { useState } from "react";
import Navbar from "./Navbar";
import { getAddressBalance } from "../api/index";

function AccountBalances() {
  let [balance, setBalance] = useState();

  let handleSubmit = (e) => {
    let address = e.target[0].value;
    getAddressBalance(address).then((res) => {
      setBalance(res.data);
    });
  };
  return (
    <div>
      <Navbar />
      <h1>Enter Account Address</h1>
      <form onSubmit={handleSubmit}>
        Address: <input type="text" id="textBoxAccountAddress" className="address" />
        <input type="submit" id="buttonDisplayBalance" value="Display Balance" />
      </form>
      <textarea value={JSON.stringify(balance)} readOnly={true}></textarea>
    </div>
  );
}

export default AccountBalances;
