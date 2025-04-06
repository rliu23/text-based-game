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
    const { stats, philosophy, history } = req.body;

    const basePrompt = `
    You are a farming simulator AI. You help simulate a farm based on the player's actions.

    Player Stats: ${JSON.stringify(stats)}
    Next step: ${philosophy}
  `;

    const historyPrompt = history && history.length > 0
        ? `
    Past Choices: ${history.join('; ')}

    First, evaluate the player's last decision:
    - Was it a good or bad choice based on sustainable farming practices and their philosophy / next step?
    - Write 1-2 sentences describing the consequence (good or bad).

    Then, continue the farm story and present two new decisions.

    Format the output EXACTLY like this:

    Consequence: <consequence of last choice>

    Event: <new short story>

    Option 1: <choice 1>
    Option 2: <choice 2>
    Option 3: <choice 3> (optional, you can provide only 2 options if you prefer)
    `
        : `
    Start the simulation: Describe a short farming story and give 2 short choices.

    Show how the stats will change based on the player's decisions.

    Format the output EXACTLY like this:

    Event: <short story>

    Option 1: <choice 1>
    Option 2: <choice 2>
    Option 3: <choice 3> (optional, you can provide only 2 options if you prefer)
    `;

    const prompt = basePrompt + historyPrompt;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Error generating event with Gemini:', error);
        res.status(500).send('Error generating event');
    }
});

app.post('/evaluate-choice', async (req, res) => {
    let { choice, stats, philosophy } = req.body;

    const prompt = `
You are a farming simulator AI.

The player made the following choice: "${choice}"
Their farming philosophy is: ${philosophy}
Their current stats are: ${JSON.stringify(stats)}

Your job:

1. Judge whether the player's decision was good or bad for sustainable farming.
2. Write exactly 1-2 sentences describing the consequence of the choice.

3. Then update the stats like this:
  - If the choice mentions buying or purchasing, subtract the **exact amount of gold** mentioned in the choice.
  - If the choice mentions selling, add the **exact amount of gold** mentioned.
  - If the choice mentions feeding cows, increase or decrease **number of cows** depending on whether food was good or bad.
  - If the choice mentions harvesting, add or subtract **amounts of wheat** mentioned.

⚡ Rules:
- Always use exact numbers mentioned in the choice.
- If no numbers are mentioned, assume small changes: +/-5 wheat, +/-10 gold, +/-1 cow.
- Return updated player stats in JSON format.

⚡ Output EXACTLY in this format:

Consequence: <short consequence sentence>

New Stats: <updated player stats in JSON format>
`;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini full response:', text);

        // Parse the output to extract Consequence and New Stats
        const consequenceMatch = text.match(/Consequence:\s*(.*)/);
        const newStatsMatch = text.match(/New Stats:\s*({.*})/s);

        const consequence = consequenceMatch ? consequenceMatch[1].trim() : 'No consequence.';
        const newStatsString = newStatsMatch ? newStatsMatch[1] : '{}';
        const newStats = JSON.parse(newStatsString); // Parse JSON from Gemini

        res.json({ consequence, newStats });

    } catch (error) {
        console.error('Error evaluating choice with Gemini:', error);
        res.status(500).send('Error evaluating choice');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});