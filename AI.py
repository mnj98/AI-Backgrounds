import cv2, io, torch, base64
import numpy as np

from flask import Flask, request

from diffusers import StableDiffusionPipeline
from transformers import CLIPTextModel

from transformers import CLIPTokenizer, CLIPModel, CLIPTextConfig


pretrained_model_name_or_path = "CompVis/stable-diffusion-v1-4"


def load_learned_embed_in_clip(model_path, text_encoder, tokenizer, token=None):
    loaded_learned_embeds = torch.load(model_path, map_location="cpu")

    trained_token = list(loaded_learned_embeds.keys())[0]
    embeds = loaded_learned_embeds[trained_token]

    dtype = text_encoder.get_input_embeddings().weight.dtype
    embeds.to(dtype)

    token = token if token is not None else trained_token
    num_added_tokens = tokenizer.add_tokens(token)
    if num_added_tokens == 0:
        raise ValueError(
            f"The tokenizer already contains the token {token}. Please pass a different `token` that is not already in the tokenizer.")

    text_encoder.resize_token_embeddings(len(tokenizer))

    token_id = tokenizer.convert_tokens_to_ids(token)
    text_encoder.get_input_embeddings().weight.data[token_id] = embeds


def setup_pipeline(embeds):
    model = CLIPModel.from_pretrained("openai/clip-vit-large-patch14")

    config = CLIPTextConfig.from_pretrained("openai/clip-vit-large-patch14")
    config.attention_type = "custom"
    config.custom_attention_config = {
        "num_heads": 8,
        "head_dim": 64,
        "dropout": 0.1
    }

    model.config = config

    tokenizer = CLIPTokenizer.from_pretrained("openai/clip-vit-large-patch14",
                                              model_max_length=model.config.max_position_embeddings)

    text_encoder = CLIPTextModel.from_pretrained(
        pretrained_model_name_or_path, subfolder="text_encoder", torch_dtype=torch.float16
    )

    load_learned_embed_in_clip(embeds, text_encoder, tokenizer)

    pipe = StableDiffusionPipeline.from_pretrained(
        pretrained_model_name_or_path,
        torch_dtype=torch.float16,
        text_encoder=text_encoder,
        tokenizer=tokenizer,
    ).to('cuda')

    return pipe


def run_ai(embeds, prompt_text, num_samples=1, steps=100):
    print("AI")
    pipe = setup_pipeline(embeds)

    all_images = []
    images = pipe(prompt_text, num_images_per_prompt=num_samples, num_inference_steps=steps, guidance_scale=9.5).images
    all_images.extend(images)

    images = list(
        map(lambda image: cv2.imencode('.jpg', cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR))[1], all_images))
    return list(map(lambda image: base64.b64encode(image).decode(), images))


app = Flask(__name__)


@app.post('/generate-background')
def gen():
    prompt_text = request.json['prompt_text']
    print(prompt_text)
    num_samples = request.json['num_samples']
    steps = request.json['steps']
    embeds = io.BytesIO(base64.b64decode(request.json['embeds']))
    return {'images': run_ai(embeds, prompt_text, num_samples=num_samples, steps=steps)}


app.run(port=9999)
