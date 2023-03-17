from flask import Flask,render_template, request, send_file
import os, json, cv2, base64
from flask_cors import CORS
app = Flask(__name__, static_folder=os.getcwd() + '/dist/ai-backgrounds/', static_url_path='')

from AI import run_ai

CORS(app)

#TODO: actually check models
def supported_model(model):
    return True




@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')

@app.post('/generate')
def gen():
    prompt = request.json['prompt']
    model = request.json['model']

    if not supported_model(model): return ("Bad model", 404)

    output = run_ai(model, prompt)

    return {'prompt': prompt, 'output': base64.b64encode(output).decode()}#'{"prompt": "' + prompt + '"}'


if __name__=="__main__":
    app.run(port='1234')
