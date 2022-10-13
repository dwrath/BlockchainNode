import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });

export const getAccountBalance = (address) => {
  return API.get(`/address/${address}/balance`);
};

export const sendTransaction = (transaction) => {
  return API.post(`/transactions/send`, transaction, { headers: { "Content-Type": "application/json" } });
};
