import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestSendService {

  constructor(private http: HttpClient) { }

    //TODO: actually implement
    sendReq(req: any){

      return this.http.post<any>("http://localhost:1234/generate", {prompt: req})
        /*return new Observable(observer => {
            observer.next(req ?? 'No image selected')
        })*/
    }
}
