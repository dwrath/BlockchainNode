const express = require("express");
const app = express();
const Blockchain = require("./node");
const bodyParser = require("body-parser");
const rp = require("request-promise");
const { v1: uuidv1 } = require("uuid");
const { response } = require("express");
const port = process.argv[2];

const nodeAddress = uuidv1().split("-").join("");
const senseCoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sends back the blockchain
app.get("/blockchain", function (req, res) {
  res.send(senseCoin);
});

app.post("/transactions/new", function (req, res) {
  const newTransaction = req.body;
  const blockIndex =
    senseCoin.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});
app.post("/transaction/broadcast", function (req, res) {
  const newTransaction = senseCoin.newTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  senseCoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  senseCoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  // run all requests
  Promise.all(requestPromises).then((data) => {
    res.json({ note: "Transaction created and broadcast successfuly." });
  });
});
app.post("/receive-new-block", function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = senseCoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash; //cehck to see if the hashes match
  const correctIndex = lastBlock["index"] + 1 == newBlock["index"]; // check to make sure the last block has the correct index which should be 1 above the last block

  if (correctHash && correctIndex) {
    senseCoin.chain.push(newBlock);
    senseCoin.pendingTransactions = []; //clear out the transactions
    res.json({
      note: "New block received and accepted.",
      newBlock: newBlock,
    });
  } else {
    res.json({
      note: "New block was rejected.",
      newBlock: newBlock,
    });
  }
});

app.get("/mine", function (req, res) {
  const lastBlock = senseCoin.lastBlock();
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
  const newBlock = senseCoin.newBlock(nonce, previousBlockHash, blockHash);

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
  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        uri: senseCoin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress, // gets current address
        },
        json: true,
      };

      return rp(requestOptions);
    })
    // Only send response after all calculations take place
    // After everything runs, send confirmation message
    //////////////////////////////////////////
    .then((data) => {
      res.json({
        note: "New block mined successfully!",
        block: newBlock,
      });
    });
});

app.post("/register-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent =
    senseCoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = senseCoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    senseCoin.networkNodes.push(newNodeUrl);
  res.json({ note: "New node registered successfully." });
});
app.get("/consensus", function (req, res) {
  let replaced = senseCoin.resolveConflicts();

  if (replaced) {
    res.json({
      message: "Chain was replaced",
      newChain: senseCoin.chain,
    });
  } else {
    res.json({
      message: "Chain is authoritative",
      chain: senseCoin.chain,
    });
  }
});
app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
