import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";

const url:string = environment.backend_url//"http://ai-backgrounds.ddns.net"

@Injectable({
  providedIn: 'root'
})
export class RequestSendService {

  constructor(private http: HttpClient) { }


    genImages(prompt_text: any, model_id: any, num_samples:any, steps:any){
      return this.http.post<any>(url+ "/generate-background", {prompt_text: prompt_text, model_id: model_id, num_samples: num_samples, steps: steps})
    }

    getTrainedModels(){
      return this.http.get<any>(url + "/get-trained-models")
    }

    getGeneratedImages(model_id:any){
      return this.http.post<any>(url + "/get-generated-images", {model_id: model_id})
    }

    saveImages(model_id:any, images:any, prompt_text: any){
      return this.http.post<any>(url+ "/save-images", {model_id: model_id, images: images, prompt_text: prompt_text})
    }

    deleteImage(model_id:any, image_id:any){
      return this.http.post<any>(url + "/delete-image", {model_id: model_id, image_id: image_id})
    }
}
