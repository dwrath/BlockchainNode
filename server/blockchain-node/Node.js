const config = require("./Config");
const Blockchain = require("./Chain");
const express = require("express");
const cors = require("cors");
const StatusCodes = require("http-status-codes");
const bodyParser = require("body-parser");
const axios = require("axios");

let node = {
  nodeId: "", // identifies the current node
  host: "", // external host / IP address to connect to node
  port: 0, // TCP port number
  selfUrl: "", // the external base URL of the REST endpoints
  peers: {}, // a map(nodeId --> url) of the peers, connected to this node
  chain: new Blockchain(), // the blockchain
  chainId: "", // the unique chain ID (hash of the genesis block)
};

node.initializeNode = function (serverHost, serverPort, blockchain) {
  node.nodeId = new Date().getTime().toString(16) + Math.random().toString(16).substring(2);
  node.host = serverHost;
  node.port = serverPort;
  node.selfUrl = `http://${serverHost}:${serverPort}`;
  node.peers = {};
  node.chain = blockchain;
  node.chainId = node.chain.blocks[0].blockHash;
};
let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/info", (req, res) => {
  res.json({
    about: "SenseChain",
    nodeId: node.nodeId,
    chainId: node.chainId,
    nodeUrl: node.selfUrl,
    peers: Object.keys(node.peers).length,
    currentDifficulty: node.chain.currentDifficulty,
    blocksCount: node.chain.blocks.length,
    cumulativeDifficulty: node.chain.calculateCumulativeDifficulty(),
    confirmedTransactions: node.chain.getConfirmedTransactions().length,
    pendingTransactions: node.chain.pendingTransactions.length,
  });
});
app.get("/debug", (req, res) => {
  let confirmedBalances = node.chain.calcAllConfirmedBalances();
  res.json({ node, config, confirmedBalances });
});
app.get("/reset-chain", (req, res) => {
  node.chain = new Blockchain(config.genesisBlock, config.startDifficulty);
  res.json({ message: "The chain was reset to its genesis block" });
});
app.get("/blocks", (req, res) => {
  res.json(node.chain.blocks);
});
app.get("/blocks/:index", (req, res) => {
  let index = req.params.index;
  let block = node.chain.blocks[index];
  if (block) {
    res.json(block);
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ errorMsg: "Invalid block index" });
  }
});
app.get("/transactions/pending", (req, res) => {
  res.json(node.chain.getPendingTransactions());
});
app.get("/transactions/confirmed", (req, res) => {
  res.json(node.chain.getConfirmedTransactions());
});
app.get("/balances", (req, res) => {
  let confirmedBalances = node.chain.calcAllConfirmedBalances();
  res.json(confirmedBalances);
});
app.get("/address/:address/transactions", (req, res) => {
  let address = req.params.address;
  let tranHistory = node.chain.getTransactionHistory(address);
  res.json(tranHistory);
});
app.get("/address/:address/balance", (req, res) => {
  let address = req.params.address;
  let balance = node.chain.getAccountBalance(address);
  if (balance.errorMsg) res.status(StatusCodes.NOT_FOUND);
  res.json(balance);
});
app.post("/transactions/send", (req, res) => {
  let tran = node.chain.addNewTransaction(req.body);
  if (tran.transactionDataHash) {
    // Added a new pending transaction --> broadcast it to all known peers
    node.broadcastTransactionToAllPeers(tran);

    res.status(StatusCodes.CREATED).json({
      transactionDataHash: tran.transactionDataHash,
    });
  } else res.status(StatusCodes.BAD_REQUEST).json(tran);
});

