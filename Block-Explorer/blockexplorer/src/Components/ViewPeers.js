import React, { useState } from "react";
import Navbar from "./Navbar";
import { viewPeers } from "../api/index";

function ViewPeers() {
  let [peers, setPeers] = useState([]);
  const view = () => {
    viewPeers().then((res) => {
      setPeers(res.data);
    });
  };
  return (
    <div>
      <Navbar />
      <h1>Click view to see network Peers</h1>
      <button onClick={view}>View</button>
      <div>
        {!peers.length === 0 ? (
          peers.map((peer, i) => {
            return <textarea key={i} value={JSON.stringify(peer)} readOnly={true}></textarea>;
          })
        ) : (
          <p>No Peers at this time</p>
        )}
      </div>
    </div>
  );
}

export default ViewPeers;
