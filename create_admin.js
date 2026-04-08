const { Client, Users, ID } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend folder
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const users = new Users(client);

async function createAdmin() {
    try {
        const user = await users.create(
            ID.unique(),
            'admin@smartbuy.ai',
            undefined, 
            'SmartBuy@2026',
            'Project Owner'
        );
        console.log('✅ SUCCESS: Admin account created!');
        console.log('User ID:', user.$id);
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

createAdmin();
