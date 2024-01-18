## We need to create two files

First file `default.json` with code:

```json
{
    "BOT_TOKEN": "Telegram token",
    "OPENAI_KEY": "OpenAI Key",
    "USERS_ID": "User IDs separated by commas without spaces",
    "SUPER_USER": "ID",
    "REDIS_URL": "redis://127.0.0.1:6379/1",
    "PROXY_URL": "http://user:password@host:port"
}
```

Second file `production.json` with code:

```json
{
    "BOT_TOKEN": "Telegram token",
    "OPENAI_KEY": "OpenAI Key",
    "USERS_ID": "User IDs separated by commas without spaces",
    "SUPER_USER": "ID",
    "REDIS_URL": "redis://127.0.0.1:6379/1",
    "PROXY_URL": "http://user:password@host:port"
}
```



Telegram token you can get in [BotFather](https://t.me/BotFather)

Secret API key from openai you can get in [API keys](https://platform.openai.com/account/api-keys)

Redis `redis[s]://[[username][:password]@][host][:port][/db-number]`

