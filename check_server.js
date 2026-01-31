const fetch = require('node-fetch'); // or use built-in fetch in newer node

async function check() {
    try {
        console.log('Testing: https://chatapp-production-b7b5.up.railway.app/api/auth/check');
        const response = await fetch('https://chatapp-production-b7b5.up.railway.app/api/auth/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: '12345' }) // Random number
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

check();
