const { users, client, getCleanClient } = require('../config/appwrite');
const { ID, Account } = require('node-appwrite');

exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. Create user in Appwrite using API KEY client
    const appwriteUser = await users.create(ID.unique(), email, undefined, password, name);

    res.status(201).json({
      message: 'Signup successful',
      user: { id: appwriteUser.$id, email: appwriteUser.email, name: appwriteUser.name },
    });
  } catch (err) {
    res.status(err.code || 500).json({ message: 'Error signing up', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verify credentials using a clean client
    const userClient = getCleanClient();
    const userAccount = new Account(userClient);
    const tempSession = await userAccount.createEmailPasswordSession(email, password);

    // 2. Generate a JWT for the user to use in future requests
    const token = await userAccount.createJWT();
    console.log('JWT Token Object:', token);

    // Store the JWT in a cookie
    res.status(200).cookie('sessionSecret', token.jwt || token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // JWTs are short-lived (15 mins by default in Appwrite)
      sameSite: 'lax',
    }).json({
      message: 'Login successful',
      userId: tempSession.userId,
    });
  } catch (err) {
    res.status(err.code || 401).json({ message: 'Invalid credentials.', error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('sessionSecret').json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    // req.userId is set by the authMiddleware from the session
    const appwriteUser = await users.get(req.userId);
    
    res.status(200).json({
      user: appwriteUser
    });
  } catch (err) {
    res.status(err.code || 500).json({ message: 'Error fetching profile', error: err.message });
  }
};
