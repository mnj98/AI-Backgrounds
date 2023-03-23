from flask import Flask, render_template, request, send_file
import os, json, cv2, base64, argparse, io, random
from flask_cors import CORS
from flask_mongoengine import MongoEngine
# from AI import run_ai
import numpy as np
from PIL import Image
import requests

app = Flask(__name__, static_folder=os.getcwd() + '/dist/ai-backgrounds/', static_url_path='')

app.config['MONGODB_SETTINGS'] = {
    'db': 'AI-Database',
    'host': 'localhost',
    'port': 27017
}

db = MongoEngine()
db.init_app(app)


class Model(db.Document):
    name = db.StringField()
    model_id = db.StringField(unique=True)
    embeds = db.FileField()
    thumbnail = db.StringField()
    generated_images = db.ListField(db.DictField())
    trained = db.BooleanField(default=False)

    def to_json(self):
        return {'name': self.name,
                'model_id': self.model_id,
                'embeds': self.embeds,
                'thumbnail': self.thumbnail,
                'generated_images': self.generated_images,
                'trained': self.trained}

    def __str__(self):
        return str(self.to_json())


CORS(app)

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--debug', action='store_true')
parser.add_argument('-g', '--gpu-host', required=True, action='store')
args = parser.parse_args()
print("go")


# TODO: actually check models
def supported_model(model_id):
    return len(Model.objects(model_id=model_id)) > 0


@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')


@app.route('/generate', methods=['GET'])
def gen_fallback():
    return render_template('index.html')


def map_images(image):
    return base64.b64encode(
        cv2.imencode('.jpg', cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR))[1]).decode()


def map_models(model):
    # print(model.thumbnail.read())
    model.thumbnail = base64.b64encode(
        cv2.imencode('.jpg', cv2.cvtColor(np.array(Image.open(io.BytesIO(model.thumbnail.read()))), cv2.COLOR_RGB2BGR))[
            1]).decode()
    model.generated_images = list(map(map_images, model.generated_images))
    return model


@app.get('/get-trained-models')
def gtm():
    # tm = list(map(map_models, Model.objects(trained=True)))
    print('getting trained models')
    return {'models': Model.objects(trained=True).only('name', 'model_id', 'thumbnail')}


@app.post('/generate-background')
def gen():
    print('run_ai')
    prompt_text = request.json['prompt_text']
    model_id = request.json['model']
    num_samples = request.json['num_samples']
    steps = request.json['steps']
    # model_id = 'test'

    if not supported_model(model_id): return ("Bad model", 404)

    if args.debug:
        images = [base64.b64encode(cv2.imencode('.jpg', cv2.imread('./src/assets/cookie.jpg'))[1]).decode() for i in
                  range(num_samples)]
    else:
        images = json.loads(requests.post(args.gpu_host + '/generate-background',
                                          json={'model_id': model_id, 'prompt_text': prompt_text,
                                                'num_samples': num_samples, 'steps': steps}).content.decode())['images']
    '''
    images = [base64.b64encode(cv2.imencode('.jpg', cv2.imread('./src/assets/cookie.jpg'))[1]).decode()] if args.debug \
        else json.loads(requests.post('http://localhost:9999/generate-background',
                                      json={'model_id': model_id, 'prompt_text': prompt_text,
                                            'num_samples': num_samples, 'steps': steps}).content.decode())['images']
    '''
    # print(json.loads(output))

    return {'prompt_text': prompt_text, 'images': images, 'steps': steps}


@app.post('/get-generated-images')
def get_gen_images():
    model_id = request.json['model_id']
    model = Model.objects(model_id=model_id).first()
    return {'output': model.generated_images}


@app.post('/save-images')
def save_images():
    model_id = request.json['model_id']
    images = request.json['images']
    prompt_text = request.json['prompt_text']

    model = Model.objects(model_id=model_id).first()
    model.update(
        add_to_set__generated_images=list(map(lambda image: {'image_id': str(random.random()), 'image': image['image'],
                                                             'prompt_text': prompt_text, 'rating': image['rating'],
                                                             'steps': image['steps']}, images)))
    return {"msg": 'ok!'}


@app.post('/delete-image')
def del_image():
    model = Model.objects(model_id=request.json['model_id']).first()
    for i, image in enumerate(model.generated_images):
        if image['image_id'] == request.json['image_id']:
            del model.generated_images[i]
            break
    model.save()
    return {'msg': "deleted :)"}


if __name__ == "__main__":
    print('Debug:', args.debug)

    # create and update new models manually
    #egg = Model(name='Spinach Omelette', model_id='egg', trained=True, thumbnail=base64.b64encode(cv2.imencode('.jpg', cv2.imread('src/assets/egg.jpg'))[1]).decode())
    #egg.embeds.put(open('models/egg.model', 'rb'), content_type='application/octet-stream', filename='egg.model')
    #egg.save()

    #egg = Model.objects().first()
    #egg.update(add_to_set__generated_images=[{'image_id':'egg1', 'image': base64.b64encode(cv2.imencode('.jpg', cv2.imread('src/assets/cookie.jpg'))[1]).decode()}])

    app.run(port=1235 if args.debug else 80, host='localhost' if args.debug else '192.168.0.20')
