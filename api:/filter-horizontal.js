// api/filter-horizontal.js
import probe from 'probe-image-size';

export default async function handler(req, res) {
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
      // probe-image-size fetches minimal bytes to determine dimensions
      const result = await probe(url, { timeout: 10000 });
      if (result.width > result.height) {
        horizontalUrls.push(url);
      }
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
      // Skip images that can’t be fetched or parsed
    }
  }
  
  return res.json({ horizontalUrls });
}
