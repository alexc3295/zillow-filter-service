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
      // probe-image-size fetches just enough data to get dimensions
      const result = await probe(url, { timeout: 10000 });
      if (result.width > result.height) {
        horizontalUrls.push(url);
      }
    } catch (error) {
      console.error(`Failed to check image dimensions: ${url}`, error);
      // Skip images that can’t be fetched or parsed
    }
  }

  // Return only horizontal images (and you can slice to 8 if you wish)
  // e.g., horizontalUrls = horizontalUrls.slice(0, 8);

  return res.json({ horizontalUrls });
}
