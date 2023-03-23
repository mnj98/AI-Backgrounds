ng build --configuration="local-development" --build-optimizer

ln -sf $(pwd)/dist/ai-backgrounds/index.html templates/index.html

python server.py -d -b "localhost" -p=1234
