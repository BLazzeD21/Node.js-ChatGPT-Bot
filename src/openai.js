import { Configuration, OpenAIApi } from "openai"
import config from 'config'

class OpenAI {
    roles = {
        ASSISTANT: 'assistant',
        USER: 'user',
        SYSTEM: 'system',
    }

    constructor(apiKey) {
        const configuration = new Configuration({
            apiKey,
          });
        this.openai = new OpenAIApi(configuration);
    }
        
    async chat(messages) {
        try {
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages
            })

            return response.data.choices[0].message
            
        } catch (error) {
            console.log('Error getting response')
        }
    }
}

export const openai = new OpenAI(config.get('OPENAI_KEY'))