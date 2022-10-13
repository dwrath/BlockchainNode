import React, { useState } from "react";
import { pendingTransactions } from "../api/index";
import Navbar from "./Navbar";
function PendingTransactions() {
  let [tran, setTran] = useState([]);
  const view = () => {
    pendingTransactions().then((res) => {
      setTran(res.data);
    });
  };
  return (
    <div>
      <Navbar />
      <h1>Click view to see pending Transactions</h1>
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

export default PendingTransactions;
