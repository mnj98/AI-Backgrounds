sudo docker run  --gpus 'all,"capabilities=compute,utility"' -d --restart=always -p 9999:9999 --name=ai ai-backgrounds:latest
