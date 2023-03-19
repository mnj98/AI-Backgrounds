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
}
