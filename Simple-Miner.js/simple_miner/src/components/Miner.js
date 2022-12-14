import axios from "axios";
import CryptoJS from "crypto-js";

class Miner {
  constructor({ host, port, address }) {
    this.nodeUrl = `http://${host}:${port}`;
    this.miningJobUrl = `${this.nodeUrl}/mining/get-mining-job/${address}`;
    this.submitMinedBlockUrl = `${this.nodeUrl}/mining/submit-mined-block`;
  }

  async startInfiniteMining() {
    while (true) {
      try {
        let nextBlock = (await axios.get(this.miningJobUrl)).data;
        //console.log("Taking mining job: " + JSON.stringify(nextBlock));
        this.mine(nextBlock);
        //console.log("Mined a block: " + nextBlock.blockHash);
        this.submitMinedJob(nextBlock);
      } catch (error) {
        console.log(error);
        if (error.response) {
        }
        console.log("Waiting for block to mine");
      }
    }
  }
  async mine(nextBlock) {
    nextBlock.dateCreated = new Date().toISOString();
    nextBlock.nonce = 0;
    do {
      nextBlock.nonce++;
      let data = `${nextBlock.blockDataHash}|${nextBlock.dateCreated}|${nextBlock.nonce}`;
      nextBlock.blockHash = CryptoJS.SHA256(data).toString();
    } while (!this.isValidDifficulty(nextBlock.blockHash, nextBlock.difficulty));
  }

  async submitMinedJob(nextBlock) {
    let submitResult = (await axios.post(this.submitMinedBlockUrl, nextBlock)).data;
    if (submitResult.message) console.log(submitResult.message + "\n");
    else console.log(submitResult.errorMsg + "\n");
  }

  isValidDifficulty(blockHash, difficulty) {
    for (let i = 0; i < difficulty; i++) {
      if (blockHash[i] !== "0") {
        return false;
      }
    }
    return true;
  }
}
/*initialize({
  host: "localhost",
  port: 5001,
  address: "d7fb7c01100eb000dbd9e68f901b4652d9466f1dffd799af4d3922cfc85e4f9e",
});
miner.startInfiniteMining();
*/
export default Miner;
