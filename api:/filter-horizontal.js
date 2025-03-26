const probe = require('probe-image-size');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'No valid "urls" array provided.' });
  }

  const horizontalUrls = [];
  for (const url of urls) {
    try {
      const result = await probe(url, { timeout: 10000 });
      if (result.width > result.height) {
        horizontalUrls.push(url);
      }
    } catch (error) {
      console.error(`Failed to check image dimensions: ${url}`, error);
    }
  }
  return res.json({ horizontalUrls });
};
