module.exports = {
    apps: [{
        name: "whatsapp-server",
        script: "./index.js",
        env: {
            NODE_ENV: "production",
            PORT: 3001
        }
    }]
}
