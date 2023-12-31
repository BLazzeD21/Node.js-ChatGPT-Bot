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

  models = {
    generateText: 'gpt-3.5-turbo-1106',
    transcription: 'whisper-1',
    createImages: 'dall-e-2',
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
      model: this.models.generateText,
    });

    return response.choices[0].message;
  }

  async transcription(filepath) {
    const response = await this.openai.audio.transcriptions.create({
      file: createReadStream(filepath),
      model: this.models.transcription,
    });
    return response.text;
  }

  async getImage(text, size, count) {
    const response = await this.openai.images.generate({
      model: this.models.createImages,
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
