const { response } = require("express");
const sha256 = require("sha256");
const currentNodeUrl = process.argv[3]; // grabs url from position 2 index 1
const { v1: uuidv1 } = require("uuid");

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = []; // allows each network to be aware of the other nodes
    this.newBlock(100, 0, 0);
  }
  newBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1, //gets block number
      transactions: this.pendingTransactions, //gets all transactions
      timestamp: Date.now(),
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash,
    };
    this.pendingTransactions = []; //clears array to start over for next block
    this.chain.push(newBlock);

    return newBlock;
  }
  newTransaction(amount, sender, recipient) {
    const newTransaction = {
      sender: sender,
      recipient: recipient,
      amount: amount,
    };
    this.pendingTransactions.push(newTransaction);
    return newTransaction;
  }
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    // turns block data to string and hashes the string
    //let block = this.lastBlock();
    const data =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(data);
    return hash;
  }
  lastBlock() {
    return this.chain[this.chain.length - 1];
  }
  proofOfWork(block) {
    let nonce = 0;
    let hash = this.hashBlock(
      block.previousBlockHash,
      block.currentBlockData,
      nonce
    );

    //runs until 1st 4 characters are '0000'
    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(
        block.previousBlockHash,
        block.currentBlockData,
        nonce
      );
    }
    return nonce;
  }
  validChain(blockchain) {
    let validChain = true;

    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        prevBlock["hash"],
        {
          transactions: currentBlock["transactions"],
          index: currentBlock["index"],
        },
        currentBlock["nonce"]
      );
      if (blockHash.substring(0, 4) !== "0000") validChain = false;
      if (currentBlock["previousBlockHash"] !== prevBlock["hash"])
        validChain = false;

      // console.log('previousBlockHash =>', prevBlock['hash']);
      // console.log('currentBlockHash =>', currentBlock['hash']);
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock["nonce"] === 100;
    const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
    const correctHash = genesisBlock["hash"] === "0";
    const correctTransactions = genesisBlock["transactions"].length === 0;

    if (
      !correctNonce ||
      !correctPreviousBlockHash ||
      !correctHash ||
      !correctTransactions
    )
      validChain = false;

    return validChain;
  }
  addTransactionToPendingTransactions(transaction) {
    this.pendingTransactions.push(transaction);
    return this.lastBlock()["index"] + 1;
  }
  resolveConflicts(networkNodes) {
    let neighbors = networkNodes;
    let newChain = null;

    let maxLength = this.chain.length;

    for (node in neighbors) {
      response = request.get(`http://${node}/blockchain`);
      if (response.status.code == 200) {
        let length = response.json()["length"];
        let chain = response.json()["chain"];

        if (length > maxLength && this.validChain(chain)) {
          maxLength = length;
          newChain = chain;
        }
        if (newChain) {
          this.chain = newChain;
          return true;
        }
        return false;
      }
    }
  }
}
let blockchain = new Blockchain();

//console.log(blockchain.chain);

//console.log(blockchain.newTransaction("Alice", "Bob", 50));

//console.log(blockchain.lastBlock());

//console.log(blockchain.proofOfWork(blockchain.lastBlock()));

module.exports = Blockchain;
