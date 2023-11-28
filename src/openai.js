import { OpenAI } from 'openai';

import { HttpsProxyAgent } from 'https-proxy-agent';
import config from 'config';
import { createReadStream } from 'fs';

class OpenAIApi {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
  };

  constructor(apiKey, proxyUrl) {
    this.openai = new OpenAI({
      maxRetries: 0,
      apiKey: apiKey,
      httpAgent: new HttpsProxyAgent(proxyUrl),
    });
  }

  async chat(messages) {
    const response = await this.openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo',
    });

    return response.choices[0].message;
  }

  async transcription(filepath) {
    const response = await this.openai.audio.transcriptions.create({
      file: createReadStream(filepath),
      model: 'whisper-1',
    });
    return response.text;
  }

  async getImage(text, size, count) {
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: text,
      n: count,
      size: size,
    });

    const imageUrl = response.data[0].url;

    return imageUrl;
  }
}

export const openai = new OpenAIApi(
    config.get('OPENAI_KEY'),
    config.get('PROXY_URL'),
);
