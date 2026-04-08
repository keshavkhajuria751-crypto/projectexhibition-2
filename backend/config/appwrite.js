const { Client, Account, Databases, Users } = require('node-appwrite');
const dotenv = require('dotenv');

dotenv.config();

const isMockMode = !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY;

let client, account, databases, users;

if (isMockMode) {
    console.log('⚠️  APPWRITE_PROJECT_ID not found. Starting in MOCK MODE.');
    
    // Simple Mock Implementations
    client = { setEndpoint: () => client, setProject: () => client, setKey: () => client };
    account = { createEmailPasswordSession: () => ({ userId: 'mock-user' }), createJWT: () => 'mock-jwt' };
    databases = { createDocument: () => ({ $id: 'mock-id' }), listDocuments: () => ({ documents: [] }) };
    users = { create: (id, email) => ({ $id: id, email }), get: (id) => ({ $id: id, name: 'Test User', email: 'test@example.com' }) };
} else {
    console.log(`📡 CONNECTING TO APPWRITE: ${process.env.APPWRITE_PROJECT_ID}`);
    client = new Client();
    client
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    account = new Account(client);
    databases = new Databases(client);
    users = new Users(client);
}

const getCleanClient = () => {
    if (isMockMode) return client;
    return new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID);
};

module.exports = { client, account, databases, users, getCleanClient, isMockMode };
