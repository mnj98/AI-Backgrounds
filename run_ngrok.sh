#ngrok http 9999 --log=stdout >> /dev/null 
docker run --net=host -d -e NGROK_AUTHTOKEN=$(cat ngrok_token.txt) ngrok/ngrok:latest http 9999
