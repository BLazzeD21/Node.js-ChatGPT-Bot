build:
	docker build -t chatgpt-bot .

run:
	docker run --restart=unless-stopped -d -p 3000:3000 --name chatgpt-bot chatgpt-bot
