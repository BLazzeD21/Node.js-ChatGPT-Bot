import { OpenAI } from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";
import config from "config";
import { createReadStream } from "fs";

class OpenAIApi {
  private openai: OpenAI;

  public roles = {
    ASSISTANT: "assistant",
    USER: "user",
    SYSTEM: "system",
  };

  public models = {
    generateText: "gpt-3.5-turbo-1106",
    transcription: "whisper-1",
    createImages: "dall-e-2",
  };

  constructor(apiKey: string, proxyUrl: string) {
    this.openai = new OpenAI({
      maxRetries: 0,
      apiKey: apiKey,
      httpAgent: new HttpsProxyAgent(proxyUrl),
    });
  }

  public async chat(messages: Messages[]) {
    const response = await this.openai.chat.completions.create({
      messages,
      model: this.models.generateText,
    });

    return response.choices[0].message;
  }

  public async transcription(filepath: string) {
    const response = await this.openai.audio.transcriptions.create({
      file: createReadStream(filepath),
      model: this.models.transcription,
    });
    return response.text;
  }

  public async getImage(text: string, size: "1024x1024" | "512x512", count: number) {
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

export const openai: OpenAIApi = new OpenAIApi(
  config.get("OPENAI_KEY"),
  config.get("PROXY_URL")
);
