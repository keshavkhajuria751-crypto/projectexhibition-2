const { databases } = require('../config/appwrite');
const { ID } = require('node-appwrite');

exports.predictPrice = async (req, res) => {
  const { query, url } = req.body;

  if (!query && !url) {
    return res.status(400).json({ message: 'Missing query or URL' });
  }

  try {
    // Mock Prediction Logic (to be replaced with actual AI/Model call)
    const mockPrediction = {
        productName: query || "Test Product",
        currentPrice: Math.floor(Math.random() * 5000) + 1000,
        expectedPrice: Math.floor(Math.random() * 5000) + 1000,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        confidence: 0.85,
        timestamp: new Date().toISOString()
    };

    // Store in Appwrite Database
    const log = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_SEARCH_LOG_COLLECTION_ID,
      ID.unique(),
      {
        userId: req.userId,
        query: query || "",
        url: url || "",
        predictionResult: JSON.stringify(mockPrediction), // Appwrite stores objects as strings if not defined as JSON attribute
        searchedAt: new Date().toISOString()
      }
    );

    res.status(200).json({
      message: 'Prediction successful',
      prediction: mockPrediction,
      logId: log.$id
    });

  } catch (err) {
    res.status(err.code || 500).json({ message: 'Error performing prediction', error: err.message });
  }
};
