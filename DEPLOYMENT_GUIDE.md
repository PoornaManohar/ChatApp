# 🚀 How to Chat with Friends (Deployment Guide)

To chat with your friends, your local server (running on port 3001) needs to be accessible from the internet.

## Option 1: Quick & Easy (Using Ngrok)
Best for temporary testing instantly.

1.  **Open a new terminal** in your VS Code.
2.  Run the following command to expose your server:
    ```bash
    npx ngrok http 3001
    ```
3.  Ngrok will show a URL that looks like `https://xxxx-xxxx.ngrok-free.app`.
4.  **Copy this URL.**
5.  Open `src/services/socketService.js`.
6.  Paste the URL into the `DEPLOYMENT_URL` constant at the top:
    ```javascript
    const DEPLOYED_URL = 'https://your-ngrok-url.ngrok-free.app';
    ```
7.  **Save the file.**
8.  Reload your app (`r` in the terminal or shake device).
9.  **Build/Share the App**:
    *   If using Expo Go, your friends can scan your QR code (if on same network) or use the published link if you publish to Expo.
    *   Ideally, build an APK: `eas build -p android --profile preview`.

## Option 2: Permanent (Free Alternatives)

### A. Glitch (Good for Demos)
1.  Go to [Glitch.com](https://glitch.com).
2.  Click **New Project** -> **Import from GitHub**.
3.  Paste your URL: `https://github.com/PoornaManohar/ChatApp`.
4.  Open the `.env` file in Glitch.
5.  Add your Variable: `MONGO_URI=mongodb+srv://...` (Copy from your local .env).
6.  Click **Share** -> **Live Site** to get your URL.
7.  Update `socketService.js` with this URL.

### B. Render (If you have a slot)
1.  Push your code to **GitHub**.
2.  Sign up at [Render.com](https://render.com).
...
## Option 3: Railway (Most similar to Render)
Railway is a popular alternative with a great developer experience.

1.  Sign up at [Railway.app](https://railway.app).
2.  Click **New Project** -> **Deploy from GitHub repo**.
3.  Select your `ChatApp` repository.
4.  Click **Add Variables** (Environment Variables).
5.  Add `MONGO_URI` and paste your connection string.
6.  Click **Deploy**.
7.  Once deployed, go to **Settings** -> **Domains** to generate a public URL.
8.  Update `socketService.js` with this URL.

## Option 4: Koyeb (Generous Free Tier)
Another excellent "push-to-deploy" platform.

1.  Sign up at [Koyeb.com](https://koyeb.com).
2.  Click **Create App** -> **GitHub**.
3.  Select your repository.
4.  In the **Builder** section, it should auto-detect Node.js.
5.  Under **Environment Variables**, add `MONGO_URI`.
6.  Click **Deploy**.
7.  Copy the public URL from the dashboard.
8.  Update `socketService.js`.

6.  Set the **Build Command** to `npm install`.
7.  Set the **Start Command** to `node index.js`.
8.  Click **Deploy**.
9.  Copy the URL Render gives you (e.g., `https://chat-app.onrender.com`).
10. Update `src/services/socketService.js` with this URL.

## Important Note
Currently, the chat history is stored in **Memory**. If the server restarts (or Render spins down), chats will be cleared. For permanent storage, a Database (MongoDB/SQL) is needed.
