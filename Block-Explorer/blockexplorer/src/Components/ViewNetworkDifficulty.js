import React, { useState } from "react";
import Navbar from "./Navbar";
import { viewNetworkDifficulty } from "../api/index";

function ViewNetworkDifficulty() {
  let [difficulty, setDifficulty] = useState([]);

  const view = () => {
    viewNetworkDifficulty().then((res) => {
      setDifficulty(res.data.cumulativeDifficulty);
    });
  };
  return (
    <div>
      <Navbar />
      <h1>Click view to see network difficulty</h1>
      <button onClick={view}>View</button>
      <div>
        <textarea value={difficulty} readOnly={true}></textarea>
      </div>
    </div>
  );
}

export default ViewNetworkDifficulty;
