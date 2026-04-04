const { Client, Account } = require('node-appwrite');

const authMiddleware = async (req, res, next) => {
  const sessionSecret = req.cookies.sessionSecret || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!sessionSecret) {
    return res.status(401).json({ message: 'Authentication required. Please login with Appwrite.' });
  }

  try {
    // Create a new client for each request to verify the session
    // We don't use the API key here because we want to act as the user
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setJWT(sessionSecret); // This behaves as a JWT token now

    const account = new Account(client);
    const user = await account.get();

    req.userId = user.$id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.', error: err.message });
  }
};

module.exports = authMiddleware;
