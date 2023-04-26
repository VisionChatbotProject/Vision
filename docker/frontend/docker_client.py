import docker

docker_client = docker.DockerClient(base_url='unix://var/run/docker.sock')
docker_client.containers.get("vision-chatbot-agent").restart()