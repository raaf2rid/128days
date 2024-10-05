import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // Load the OpenAI API key from .env

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  const prompt = "Write a fun message for a wedding announcement.";
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // You can use 'gpt-3.5-turbo' if you don't have access to GPT-4
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.choices[0].message.content.trim();
    
    // Log the generated message
    console.log("Generated message from OpenAI:", message);
  } catch (error) {
    console.error('Error with OpenAI API:', error);
  }
}

testOpenAI();
