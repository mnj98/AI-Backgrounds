from flask import Flask,render_template, request, send_file
import os, json, cv2, base64, argparse
from flask_cors import CORS
app = Flask(__name__, static_folder=os.getcwd() + '/dist/ai-backgrounds/', static_url_path='')

from AI import run_ai

CORS(app)

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--debug', action='store_true')
args = parser.parse_args()
print("go")

#TODO: actually check models
def supported_model(model):
    return True




@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')

@app.post('/generate-background')
def gen():
    print('run_ai')
    prompt = request.json['prompt']
    model = request.json['model']

    if not supported_model(model): return ("Bad model", 404)

    output = cv2.imencode('.jpg', cv2.imread('./src/assets/cookie.jpg'))[1] if args.debug \
        else run_ai(model, prompt, args.debug)

    return {'prompt': prompt, 'output': base64.b64encode(output).decode()}


if __name__=="__main__":
    print('Debug:', args.debug)
    app.run(port='1235' if args.debug else '1234')
