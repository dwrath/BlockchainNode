import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <nav className="page-navbar affix">
        <ul className="nav-navbar container">
          <Link to="/" id="linkHome" className="nav-link">
            Home
          </Link>
          <Link to="/create-wallet" id="linkCreateNewWallet" className="nav-link">
            Create New Wallet
          </Link>
          <Link to="/open-existing-wallet" id="linkOpenExistingWallet" className="nav-link">
            Open Existing Wallet
          </Link>
          <Link to="/account-balance" id="linkAccountBalance" className="nav-link">
            Account Balance
          </Link>
          <Link to="/send-transaction" id="linkSendTransaction" className="nav-link">
            Send Transaction
          </Link>
          <Link to="/faucet" id="linkFaucet" className="nav-link">
            Faucet
          </Link>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
