const { databases, users, client } = require('../config/appwrite');
const { Query } = require('node-appwrite');

exports.getSearchHistory = async (req, res) => {
  try {
    const history = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_SEARCH_LOG_COLLECTION_ID,
      [
        Query.equal('userId', req.userId),
        Query.orderDesc('searchedAt')
      ]
    );
    res.status(200).json({ history: history.documents });
  } catch (err) {
    res.status(err.code || 500).json({ message: 'Error fetching search history', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Note: To update email/name, we need to use the Users service (for admin actions)
    // or the Account service (acting as the user). We'll use the Admin Users service here.
    const updatedUser = await users.updateName(req.userId, name);
    // Email update is more complex as it requires re-verification in some setups
    if (email) {
      await users.updateEmail(req.userId, email);
    }

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(err.code || 500).json({ message: 'Error updating profile', error: err.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    // Appwrite doesn't have a "deleteMany" by query. We must find them and delete one by one or via a function.
    // For simplicity, we'll list and then delete the most recent ones.
    const history = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_SEARCH_LOG_COLLECTION_ID,
      [Query.equal('userId', req.userId)]
    );

    // Delete all found documents
    const deletePromises = history.documents.map(doc => 
      databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_SEARCH_LOG_COLLECTION_ID,
        doc.$id
      )
    );
    await Promise.all(deletePromises);

    res.status(200).json({ message: 'Search history cleared' });
  } catch (err) {
    res.status(err.code || 500).json({ message: 'Error clearing history', error: err.message });
  }
};
