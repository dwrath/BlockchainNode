const express = require("express");
const app = express();
const Blockchain = require("./node");
const bodyParser = require("body-parser");
const rp = require("request-promise");
const { v1: uuidv1 } = require("uuid");
const port = 5001;

const nodeAddress = uuidv1().split("-").join("");
const senseCoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sends back the blockchain
app.get("/blockchain", function (req, res) {
  res.send(senseCoin);
});

app.post("/transaction/new", function (req, res) {
  const newTransaction = req.body;
  const blockIndex =
    senseCoin.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get("/mine", function (req, res) {
  const lastBlock = senseCoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: senseCoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };

  const nonce = senseCoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = senseCoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  const newBlock = senseCoin.createNewBlock(
    nonce,
    previousBlockHash,
    blockHash
  );

  // Broadcast out to all networks

  const requestPromises = [];
  senseCoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });
});
app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
