import React from "react";

import Navbar from "./Navbar";

function Wallet() {
  return (
    <div>
      <Navbar />
      <div className="header_image">
        <div className="header">
          <section id="header-content">
            <h1 className="header-title">SenseChain Wallet</h1>
            <h6 className="header-subtitle">Welcome to the Simple Wallet for the SenseChain blockchain network.</h6>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
