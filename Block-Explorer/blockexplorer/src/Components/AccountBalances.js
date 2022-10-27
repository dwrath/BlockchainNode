import React, { useState } from "react";
import Navbar from "./Navbar";
import { getAddressBalance } from "../api/index";

function AccountBalances() {
  let [balance, setBalance] = useState();
  let [userAddress, setUserAddres] = useState();

  let handleChange = (e) => {
    setUserAddres(e.target.value);
  };
  let handleSubmit = () => {
    let address = userAddress;
    getAddressBalance(address).then((res) => {
      setBalance(res.data);
    });
  };
  return (
    <div>
      <Navbar />
      <h1>Enter Account Address</h1>
      <form>
        Address: <input type="text" id="textBoxAccountAddress" className="address" onChange={handleChange} />
        <input type="button" id="buttonDisplayBalance" value="Display Balance" onClick={handleSubmit} />
      </form>
      <textarea value={JSON.stringify(balance)} readOnly={true}></textarea>
    </div>
  );
}

export default AccountBalances;
