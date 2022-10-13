import React from "react";
import Navbar from "./Navbar";

function Home() {
  return (
    <div>
      <h1>SenseChain Block Explorer</h1>
      <p>
        Click links to view chain blocks, confirmed transactions, pending transactions, accounts and account balances,
        peers, and the network difficulty.
      </p>
      <Navbar />
    </div>
  );
}

export default Home;
