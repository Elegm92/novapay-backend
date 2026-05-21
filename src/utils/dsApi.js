import axios from "axios";

const dsApi = axios.create({
  baseURL: process.env.DS_API_URL,
  timeout: 5000,
});

export default dsApi;
