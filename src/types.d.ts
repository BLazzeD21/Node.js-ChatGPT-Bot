interface Messages {
  role: 'assistant' | 'user',
  content: string,
}

interface Command {
  command: string,
  description: string,
}

interface RedisStore {
  host: string,
  port: string
}

interface Config {
  BOT_TOKEN: string,
  OPENAI_KEY: string,
  USERS_ID: string,
  SUPER_USER: string,
  REDIS_URL: string,
  PROXY_URL: string,
}

interface UpdateConfigValue {
  (updatedConfig: Config): Promise<void>,
}
