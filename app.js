const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

const hostname = '127.0.0.1';
const port = 3002;
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.post('/resources', async (req, res) => {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const apiKey = process.env.API_KEY;
  const role = req.body.role;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: `Links to learning resources on ${role}. Return response in html list with a class "list-disc mb-2" and also include website name. All links should have a class of "text-cyan-100 hover:font-semibold", video links can be added.`,
      },
    ],
  };
  try {
    const response = await axios.post(endpoint, data, { headers });
    const result = response.data.choices[0].message.content;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.end(JSON.stringify(error));
  }
});

app.get('/', (req, res) => {
  res.send('Connected');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
