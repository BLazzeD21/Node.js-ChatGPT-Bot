build:
	docker build -t chatgpt .

run:
	docker run --restart=unless-stopped -d -p 3000:3000 --name chatgpt chatgpt