app.get("/peers", (req, res) => {
  res.json(node.peers);
});
app.get("/mining/get-mining-job/:address", (req, res) => {
  let address = req.params.address;
  let blockCandidate = node.chain.getMiningJob(address);
  res.json({
    index: blockCandidate.index,
    transactionsIncluded: blockCandidate.transactions.length,
    difficulty: blockCandidate.difficulty,
    expectedReward: blockCandidate.transactions[0].value,
    rewardAddress: blockCandidate.transactions[0].to,
    blockDataHash: blockCandidate.blockDataHash,
  });
});
app.post("/mining/submit-mined-block", (req, res) => {
  let blockDataHash = req.body.blockDataHash;
  let dateCreated = req.body.dateCreated;
  let nonce = req.body.nonce;
  let blockHash = req.body.blockHash;
  let result = node.chain.submitMinedBlock(blockDataHash, dateCreated, nonce, blockHash);
  if (result.errorMsg) res.status(StatusCodes.BAD_REQUEST).json(result);
  else {
    res.json({ message: `Block accepted, reward paid: ${result.transactions[0].value} sensecoins` });
    node.notifyPeersAboutNewBlock();
  }
});
app.get("/debug/mine/:minerAddress/:difficulty", (req, res) => {
  let minerAddress = req.params.minerAddress;
  let difficulty = parseInt(req.params.difficulty) || 3;
  let result = node.chain.mineNextBlock(minerAddress, difficulty);
  if (result.errorMsg) res.status(StatusCodes.BAD_REQUEST);
  res.json(result);
});
app.get("/peers", (req, res) => {
  res.json(node.peers);
});
app.post("/peers/connect", (req, res) => {
  let peerUrl = req.body.peerUrl;
  if (peerUrl === undefined)
    return res.status(StatusCodes.BAD_REQUEST).json({ errorMsg: "Missing 'peerUrl' in the request body" });

  console.log("Trying to connect to peer: " + peerUrl);
  axios
    .get(peerUrl + "/info")
    .then(function (result) {
      if (node.nodeId === result.data.nodeId) {
        res.status(StatusCodes.CONFLICT).json({ errorMsg: "Cannot connect to self" });
      } else if (node.peers[result.data.nodeId]) {
        console.log("Error: already connected to peer: " + peerUrl);
        res.status(StatusCodes.CONFLICT).json({ errorMsg: "Already connected to peer: " + peerUrl });
      } else if (node.chainId !== result.data.chainId) {
        console.log("Error: chain ID cannot be different");
        res.status(StatusCodes.BAD_REQUEST).json({ errorMsg: "Nodes should have the same chain ID" });
      } else {
        // Remove all peers with the same URL + add the new peer
        for (let nodeId in node.peers) if (node.peers[nodeId] === peerUrl) delete node.peers[nodeId];
        node.peers[result.data.nodeId] = peerUrl;
        console.log("Successfully connected to peer: " + peerUrl);

        // Try to connect back the remote peer to self
        axios
          .post(peerUrl + "/peers/connect", { peerUrl: node.selfUrl })
          .then(function () {})
          .catch(function () {});

        // Synchronize the blockchain + pending transactions
        node.syncChainFromPeerInfo(result.data);
        node.syncPendingTransactionsFromPeerInfo(result.data);

        res.json({ message: "Connected to peer: " + peerUrl });
      }
    })
    .catch(function (error) {
      console.log(`Error connecting to peer: ${peerUrl} failed.`);
      res.status(StatusCodes.BAD_REQUEST).json({ errorMsg: "Cannot connect to peer: " + peerUrl });
    });
});
app.post("/peers/notify-new-block", (req, res) => {
  node.syncChainFromPeerInfo(req.body);
  res.json({ message: "Thank you for the notification." });
});

node.broadcastTransactionToAllPeers = async function (tran) {
  for (let nodeId in node.peers) {
    let peerUrl = node.peers[nodeId];
    console.log(`Broadcasting a transaction ${tran.transactionsHash} to peer ${peerUrl}`);
    axios
      .post(peerUrl + "/transactions/send", tran)
      .then(function () {})
      .catch(function () {});
  }
};
node.syncChainFromPeerInfo = async function (peerChainInfo) {
  try {
    let thisChainDiff = node.chain.calculateCumulativeDifficulty();
    let peerChainDiff = peerChainInfo.cumulativeDifficulty;
    if (peerChainDiff > thisChainDiff) {
      console.log(
        `Chain sync started. Peer: ${peerChainInfo.nodeUrl}. Expected chain length = ${peerChainInfo.blocksCount}, expected cummulative difficulty = ${peerChainDiff}.`
      );
      let blocks = (await axios.get(peerChainInfo.nodeUrl + "/blocks")).data;
      let chainIncreased = node.chain.processLongerChain(blocks);
      if (chainIncreased) {
        node.notifyPeersAboutNewBlock();
      }
    }
  } catch (err) {
    console.log("Error loading the chain: " + err);
  }
};

node.syncPendingTransactionsFromPeerInfo = async function (peerChainInfo) {
  try {
    if (peerChainInfo.pendingTransactions > 0) {
      console.log(`Pending transactions sync started. Peer: ${peerChainInfo.nodeUrl}`);
      let transactions = (await axios.get(peerChainInfo.nodeUrl + "/transactions/pending")).data;
      for (let tran of transactions) {
        let addedTran = node.chain.addNewTransaction(tran);
        if (addedTran.transactionDataHash) {
          // Added a new pending tx --> broadcast it to all known peers
          node.broadcastTransactionToAllPeers(addedTran);
        }
      }
    }
  } catch (err) {
    console.log("Error loading the pending transactions: " + err);
  }
};

node.startServer = function () {
  let server = app.listen(node.port, () => {
    console.log(`Server started at ${node.selfUrl}`);
  });
  return server;
};
let blockchain = new Blockchain(config.genesisBlock, config.startDifficulty);
node.initializeNode("localhost", 5001, blockchain);
node.startServer();
node.app = app;

module.exports = node;
