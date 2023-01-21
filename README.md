`
docker run -v $(pwd)/saves:/data/saves sha256:689c1d8a0e8d02c9c1be99d0144236016a693cd929a7132eea3fde550a0a2061
`

`
docker buildx build . -t luckydye/minecraft-edge:1.19.3 --platform linux/amd64
docker push luckydye/minecraft-edge:1.19.3
`