import dsApi from '../utils/dsApi.js'

// Cola de casos pendientes
const getFraudQueue = async ({ limit, risk_level } = {}) => {
  const params =  {};
  if (limit) params.limit = limit;
  if (risk_level) params.risk_level = risk_level;
  const response = await dsApi.get("/fraud/queue", { params });
  return response.data;
};

// Detalle de un caso específico
const getTransactionDetail = async (transactionId) => {
  const response = await dsApi.get(`/fraud/queue/${transactionId}`)
  return response.data
}

// Decisión del modelo sobre una transacción
const decideTransaction = async (transactionData) => {
  const response = await dsApi.post('/fraud/decide', transactionData)
  return response.data
}

// Explicabilidad de una decisión
const explainDecision = async (transactionData) => {
  const response = await dsApi.post('/fraud/decide/explain', transactionData)
  return response.data
}

// Simulador de umbral what-if
const previewThreshold = async (data) => {
  const response = await dsApi.post('/fraud/decide/preview', data)
  return response.data
}

// Fricción adaptativa
const getChallengeRecommendation = async (transactionData) => {
  const response = await dsApi.post('/fraud/challenge', transactionData)
  return response.data
}

// Enviar feedback del analista al modelo
const sendFeedback = async (feedbackData) => {
  const response = await dsApi.post('/fraud/feedback', feedbackData)
  return response.data
}

// Stats globales por ronda
const getStats = async () => {
  const response = await dsApi.get('/data/stats')
  return response.data
}

// Breakdown de tipos de ataque por ronda
// const getAttackStats = async () => {
//   const response = await dsApi.get('/fraud/stats/attacks')
//   return response.data
// }

// Historial de decisiones
const getFeedbackHistory = async () => {
  const response = await dsApi.get('/fraud/feedback')
  return response.data
}

export {
  getFraudQueue,
  getTransactionDetail,
  decideTransaction,
  explainDecision,
  previewThreshold,
  getChallengeRecommendation,
  sendFeedback,
  getStats,
  getAttackStats,
  getFeedbackHistory
}