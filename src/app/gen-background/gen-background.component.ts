import {Component, OnInit} from '@angular/core';
import {RequestSendService} from "../request-send.service";

@Component({
  selector: 'app-gen-background',
  templateUrl: './gen-background.component.html',
  styleUrls: ['./gen-background.component.css']
})
export class GenBackgroundComponent implements OnInit{

    model
    prompt
    generated_images
    new_result

    constructor(private req_service: RequestSendService) {}

    ngOnInit(): void {
        this.model = window.history.state.model ?? {name: 'Spinach Omelette', id: 'egg', original_photo: 'src/assets/egg.jpg'}
        this.req_service.getGeneratedImages('1234', this.model.model_id).subscribe({next: result => {
                this.generated_images = result.output
            }, error: error => {
                console.log(error)
                this.req_service.getGeneratedImages('1235', this.model.model_id).subscribe({next: result => {
                        this.generated_images = result.output
                    }, error: console.log})
            }})
    }

    clickPrompt(prompt: string){
        this.req_service.sendReq(prompt, this.model.model_id, '1234').subscribe({next: result => {
            this.new_result = result.output
            this.prompt = result.prompt
        }, error: error => {
            console.log(error)
            this.req_service.sendReq(prompt, this.model.model_id, '1235').subscribe({next: result => {
                this.new_result = result.output
                this.prompt = result.prompt
            }, error: console.log})
        }})
    }


    /*onFileChanged(event: any){
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

    }*/
}
