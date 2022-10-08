import "./App.css";
import Wallet from "./Simple-Wallet/components/Wallet";
import { Routes, Route } from "react-router-dom";
import CreateWallet from "./Simple-Wallet/components/CreateWallet";
import OpenExistingWallet from "./Simple-Wallet/components/OpenExistingWallet";
import ViewBalance from "./Simple-Wallet/components/ViewBalance";
import SendTransaction from "./Simple-Wallet/components/SendTransaction";
import Faucet from "./Faucet-App/Faucet";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Wallet />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/open-existing-wallet" element={<OpenExistingWallet />} />
        <Route path="/account-balance" element={<ViewBalance />} />
        <Route path="/send-transaction" element={<SendTransaction />} />
        <Route path="/faucet" element={<Faucet />} />
      </Routes>
    </div>
  );
}

export default App;
