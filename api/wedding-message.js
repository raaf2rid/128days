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

function getCurrentTimeOfDay() {
  const now = new Date();
  const bdTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); // Adjusting for UTC+6
  const hour = bdTime.getUTCHours(); // Getting hours in the adjusted timezone

  if (hour >= 5 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 17) {
    return "afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "evening";
  } else {
    return "late night";
  }
}


function getRandomNickname() {
  const names = ['Mayabi Komolota', 'Plaabonnyo', 'Saki'];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

function generateDynamicPromptBasedOnTimeAndDaysLeft(daysLeft) {
  const timeOfDay = getCurrentTimeOfDay();
  const nickname = getRandomNickname();
  const randomTopic = getRandomTopic(); // Adds variety to the message

  if (timeOfDay === "morning") {
    return `
      Write a short, loving message from Rafi to ${nickname}, under 50 words. 
      Do not use possessive terms like 'my,' or add words like 'dear' or 'Hey.' 
      ${randomTopic}
      End with the phrase "And lastly, Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Make it funny, light, and affectionate with a morning vibe.
    `;
  } else if (timeOfDay === "afternoon") {
    return `
      Write a playful, sweet message from Rafi to ${nickname}, under 50 words. 
      Do not use possessive terms or casual greetings like 'Hey,' or words like 'dear.' 
      ${randomTopic}
      Include the line "O ${nickname}, Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Keep the tone playful and affectionate with an afternoon feel.
    `;
  } else if (timeOfDay === "evening") {
    return `
      Write a warm, loving message from Rafi to ${nickname}, under 50 words. 
      Do not use possessive terms or casual greetings like 'Hey,' or words like 'dear.' 
      ${randomTopic}
      Use the line "I will never stop saying that Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Make it romantic and thoughtful with an evening feel.
    `;
  } else {
    return `
      Write a sweet, late-night message from Rafi to ${nickname}, under 50 words. 
      Do not use possessive terms or casual greetings like 'Hey,' or words like 'dear.' 
      ${randomTopic}
      End the message with "R haa... Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Make it dreamy and romantic with a late-night tone.
    `;
  }
}

// Helper function to add variety in topics
function getRandomTopic() {
  const topics = [
    "She loves plants and trees, and I adore how she cares for them.",
    "She is always captivated by my music, and I can’t wait to play another tune for her.",
    "I am still waiting to see her in the red saree I gave her.",
    "I remember our initial DC Hill dates, the way we connected there is unforgettable.",
    "We can’t wait for Sadi to get married, so that we can tie the knot ourselves.",
    "I'll give her the 'Bala' soon, she’s been waiting for it for so long.",
    "Her skincare obsession is something we joke about, but she takes it seriously.",
    "It's so painful when she removes my blackheads, but I let her do it.",
    "I miss her old way of wearing the hijab; it had a unique charm.",
    "I want to spend two years alone with her before we become parents. Two years of love, adventure, and togetherness.",
    "Being alone at night devastates me. I can't wait for the day when she will live with me, and I’ll be able to cuddle her every night.",
    "I will wait for her again, like I did when she was at her Kenpark and Jay Jay Mills interviews.",
    "I’ll stand with two hawai mithai in hand, waiting for her, just like before.",
    "From Piccolo to Zocalo, our love grew stronger with every moment."
  ];

  const randomIndex = Math.floor(Math.random() * topics.length);
  return topics[randomIndex];
}



// Function to generate a wedding message using OpenAI's chat completion API
async function generateMessage(daysLeft) {
  const prompt = generateDynamicPromptBasedOnTimeAndDaysLeft(daysLeft)
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
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
app.get('/api/wedding-message', async (req, res) => {
  const daysLeft = calculateDaysLeft();
  const message = await generateMessage(daysLeft);

  // Send the message to the frontend
  res.json({ message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
