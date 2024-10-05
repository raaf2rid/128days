import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Serve static files from the "public" folder
app.use(express.static('public'));

// Function to calculate days left until the wedding
function calculateDaysLeft() {
  const weddingDate = new Date('2025-02-9');
  const today = new Date();
  const timeRemaining = weddingDate - today;
  return Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)); // Convert to days
}

// Function to generate a wedding message using OpenAI's chat completion API
async function generateMessage(daysLeft) {
  const prompt = `Write a short, sweet, and romantic letter from Rafi to Saki, mentioning how many days are left until their wedding on February 10, 2025. Use ${daysLeft} to indicate the number of days left. Each message should focus on one or two memories or inside jokes from their relationship, such as how they started talking on Instagram and switched to WhatsApp, their trip to Naval, the red saree Rafi gave her, Rafi waiting for her during job interviews, or how Saki is always removing his blackheads. Incorporate Rafi's nicknames for Saki, 'Mayabi Komolota' and 'Plaabonnyo'. Include the significant line 'Apni dekhte prochondo beautiful.' Keep references to the fact that they still argue about Saki's early bedtime in the present tense. The tone should be lighthearted, funny, and romantic. Keep the message short and sweet (under 30 words), and don’t include a full stop at the end.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Make sure to use the correct model (e.g., 'gpt-4' or 'gpt-3.5-turbo')
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.choices[0].message.content.trim();

    return message;
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return 'Sorry, could not generate a message.';
  }
}

// API endpoint to serve the wedding message
app.get('/wedding-message', async (req, res) => {
  const daysLeft = calculateDaysLeft();
  const message = await generateMessage(daysLeft);

  // Send the message to the frontend
  res.json({ message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
