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
  const randomTopic = getRandomTopic(); // Choose between early sleep, future travels, wedding anticipation, etc.

  if (timeOfDay === "morning") {
    return `
      Write a short, loving message from Rafi to ${nickname}, under 50 words. 
      Do not use possessive terms like 'my' or add words like 'dear.' 
      ${randomTopic}
      End with the phrase "And lastly, Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Make it funny, light, and affectionate with a morning vibe.
    `;
  } else if (timeOfDay === "afternoon") {
    return `
      Write a playful, sweet message from Rafi to ${nickname}, under 50 words. 
      Do not use possessive terms or words like 'dear.' 
      ${randomTopic}
      Include the line "O ${nickname}, Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Keep the tone playful and affectionate with an afternoon feel.
    `;
  } else if (timeOfDay === "evening") {
    return `
      Write a warm, loving message from Rafi to ${nickname}, under 50 words. 
      Do not use possessive terms or words like 'dear.' 
      ${randomTopic}
      Use the line "I will never stop saying that Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Make it romantic and thoughtful with an evening feel.
    `;
  } else {
    return `
      Write a sweet, late-night message from Rafi to ${nickname}, under 50 words. 
      Do not use possessive terms or words like 'dear.' 
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
    "She loves plants and trees. 🌿",
    "She loves my music, and I can't wait to sing for her again. 🎶",
    "I am waiting to see her in the red saree again. ❤️",
    "Remember our early dates at DC Hill? Those were magical times. 🌄",
    "We can't wait for Sadi to get married so we can start our journey together. 💍",
    "I'll give her the Bala soon, I promise. 💫",
    "Her skincare obsession makes me smile. 😄",
    "It's painful when she removes my blackheads, but she makes me look good. 😂",
    "I miss her old way of wearing hijab, it was beautiful. 🧕",
    "I want two beautiful years together before we become parents. 👶",
    "Being alone at night is tough... I can't wait to cuddle her every night. 🤗",
    "I'll wait for her again, like I did during her Kenpark and Jay Jay Mills interviews. ⏳",
    "I'll be standing with two hawai mithai just for her. 🍬",
    "From Piccolo to Zocalo, our love has grown. ❤️",
  ];

  // Randomly pick a topic
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
