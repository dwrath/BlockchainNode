const CryptoMethods = require("./CryptoMethods");

class Transaction {
  constructor(
    from,
    to,
    value,
    fee,
    dateCreated,
    data,
    senderPubKey,
    transactionDataHash,
    senderSignature,
    minedInBlockIndex,
    transferSuccessful
  ) {
    this.from = from; // Sender address
    this.to = to; // Recipient address
    this.value = value; // Transfer value
    this.fee = fee; // Mining fee
    this.dateCreated = dateCreated;
    this.data = data; // Optional data (e.g. payload or comments)
    this.senderPubKey = senderPubKey;
    this.transactionDataHash = transactionDataHash;

    // Calculate the transaction data hash if its missing
    if (this.transactionDataHash === undefined) this.calculateDataHash();

    this.senderSignature = senderSignature; // hex_number[2][64]
    this.minedInBlockIndex = minedInBlockIndex; // integer
    this.transferSuccessful = transferSuccessful; // bool
  }

  calculateDataHash() {
    let tranData = {
      from: this.from,
      to: this.to,
      value: this.value,
      fee: this.fee,
      dateCreated: this.dateCreated,
      data: this.data,
      senderPubKey: this.senderPubKey,
    };
    let tranDataJSON = JSON.stringify(tranData);
    this.transactionDataHash = CryptoMethods.sha256(tranDataJSON);
  }

  sign(privateKey) {
    this.senderSignature = CryptoMethods.signData(this.transactionDataHash, privateKey);
  }

  verifySignature() {
    return CryptoMethods.verifySignature(this.transactionDataHash, this.senderPubKey, this.senderSignature);
  }
}
module.exports = Transaction;
