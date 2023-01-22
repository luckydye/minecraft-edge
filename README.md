## Build
`
docker buildx build . -t luckydye/minecraft-edge:1.19.3 --platform linux/amd64
docker push luckydye/minecraft-edge:1.19.3
`

## Run
`docker build . -t luckydye/minecraft-edge:1.19.3  && docker run -it -v $(pwd)/data/saves:/app/data/saves -p 25565:25565 luckydye/minecraft-edge:1.19.3`