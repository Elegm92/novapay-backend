import dsApi from "../utils/dsApi.js";

// Obtener cola de casos para revisar
const getFraudQueue = async (round) => {
  const params = round ? { round } : {};
  const response = await dsApi.get("/fraud-queue", { params });
  return response.data;
};

// Obtener detalle de una transacción con su predicción
const getTransactionDetail = async (transactionId) => {
  const response = await dsApi.get(`/transactions/${transactionId}`);
  return response.data;
};

// Obtener stats por ronda
const getStats = async () => {
  const response = await dsApi.get("/stats");
  return response.data;
};

export { getFraudQueue, getTransactionDetail, getStats };
