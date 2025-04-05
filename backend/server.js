const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // use your Gemini API key

app.post('/generate-event', async (req, res) => {
    const { stats, philosophy } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // or 'gemini-1.0-pro'

        const prompt = `
      You are a farming simulator AI. Based on the player's stats and farming philosophy, generate a short farm event and 2 decisions they can choose from.
      
      Player Stats: ${JSON.stringify(stats)}
      Farming Philosophy: ${philosophy}
      
      Output Format:
      Event: <short story about event>
      Option 1: <player choice 1>
      Option 2: <player choice 2>
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Error generating event with Gemini:', error);
        res.status(500).send('Error generating event');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
