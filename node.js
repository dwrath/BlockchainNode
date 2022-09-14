const { response } = require("express");
const sha256 = require("sha256");

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
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
    return newTransaction;
  }
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    // turns block data to string and hashes the string
    const data =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(data);
    return hash;
  }
  lastBlock() {
    return this.chain[this.chain.length - 1];
  }
  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    //runs until 1st 4 characters are '0000'
    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
  }
  validChain(blockchain) {
    let validChain = true;

    for (var i = 1; i < blockchain.length; i++) {
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
}

module.exports = Blockchain;
