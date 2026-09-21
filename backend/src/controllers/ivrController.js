const { handleIVRStep, ingestIVRReport } = require('../ivr/ivrStateMachine');

async function processIVRStep(req, res) {
  try {
    const { sessionId = `SESSION_${Date.now()}`, dtmfInput, farmerPhone } = req.body;
    const result = handleIVRStep(sessionId, dtmfInput, farmerPhone);

    if (result.shouldIngest && result.sessionData) {
      await ingestIVRReport(result.sessionData);
    }

    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { processIVRStep };
