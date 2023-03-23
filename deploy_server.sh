ng build --configuration="development" --build-optimizer

ln -sf $(pwd)/dist/ai-backgrounds/index.html templates/index.html

sudo python3 server.py -g $1 -h "192.169.0.20" -p 80
