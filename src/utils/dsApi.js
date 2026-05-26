import axios from "axios";

const dsApi = axios.create({
  baseURL: process.env.DS_API_URL,
  timeout: 15000,
  headers: {
    'X-API-Key': 'centinela-secreto-123',
    'Content-Type': 'application/json'
  }
});

export default dsApi;
