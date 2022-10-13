import React, { useState } from "react";
import { getBlocks } from "../api/index";
import Navbar from "./Navbar";
function ViewBlocks() {
  let [blocks, setBlocks] = useState([]);

  const view = () => {
    getBlocks().then((res) => {
      setBlocks(res.data);
    });
  };
  return (
    <div>
      <Navbar />
      <h1>Click view to see blocks</h1>
      <button onClick={view}>View</button>
      <div>
        {blocks.map((block, i) => {
          return <textarea key={i} value={JSON.stringify(block)} readOnly={true}></textarea>;
        })}
      </div>
    </div>
  );
}

export default ViewBlocks;
