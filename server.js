import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Keep your key secret
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; // <-- replace with your key

app.post('/story', async (req, res) => {
  const { prompt, choiceHistory } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a story generator for a text adventure game.' },
          { role: 'user', content: `Current story: ${choiceHistory.join(' -> ')} Prompt: ${prompt}` }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    res.json({ story: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
