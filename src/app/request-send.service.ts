import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

const url:string = "http://ai-backgrounds.ddns.net"

@Injectable({
  providedIn: 'root'
})
export class RequestSendService {

  constructor(private http: HttpClient) { }


    genImages(prompt_text: any, model: any, port: any, num_samples:any, steps:any){
      return this.http.post<any>(url+ "/generate-background", {prompt_text: prompt_text, model: model, num_samples: num_samples, steps: steps})
    }

    getTrainedModels(port: any){
      return this.http.get<any>(url + "/get-trained-models")
    }

    getGeneratedImages(port: any, model_id:any){
      return this.http.post<any>(url + "/get-generated-images", {model_id: model_id})
    }

    saveImages(port: any, model_id:any, images:any, prompt_text: any){
      return this.http.post<any>(url+ "/save-images", {model_id: model_id, images: images, prompt_text: prompt_text})
    }

    deleteImage(port: any, model_id:any, image_id:any){
      return this.http.post<any>(url + "/delete-image", {model_id: model_id, image_id: image_id})
    }
}
