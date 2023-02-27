import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RequestSendService {

  constructor() { }

    //TODO: actually implement
    sendReq(req: any){
        return new Observable(observer => {
            observer.next(req ?? 'No image selected')
        })
    }
}
