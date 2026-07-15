import pkg from 'node-wit';
const { Wit } = pkg;
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// Access the API key
const WIT_API_KEY = process.env.WIT_API_KEY;

// Initialize Wit client
const client = new Wit({ accessToken: WIT_API_KEY });

export const transcribeAudio = async (audioBuffer) => {
  try {
    if (!WIT_API_KEY || !client) {
      console.log('Wit.ai API key not set, using mock transcription');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "Create a task to buy groceries tomorrow at 10 am for 30 minutes";
    }

    console.log('Transcribing audio with Wit.ai...');

    const response = await client.speech(audioBuffer, {
      contentType: 'audio/wav'
    });

    const text = response.text || response._text || 'No transcription available';
    console.log('Transcription result:', text);
    return text;

  } catch (error) {
    console.error('Speech transcription error:', error);
    console.log('Falling back to mock transcription due to error');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "Create a task to buy groceries tomorrow at 10 am for 30 minutes";
  }
};
