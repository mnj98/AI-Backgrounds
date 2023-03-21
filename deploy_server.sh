ng build --configuration="development" --build-optimizer

ln -sf $(pwd)/dist/ai-backgrounds/index.html templates/index.html

python server.py $1
