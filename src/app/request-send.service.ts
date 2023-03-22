import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestSendService {

  constructor(private http: HttpClient) { }

    //TODO: actually implement
    sendReq(prompt_text: any, model: any, port: any){
        return this.http.post<any>("http://localhost:" + port + "/generate-background", {prompt_text: prompt_text, model: model})
    }

    getTrainedModels(port: any){
      return this.http.get<any>("http://localhost:" + port + "/get-trained-models")
    }

    getGeneratedImages(port: any, model_id:any){
      return this.http.post<any>("http://localhost:" + port + "/get-generated-images", {model_id: model_id})
    }

    saveImage(port: any, model_id:any, image:any, prompt_text: any, rating: any){
      return this.http.post<any>("http://localhost:" + port + "/save-image", {model_id: model_id, image: image, prompt_text: prompt_text, rating: rating})
    }

    deleteImage(port: any, model_id:any, image_id:any){
      return this.http.post<any>("http://localhost:" + port + "/delete-image", {model_id: model_id, image_id: image_id})
    }
}
