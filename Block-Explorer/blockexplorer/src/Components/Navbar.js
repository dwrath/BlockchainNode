import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <div>
      <section className="navbar">
        <Link to="/" id="linkHome">
          Home
        </Link>
        <Link to="/view-blocks" id="linkViewBlocks">
          View Blocks
        </Link>
        <Link to="/confirmed-transactions" id="linkConfirmedTransactions">
          View confirmed transactions
        </Link>
        <Link to="/pending-transactions" id="linkPendingTransactions">
          View pending transactions
        </Link>
        <Link to="/accounts" id="linkAccounts">
          View account
        </Link>
        <Link to="/peers" id="linkPeers">
          View Peers
        </Link>
        <Link to="/network-difficulty" id="linkNetworkDifficulty">
          View network difficulty
        </Link>
      </section>
    </div>
  );
}

export default Navbar;
