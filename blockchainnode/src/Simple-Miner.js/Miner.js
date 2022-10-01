const CryptoJS = require("crypto-js");
const axios = require("axios");

let miner = {};

miner.initialize = function ({ host, port, address }) {
  this.nodeUrl = `http://${host}:${port}`;
  this.miningJobUrl = `${this.nodeUrl}/mining/get-mining-job/${address}`;
  this.submitMinedBlockUrl = `${this.nodeUrl}/mining/submit-mined-block`;
};
miner.startInfiniteMining = async function () {
  while (true) {
    try {
      let nextBlock = (await axios.get(this.miningJobUrl)).data;
      console.log("Taking mining job: " + JSON.stringify(nextBlock));
      await this.mine(nextBlock);
      console.log("Mined a block: " + nextBlock.blockHash);
      await this.submitMinedJob(nextBlock);
    } catch (error) {
      console.log(error);
      if (error.response) {
      }
      console.log("Waiting for block to mine");
    }
  }
};
miner.mine = async function (nextBlock) {
  nextBlock.dateCreated = new Date().toISOString();
  nextBlock.nonce = 0;
  do {
    nextBlock.nonce++;
    let data = `${nextBlock.blockDataHash}|${nextBlock.dateCreated}|${nextBlock.nonce}`;
    nextBlock.blockHash = CryptoJS.SHA256(data).toString();
  } while (!this.isValidDifficulty(nextBlock.blockHash, nextBlock.difficulty));
};

miner.submitMinedJob = async function (nextBlock) {
  let submitResult = (await axios.post(this.submitMinedBlockUrl, nextBlock)).data;
  if (submitResult.message) console.log(submitResult.message + "\n");
  else console.log(submitResult.errorMsg + "\n");
};

miner.isValidDifficulty = function (blockHash, difficulty) {
  for (let i = 0; i < difficulty; i++) {
    if (blockHash[i] !== "0") {
      return false;
    }
  }
  return true;
};
miner.initialize({
  host: "localhost",
  port: 5001,
  address: "d7fb7c01100eb000dbd9e68f901b4652d9466f1dffd799af4d3922cfc85e4f9e",
});
miner.startInfiniteMining();
let block = {
  difficulty: 1,
  blockDataHash: "1323614b847fc921dcb5536132f9618ee736096ecd4ac3e34c3b6aafc2fd564a",
};
miner.mine(block);
module.exports = miner;
