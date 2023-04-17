import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Model} from "./home/home.component";
import {GeneratedImage, SavedImage} from "./gen-background/gen-background.component";

const url:string = environment.backend_url//"http://ai-backgrounds.ddns.net"

@Injectable({
  providedIn: 'root'
})
export class RequestSendService {

  constructor(private http: HttpClient) { }


    genImages(prompt_text: any, model_id: any, num_samples:any, steps:any){
      return this.http.post<{prompt_text: string, images: [string], steps: number, timeout: boolean}>(
          url+ "/generate-background", {
              prompt_text: prompt_text, model_id: model_id, num_samples: num_samples, steps: steps
          })
    }

    getTrainedModels(){
      return this.http.get<{models: [Model]}>(url + "/get-trained-models")
    }

    getGeneratedImages(model_id:any){
      return this.http.post<{output: [SavedImage]}>(url + "/get-generated-images", {model_id: model_id})
    }

    saveImages(model_id:any, images:any, prompt_text: any){
      return this.http.post<void>(url+ "/save-images", {model_id: model_id, images: images, prompt_text: prompt_text})
    }

    deleteImage(model_id:any, image_id:any){
      return this.http.post<void>(url + "/delete-image", {model_id: model_id, image_id: image_id})
    }

    debug_fallback(){

    }
}
