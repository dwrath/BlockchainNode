const CryptoMethods = require("./CryptoMethods");

class Block {
  constructor(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, dateCreated, blockHash) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.blockDataHash = blockDataHash;

    // Calculates block data hash if its missing
    if (this.blockDataHash === undefined) this.calculateBlockDataHash();

    this.nonce = nonce;
    this.dateCreated = dateCreated;
    this.blockHash = blockHash;

    // Calculates the block hash if its missing
    if (this.blockHash === undefined) this.calculateBlockHash();
  }
  calculateBlockDataHash() {
    let blockData = {
      index: this.index,
      transactions: this.transactions.map((t) =>
        Object({
          from: t.from,
          to: t.to,
          value: t.value,
          fee: t.fee,
          dateCreated: t.dateCreated,
          data: t.data,
          senderPubKey: t.senderPubKey,
          transactionDataHash: t.transactionDataHash,
          senderSignature: t.senderSignature,
          minedInBlockIndex: t.minedInBlockIndex,
          transferSuccessful: t.transferSuccessful,
        })
      ),
      difficulty: this.difficulty,
      prevBlockHash: this.prevBlockHash,
      minedBy: this.minedBy,
    };
    let blockDataJSON = JSON.stringify(blockData);
    this.blockDataHash = CryptoMethods.sha256(blockDataJSON);
  }

  calculateBlockHash() {
    let data = `${this.blockDataHash}|${this.dateCreated}|${this.nonce}`;
    this.blockHash = CryptoMethods.sha256(data);
  }
}
module.exports = Block;
