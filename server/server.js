import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const { ingredients } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: `Crea una receta con los siguientes ingredientes: ${ingredients}` }],
        max_tokens: 150
      })
    });

    const data = await response.json();
    console.log('Response from OpenAI API:', data);
    if (response.ok) {
        res.json({ recipe: data.choices[0].message.content });
      } else {
        res.status(response.status).json({ error: data });
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      res.status(500).json({ error: 'Error generating recipe' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
