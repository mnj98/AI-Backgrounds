import os
import torch

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


repo_id_embeds = "sd-concepts-library/cookiesmore" #@param {type:"string"}


embeds_url = "" #Add the URL or path to a learned_embeds.bin file in case you have one
placeholder_token_string = "" #Add what is the token string in case you are uploading your own embed

downloaded_embedding_folder = "./downloaded_embedding"
if not os.path.exists(downloaded_embedding_folder):
    os.mkdir(downloaded_embedding_folder)
if(not embeds_url):
    embeds_path = hf_hub_download(repo_id=repo_id_embeds, filename="learned_embeds.bin")
    token_path = hf_hub_download(repo_id=repo_id_embeds, filename="token_identifier.txt")
    os.system("cp " + embeds_path + " " + downloaded_embedding_folder)
    os.system("cp " + token_path + " " + downloaded_embedding_folder)
    with open(f'{downloaded_embedding_folder}/token_identifier.txt', 'r') as file:
        placeholder_token_string = file.read()
else:
    os.system("wget -q -O " + downloaded_embedding_folder + "/learned_embeds.bin " + embeds_url)

learned_embeds_path = f"{downloaded_embedding_folder}/learned_embeds.bin"


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

prompt = "a photo of <cookie-photo> inside a pretty french bakery" #@param {type:"string"}

num_samples = 4 #@param {type:"number"}
num_rows = 2 #@param {type:"number"}

all_images = []
for _ in range(num_rows):
    images = pipe(prompt, num_images_per_prompt=num_samples, num_inference_steps=100, guidance_scale=9.5).images
    all_images.extend(images)

grid = image_grid(all_images, num_samples, num_rows)
grid.save("output.jpg")
print(grid)

