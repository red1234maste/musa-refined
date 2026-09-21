const cron = require('node-cron');
const { runClusteringPass } = require('../services/clustering');

function startClusterCron() {
  // Run clustering pass every 2 minutes in background
  cron.schedule('*/2 * * * *', async () => {
    console.log('[CRON] Running scheduled spatial-temporal clustering pass...');
    try {
      const result = await runClusteringPass();
      console.log(`[CRON] Clustering pass completed. Evaluated: ${result.clustersEvaluated}, Alerts Fired: ${result.newAlertsFired}`);
    } catch (err) {
      console.error('[CRON ERROR] Scheduled clustering pass failed:', err);
    }
  });
  console.log('[CRON] Scheduled clustering pass initialized (every 2 minutes).');
}

module.exports = { startClusterCron };
