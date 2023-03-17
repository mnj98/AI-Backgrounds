import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestSendService {

  constructor(private http: HttpClient) { }

    //TODO: actually implement
    sendReq(prompt: any, model: any){

      return this.http.post<any>("http://localhost:1234/generate", {prompt: prompt, model: model})
        /*return new Observable(observer => {
            observer.next(req ?? 'No image selected')
        })*/
    }
}
