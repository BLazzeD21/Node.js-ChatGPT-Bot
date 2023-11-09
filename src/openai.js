
import { Configuration, OpenAIApi } from 'openai';
import config from 'config';

class OpenAI {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
  };

  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async chat(messages) {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    return response.data.choices[0].message;
  }

  async transcription(filepath) {
  }

  async getImage(text, size, count) {
    const response = await this.openai.createImage({
      prompt: text,
      n: count,
      size: size,
    });

    const imageUrl = response.data.data[0].url;

    return imageUrl;
  }
}

export const openai = new OpenAI(config.get('OPENAI_KEY'));
