import {Component, OnInit} from '@angular/core';
import {RequestSendService} from "../request-send.service";
import {LegacyThemePalette} from "@angular/material/legacy-core";

@Component({
  selector: 'app-gen-background',
  templateUrl: './gen-background.component.html',
  styleUrls: ['./gen-background.component.css']
})
export class GenBackgroundComponent implements OnInit{

    model
    prompt_text
    generated_images
    new_result
    color = 'accent'
    rating

    rating_nums = [1,2,3,4,5]

    constructor(private req_service: RequestSendService) {}

    ngOnInit(): void {
        this.rating = null
        this.model = window.history.state.model ?? {name: 'Spinach Omelette', id: 'egg', original_photo: 'src/assets/egg.jpg'}
        this.getGenedImages(this.model.model_id)
    }

    deleteImage(model_id, image_id){
        this.req_service.deleteImage('1234', model_id, image_id).subscribe({next: result => {
                this.getGenedImages(model_id)
            }, error: error => {
                console.log(error)
                this.req_service.deleteImage('1235', model_id, image_id).subscribe({next: result => {
                        this.getGenedImages(model_id)
                    }, error: console.log})
            }})
    }

    getGenedImages(model_id){
        this.req_service.getGeneratedImages('1234', model_id).subscribe({next: result => {
                this.generated_images = result.output
            }, error: error => {
                console.log(error)
                this.req_service.getGeneratedImages('1235', model_id).subscribe({next: result => {
                    console.log(result.output)
                        this.generated_images = result.output
                    }, error: console.log})
            }})
    }

    saveImage(image, prompt, rating){
        if(!rating) rating = 0
        this.req_service.saveImage('1234', this.model.model_id, image, prompt, rating).subscribe({next: result => {
                this.getGenedImages(this.model.model_id)
                this.clear()
            }
            , error: error => {
                console.log(error)
                this.req_service.saveImage('1235', this.model.model_id, image, prompt, rating).subscribe({next: result => {
                        this.getGenedImages(this.model.model_id)
                        this.clear()
                    }, error: console.log})
            }})
    }

    clickPrompt(prompt: string){
        if(!prompt || prompt.length == 0){
            this.clear()
        }
        else {
            this.req_service.sendReq(prompt, this.model.model_id, '1234').subscribe({
                next: result => {
                    this.new_result = result.output
                    this.prompt_text = result.prompt_text
                }, error: error => {
                    console.log(error)
                    this.req_service.sendReq(prompt, this.model.model_id, '1235').subscribe({
                        next: result => {
                            this.new_result = result.output
                            this.prompt_text = result.prompt_text
                        }, error: console.log
                    })
                }
            })
        }
    }
    clear(){
        this.new_result = null
        this.prompt_text = ''

    }

    showIcon(index:number) {
        if(this.rating == null) return 'star_border'
        if (this.rating >= index + 1) {
            return 'star';
        } else {
            return 'star_border';
        }
    }

    onRate(rating:number){
        console.log(rating)
        if(this.rating != null && this.rating == rating) this.rating = null
        else this.rating = rating
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
