import os, cv2
import numpy as np
import torch, base64

from flask import Flask, render_template, request, send_file
'''
app = Flask(__name__)

@app.post('/generate-background')
def gen():
    print(request.json)
    model_id = request.json['model_id']
    prompt = request.json['prompt']
    return {'output': run_ai(model_id, prompt)}

app.run(port=9999)
'''
import PIL
from huggingface_hub import hf_hub_download

from PIL import Image

from diffusers import StableDiffusionPipeline
from transformers import CLIPFeatureExtractor, CLIPTextModel, CLIPTokenizer

from transformers import CLIPTokenizer, CLIPConfig,CLIPModel,CLIPTextConfig


def image_grid(imgs, rows, cols):
    assert len(imgs) == rows*cols

    w, h = imgs[0].size
    grid = Image.new('RGB', size=(cols*w, rows*h))
    grid_w, grid_h = grid.size

    for i, img in enumerate(imgs):
        grid.paste(img, box=(i%cols*w, i//cols*h))
    return grid


pretrained_model_name_or_path = "CompVis/stable-diffusion-v1-4" #@param {type:"string"}

def load_learned_embed_in_clip(learned_embeds_path, text_encoder, tokenizer, token=None):
    loaded_learned_embeds = torch.load(learned_embeds_path, map_location="cpu")

    trained_token = list(loaded_learned_embeds.keys())[0]
    embeds = loaded_learned_embeds[trained_token]


    dtype = text_encoder.get_input_embeddings().weight.dtype
    embeds.to(dtype)


    token = token if token is not None else trained_token
    num_added_tokens = tokenizer.add_tokens(token)
    if num_added_tokens == 0:
        raise ValueError(f"The tokenizer already contains the token {token}. Please pass a different `token` that is not already in the tokenizer.")

    text_encoder.resize_token_embeddings(len(tokenizer))

    token_id = tokenizer.convert_tokens_to_ids(token)
    text_encoder.get_input_embeddings().weight.data[token_id] = embeds


#TODO: implement for new models ... will not get called with current setup
def fetch_embeds(model):
    return './models/egg.model'


def setup_pipeline(model):
    if (model + '.model') not in os.listdir('./models'):
        learned_embeds_path = fetch_embeds(model)
    else: learned_embeds_path = f'./models/{model}.model'

    tokenizer = CLIPTokenizer.from_pretrained("openai/clip-vit-large-patch14")
    model = CLIPModel.from_pretrained("openai/clip-vit-large-patch14")

    config = CLIPTextConfig.from_pretrained("openai/clip-vit-large-patch14")
    config.attention_type = "custom"
    config.custom_attention_config = {
        "num_heads": 8,
        "head_dim": 64,
        "dropout": 0.1
    }


    model.config = config


    tokenizer = CLIPTokenizer.from_pretrained("openai/clip-vit-large-patch14", model_max_length=model.config.max_position_embeddings)

    text_encoder = CLIPTextModel.from_pretrained(
        pretrained_model_name_or_path, subfolder="text_encoder", torch_dtype=torch.float16
    )

    load_learned_embed_in_clip(learned_embeds_path, text_encoder, tokenizer)

    pipe = StableDiffusionPipeline.from_pretrained(
        pretrained_model_name_or_path,
        torch_dtype=torch.float16,
        text_encoder=text_encoder,
        tokenizer=tokenizer,
    ).to('cuda')

    return pipe





def run_ai(model, prompt, shape=(1,1)):
    print("AI")
    pipe = setup_pipeline(model)
    num_samples = shape[0] #@param {type:"number"}
    num_rows = shape[1] #@param {type:"number"}

    all_images = []
    for _ in range(num_rows):
        images = pipe(prompt, num_images_per_prompt=num_samples, num_inference_steps=1, guidance_scale=9.5).images
        all_images.extend(images)

    grid = image_grid(all_images, num_samples, num_rows)
    #grid.save("output.jpg")
    grid = cv2.imencode('.jpg', cv2.cvtColor(np.array(grid), cv2.COLOR_RGB2BGR))[1]
    return base64.b64encode(grid).decode()
    #return grid


app = Flask(__name__)
@app.post('/generate-background')
def gen():
    print(request.json)
    model_id = request.json['model_id']
    prompt = request.json['prompt']
    return {'output': run_ai(model_id, prompt)}
app.run(port=9999)
