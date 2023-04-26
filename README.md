### If you want to deploy this bot on your VPS server, then here is the instruction

Open a terminal on the server. First, we synchronize the apt package database and install the necessary
dependencies:

`sudo apt-get update`

`sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release`

Next, import the GPG key for the docker repository:

`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg`

Now let's add a new repository to the apt list:

`echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`

Now you can install docker:

`sudo apt-get install docker-ce docker-ce-cli containerd.io`

You can check if docker is installed correctly:

`docker --help`

Go to the bot repository:

`cd name`

Now let's start the bot:

`make build`<br>`make run`

All tests were carried out on a VPS server with an Ubuntu 20.04.5 LTS (GNU/Linux 5.4.0-135-generic x86_64) operating
system
