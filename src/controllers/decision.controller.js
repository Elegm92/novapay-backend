import { sendFeedback } from '../services/fraud.service.js'

const mockDecisions = []

const createDecision = async (req, res) => {
  try {
    const { transaction_id, verdict, notes } = req.body

    if (!transaction_id || !verdict) {
      return res.status(400).json({ message: 'transaction_id and verdict are required' })
    }

    if (!['fraud', 'legitimate'].includes(verdict)) {
      return res.status(400).json({ message: 'Verdict must be fraud or legitimate' })
    }

    const decision = {
      id: `dec_${Date.now()}`,
      transaction_id,
      verdict,
      notes: notes || null,
      analyst_id: req.user.id,
      timestamp: new Date().toISOString()
    }

    mockDecisions.push(decision)

    // cuando DS tenga API: enviar feedback al modelo
    // await sendFeedback({ transaction_id, verdict, analyst_id: req.user.id })

    res.status(201).json(decision)

  } catch (error) {
    console.error('createDecision error:', error.message)
    res.status(500).json({ message: 'Failed to create decision' })
  }
}

const getDecisions = async (req, res) => {
  try {
    res.json(mockDecisions)
  } catch (error) {
    console.error('getDecisions error:', error.message)
    res.status(500).json({ message: 'Failed to get decisions' })
  }
}

export { createDecision, getDecisions }