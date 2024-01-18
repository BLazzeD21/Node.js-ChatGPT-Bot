import axios from 'axios';
import installer from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

import { createWriteStream } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { deleteFile } from './utils/deleteFile.js';

const __dirname: string = dirname(fileURLToPath(import.meta.url));

class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  public async toMp3(input: string, output: string) {
    try {
      const outputPath = resolve(
          __dirname,
          '..',
          dirname(input),
          `${output}.mp3`,
      );

      return new Promise((resolve, reject) => {
        ffmpeg(input)
            .inputOption('-t 30')
            .output(outputPath)
            .on('end', () => {
              deleteFile(input);
              resolve(outputPath);
            })
            .on('error', (error: Error) => reject(error.message))
            .run();
      });
    } catch (error) {
      console.log('Error create:' + error.message);
    }
  }

  public async create(url: string, filename: string) {
    try {
      const oggPath: string = resolve(__dirname, 'voices', `${filename}.ogg`);
      const response = await axios.get(url, {
        responseType: 'stream',
      });
      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on('finish', () => resolve(oggPath));
      });
    } catch (error) {
      console.log('Error create:' + error.message);
    }
  }
}

export const converter = new OggConverter();
