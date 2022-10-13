import React, { useState } from "react";
import Miner from "./Miner";

function MinerInterface() {
  let host;
  let port;
  let address;

  let [confirmation, setconfirmation] = useState();

  let submit = (e) => {
    host = e.target[0].value;
    port = Number(e.target[1].value);
    address = e.target[2].value;
    let miner = new Miner({ host, port, address });
    miner.startInfiniteMining();
    setconfirmation("Thank you");
  };
  return (
    <div>
      <h1>Enter host, port, and address to mine blocks.</h1>
      <form onSubmit={submit}>
        Enter host: <input type="text"></input>
        Enter port: <input type="number"></input>
        EnterAddress: <input type="text"></input>
        <input type="submit"></input>
      </form>
      <div>{confirmation}</div>
    </div>
  );
}

export default MinerInterface;
