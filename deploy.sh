ng build --configuration="production" --build-optimizer

ln -sf $(pwd)/dist/ai-backgrounds/index.html templates/index.html

python server.py
