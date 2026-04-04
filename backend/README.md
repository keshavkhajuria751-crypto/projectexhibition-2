# Price Prediction Backend (Appwrite Powered) 🚀

This is the backend service for the Price Prediction project, fully integrated with **Appwrite Cloud** for authentication and data storage.

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- An [Appwrite Cloud](https://cloud.appwrite.io) account.

### 2. Environment Setup
Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_secret_api_key

# Appwrite Database IDs
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_SEARCH_LOG_COLLECTION_ID=your_collection_id
```

> [!IMPORTANT]
> Port **5001** is used to avoid conflicts with macOS AirPlay (which often occupies port 5000).

### 3. Installation & Run
From the `backend/` directory, run:

```bash
# Install dependencies
npm install

# Start the server (Development mode with Nodemon)
npm run dev

# Start the server (Production mode)
npm run start
```

---

## ☁️ Appwrite Console Configuration

To ensure the backend works correctly, you must configure your Appwrite project as follows:

### 1. API Key Scopes
Ensure your **API Key** has the following scopes:
- **Auth**: All scopes (for user registration/login).
- **Database**: `databases.read`, `databases.write`, `collections.read`, `collections.write`, `documents.read`, `documents.write`.

### 2. Database Attributes
In your `SearchLogs` collection, add the following **Attributes** under the "Attributes" tab:
- `userId` (String, Size: 255)
- `query` (String, Size: 255)
- `url` (String, Size: 1000)
- `predictionResult` (String/Large Text, Size: 5000)
- `searchedAt` (String/Datetime)

---

## 🔌 Connecting to the Frontend

To connect your frontend (React/Vite) to this backend:

1.  **Base URL**: Set your API base URL to `http://localhost:5001`.
2.  **CORS**: The backend is configured to allow requests from `http://localhost:5173` (Vite's default). Update `FRONTEND_URL` in `.env` if you use a different port.
3.  **Credentials**: Since we use **Cookies** for session management, ensure your frontend requests (e.g., via `axios` or `fetch`) include the `credentials: 'include'` option.

Example with Axios:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true
});
```

---

## 🛠️ API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user.
- `POST /api/auth/login` - Login and receive a session cookie.
- `POST /api/auth/logout` - Clear the session.
- `GET /api/auth/me` - Get current user profile.

### Predictions
- `POST /api/prediction/predict` - Run a price prediction and save to history.

### User
- `GET /api/users/history` - Fetch search history.
- `PUT /api/users/profile` - Update user name/email.
- `DELETE /api/users/history` - Clear all search history.
