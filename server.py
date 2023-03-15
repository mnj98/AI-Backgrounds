from flask import Flask,render_template, request, send_file
import os, json, cv2, base64, threading, queue, random
from flask_cors import CORS
app = Flask(__name__, static_folder=os.getcwd() + '/dist/ai-backgrounds/', static_url_path='')

from AI import run_ai

CORS(app)


#events = queue.Queue()

#for i in range 30:
    #events.put(threading.Event())
request_queue = queue.Queue()
results = dict()
results_lock = threading.Lock()

ready = threading.Event()

ai_thread = threading.Thread(target=run_ai, args=(request_queue, results, results_lock, ready,))
ai_thread.start()
ready.wait()





@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')

@app.post('/generate')
def gen():
    for k in request.json.keys():
        print(k)
    #print(request.args.keys)
    prompt = request.json['prompt']
    #output = cv2.imencode('.jpg', cv2.imread('src/assets/leaf.jpg'))[1]
    done_event = threading.Event()
    id = random.random()
    request_queue.put({'id': id, 'prompt': prompt, 'event': done_event})
    done_event.wait()
    with results_lock:
        res = results.pop(id)
        del done_event


    output = res['output']

    return {'prompt': prompt, 'output': base64.b64encode(output).decode()}#'{"prompt": "' + prompt + '"}'


if __name__=="__main__":
    app.run(port='1234')
