import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const REDDIT_AUTH_URL = 'https://www.reddit.com/api/v1/authorize';
const REDDIT_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';

// Step 1: Redirect User to Reddit Login
app.get('/auth/reddit', (req, res) => {
    const authUrl = `${REDDIT_AUTH_URL}?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=random_string&redirect_uri=${process.env.REDDIT_REDIRECT_URI}&duration=temporary&scope=identity`;
    res.redirect(authUrl);
});

// Step 2: Handle Callback & Get Access Token
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'Authorization code missing' });

    const authHeader = 'Basic ' + Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');

    const tokenResponse = await fetch(REDDIT_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.REDDIT_REDIRECT_URI
        })
    });

    const tokenData = await tokenResponse.json();
    res.json(tokenData); // Send token to frontend
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
