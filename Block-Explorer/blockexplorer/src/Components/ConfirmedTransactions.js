import React, { useState } from "react";
import { confirmedTransactions } from "../api/index";
import Navbar from "./Navbar";

function ConfirmedTransactions() {
  let [tran, setTran] = useState([]);

  const view = () => {
    confirmedTransactions().then((res) => {
      setTran(res.data);
    });
  };
  return (
    <div>
      <Navbar />
      <h1>Click view to see confirmed Transactions</h1>
      <button onClick={view}>View</button>
      <div>
        {tran.length === 0 ? (
          <p>No Transactions at this time</p>
        ) : (
          tran.map((tran, i) => {
            return <textarea key={i} value={JSON.stringify(tran)} readOnly={true}></textarea>;
          })
        )}
      </div>
    </div>
  );
}

export default ConfirmedTransactions;
