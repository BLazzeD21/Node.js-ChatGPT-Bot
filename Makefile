build:
	docker build -t chatgpt .

run:
	docker run -d -p 3000:3000 --name chatgpt --rm chatgpt