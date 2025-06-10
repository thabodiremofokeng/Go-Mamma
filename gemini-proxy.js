// netlify/functions/gemini-proxy.js
const fetch = require('node-fetch'); // Netlify Functions include node-fetch by default

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // Method Not Allowed
            body: 'Method Not Allowed'
        };
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // This is crucial

    if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY environment variable is not set.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error: API key missing.' })
        };
    }

    try {
        // Parse the request body from the client
        const requestBody = JSON.parse(event.body);

        // Construct the Gemini API URL with the key
        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        // Make the request to the Gemini API
        const geminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody) // Forward the client's request body
        });

        const geminiData = await geminiResponse.json();

        // Return the Gemini API's response to the client
        return {
            statusCode: geminiResponse.status,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiData)
        };

    } catch (error) {
        console.error('Error in Netlify function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process request on server.' })
        };
    }
};