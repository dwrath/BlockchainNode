import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });

export const getBlocks = () => {
  return API.get(`/blocks`);
};
export const confirmedTransactions = () => {
  return API.get("/transactions/confirmed");
};
export const pendingTransactions = () => {
  return API.get("/transactions/pending");
};
export const getAddressBalance = (address) => {
  return API.get(`/address/${address}/balance`);
};
export const viewPeers = () => {
  return API.get(`/peers`);
};
export const viewNetworkDifficulty = () => {
  return API.get(`/info`);
};
