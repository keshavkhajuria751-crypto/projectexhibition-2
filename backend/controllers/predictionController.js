const { databases } = require('../config/appwrite');
const { ID } = require('node-appwrite');
const { runMlPredictor } = require('../utils/modelRunner');

exports.predictPrice = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'Missing product URL' });
  }

  try {
    // 1. Run the Physical Python Prediction script
    const prediction = await runMlPredictor(url);

    // 2. Prepare the final response for the Frontend
    const result = {
      ...prediction,
      isReal: true,
      timestamp: new Date().toISOString(),
      bestM: prediction.bestM || 'Mar',  // Ensure chart labels exist
      platform: prediction.platform || { name: 'E-commerce', domain: 'detected' }
    };

    // 4. Log to database in the background (Don't let it block the user)
    try {
        await databases.createDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_SEARCH_LOG_COLLECTION_ID,
          ID.unique(),
          {
            userId: req.userId || 'anonymous',
            query: result.name || "Product Search",
            url: url,
            predictionResult: JSON.stringify(result),
            searchedAt: result.timestamp
          }
        );
    } catch (dbErr) {
        console.warn('⚠️ Search Log failed (Database might not be ready), but continuing...');
    }

    // 5. Send the flattened result
    res.status(200).json(result);

  } catch (err) {
    console.error('❌ Prediction Error:', err);
    res.status(500).json({ message: 'Error performing prediction', error: err.message });
  }
};

/**
 * Keep Track API - Adds a product to the user's tracking watchlist.
 */
exports.trackPrice = async (req, res) => {
  const { url, productName, currentPrice, targetPrice } = req.body;

  if (!url || !productName) {
    return res.status(400).json({ message: 'Missing product details for tracking' });
  }

  try {
    // In a real app, you'd have a separate 'TrackedProducts' collection.
    // For now, we'll log it as a special type of search or acknowledge the request.
    
    // We can also reuse SearchLog with a 'tracked: true' flag if the schema allowed.
    // Assuming the user will set up a 'TrackedProducts' collection ID in .env later.
    const collectionId = process.env.APPWRITE_TRACKED_COLLECTION_ID || process.env.APPWRITE_SEARCH_LOG_COLLECTION_ID;

    const trackLog = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      collectionId,
      ID.unique(),
      {
        userId: req.userId || 'anonymous',
        query: `TRACKING: ${productName}`,
        url: url,
        predictionResult: JSON.stringify({ currentPrice, targetPrice, status: 'active' }),
        searchedAt: new Date().toISOString()
      }
    );

    res.status(200).json({
      message: 'Product added to Price Watchlist successfully',
      trackId: trackLog.$id
    });
  } catch (err) {
    console.error('Tracking Error:', err);
    res.status(500).json({ message: 'Error setting up price tracking', error: err.message });
  }
};
