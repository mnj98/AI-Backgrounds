import { Component } from '@angular/core';
import {RequestSendService} from "../request-send.service";

@Component({
  selector: 'app-gen-background',
  templateUrl: './gen-background.component.html',
  styleUrls: ['./gen-background.component.css']
})
export class GenBackgroundComponent {


    image

    constructor(private req_service: RequestSendService) {}


    onFileChanged(event: any){
        if(event.target.files
            && event.target.files.length > 0
            && event.target.files[0].type.includes('image')){
            let file = new FileReader()
            file.readAsDataURL(event.target.files[0])
            file.onload = () => {
                this.image = {as_file: file.result, original: event.target.files[0]}
            }

        }


    }

    onUpload(){
        this.req_service.sendReq(this.image).subscribe(console.log)

    }
}
