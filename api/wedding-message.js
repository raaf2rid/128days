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
  const hour = new Date().getHours();
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

function generateDynamicPromptBasedOnTimeAndDaysLeft(daysLeft) {
  const timeOfDay = getCurrentTimeOfDay();

  if (timeOfDay === "morning") {
    return `
      Write a short, loving message from Rafi to Saki, under 50 words. 
      Mention how Saki sleeps early and how they often fight about it. 
      Rafi calls Saki 'Mayabi Komolota' and 'Plaabonnyo' as nicknames. 
      End with the phrase "And lastly, Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Make it funny, light, and affectionate with a morning vibe
    `;
  } else if (timeOfDay === "afternoon") {
    return `
      Write a playful, sweet message from Rafi to Saki, under 50 words. 
      Mention how Saki sleeps early, and Rafi is waiting to talk with her later. 
      Rafi calls Saki 'Mayabi Komolota' and 'Plaabonnyo' as loving nicknames. 
      Include the line "O Plabonnyo, Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Keep the tone playful and affectionate with an afternoon feel
    `;
  } else if (timeOfDay === "evening") {
    return `
      Write a warm, loving message from Rafi to Saki, under 50 words. 
      Mention how Saki will sleep soon, and Rafi wishes they could talk all night. 
      Rafi calls Saki 'Mayabi Komolota' and 'Plaabonnyo' as loving nicknames. 
      Use the line "I will never stop saying that Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Make it romantic and thoughtful with an evening feel
    `;
  } else {
    return `
      Write a sweet, late-night message from Rafi to Saki, under 50 words. 
      Mention how Rafi is staying up late thinking about their future together, while Saki has gone to bed early. 
      Rafi calls Saki 'Mayabi Komolota' and 'Plaabonnyo' as loving nicknames. 
      End the message with "R haa... Apni dekhte Prochondo Beautiful."
      Also mention there are ${daysLeft} days left until their wedding. 
      Make it dreamy and romantic with a late-night tone
    `;
  }
}


// Function to generate a wedding message using OpenAI's chat completion API
async function generateMessage(daysLeft) {
  const prompt = generateDynamicPromptBasedOnTimeAndDaysLeft(daysLeft)
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
