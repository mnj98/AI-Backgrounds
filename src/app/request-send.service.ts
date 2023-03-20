import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestSendService {

  constructor(private http: HttpClient) { }

    //TODO: actually implement
    sendReq(prompt: any, model: any, port: any){
        return this.http.post<any>("http://localhost:" + port + "/generate-background", {prompt: prompt, model: model})
    }

    getTrainedModels(port: any){
      return this.http.get<any>("http://localhost:" + port + "/get-trained-models")
    }

    getGeneratedImages(port: any, model_id:any){
      return this.http.post<any>("http://localhost:" + port + "/get-generated-images", {model_id: model_id})
    }
}
