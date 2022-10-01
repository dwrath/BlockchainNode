import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <section>
        <Link to="/" id="linkHome">
          Home
        </Link>
        <Link to="/create-wallet" id="linkCreateNewWallet">
          Create New Wallet
        </Link>
        <Link to="/open-existing-wallet" id="linkOpenExistingWallet">
          Open Existing Wallet
        </Link>
        <Link to="/account-balance" id="linkAccountBalance" className="after-login">
          Account Balance
        </Link>
        <Link to="/send-transaction" id="linkSendTransaction" className="after-login">
          Send Transaction
        </Link>
      </section>
    </div>
  );
}

export default Navbar;
