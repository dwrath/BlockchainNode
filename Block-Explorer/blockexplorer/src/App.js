import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import ViewBlocks from "./Components/ViewBlocks";
import ConfirmedTransactions from "./Components/ConfirmedTransactions";
import PendingTransactions from "./Components/PendingTransactions";
import AccountBalances from "./Components/AccountBalances";
import ViewPeers from "./Components/ViewPeers";
import ViewNetworkDifficulty from "./Components/ViewNetworkDifficulty";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view-blocks" element={<ViewBlocks />} />
        <Route path="/confirmed-transactions" element={<ConfirmedTransactions />} />
        <Route path="/pending-transactions" element={<PendingTransactions />} />
        <Route path="/accounts" element={<AccountBalances />} />
        <Route path="/peers" element={<ViewPeers />} />
        <Route path="/network-difficulty" element={<ViewNetworkDifficulty />} />
      </Routes>
    </>
  );
}

export default App;
