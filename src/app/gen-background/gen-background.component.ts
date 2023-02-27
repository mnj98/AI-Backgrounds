import { Component } from '@angular/core';
import {RequestSendService} from "../request-send.service";

@Component({
  selector: 'app-gen-background',
  templateUrl: './gen-background.component.html',
  styleUrls: ['./gen-background.component.css']
})
export class GenBackgroundComponent {


    image!: File

    constructor(private req_service: RequestSendService) {}


    onFileChanged(event: any){
        this.image = event.target.files[0]

    }

    onUpload(){
        this.req_service.sendReq(this.image).subscribe(console.log)

    }
}
