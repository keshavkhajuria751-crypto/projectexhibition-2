const { Client, Account, Databases, Users } = require('node-appwrite');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const account = new Account(client);
const databases = new Databases(client);
const users = new Users(client);

// Helper for user-specific actions (like login)
const getCleanClient = () => {
    return new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID);
};

module.exports = { client, account, databases, users, getCleanClient };
