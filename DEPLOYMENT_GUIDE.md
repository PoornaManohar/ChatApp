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

## Option 2: Permanent (Using Render.com)
Best for a real server that stays online 24/7.

1.  Push your code to **GitHub**.
2.  Sign up at [Render.com](https://render.com).
3.  Create a new **Web Service**.
4.  Connect your GitHub repo.
5.  Set the **Root Directory** to `server`.
6.  Set the **Build Command** to `npm install`.
7.  Set the **Start Command** to `node index.js`.
8.  Click **Deploy**.
9.  Copy the URL Render gives you (e.g., `https://chat-app.onrender.com`).
10. Update `src/services/socketService.js` with this URL.

## Important Note
Currently, the chat history is stored in **Memory**. If the server restarts (or Render spins down), chats will be cleared. For permanent storage, a Database (MongoDB/SQL) is needed.
