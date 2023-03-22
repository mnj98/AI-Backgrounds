import {Component, OnInit} from '@angular/core';
import {RequestSendService} from "../request-send.service";
import {LegacyThemePalette} from "@angular/material/legacy-core";

const defaut_steps: number = 75
const defaut_samples: number = 1

@Component({
  selector: 'app-gen-background',
  templateUrl: './gen-background.component.html',
  styleUrls: ['./gen-background.component.css']
})

export class GenBackgroundComponent implements OnInit{
    model
    prompt_text
    generated_images
    new_results
    color = 'accent'
    //rating
    num_samples
    steps


    rating_nums = [1,2,3,4,5]
    sample_nums = [1,2,4]

    constructor(private req_service: RequestSendService) {}

    ngOnInit(): void {
        //this.rating = null
        this.model = window.history.state.model ?? {name: 'Spinach Omelette', id: 'egg', original_photo: 'src/assets/egg.jpg'}
        this.getGenedImages(this.model.model_id)
        this.num_samples = defaut_samples
        this.steps = defaut_steps
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

    saveImages(){
        let images = this.new_results.filter((image) =>{
            console.log('filter ' + image)
            return image.selected
        }).map(image => {
            return {image: image.image, rating: image.rating, steps: image.steps}
        })
        this.req_service.saveImages('1234', this.model.model_id, images, this.prompt_text).subscribe({next: result => {
                this.getGenedImages(this.model.model_id)
                this.clear()
            }
            , error: error => {
                console.log(error)
                this.req_service.saveImages('1235', this.model.model_id, images, this.prompt_text).subscribe({next: result => {
                        this.getGenedImages(this.model.model_id)
                        this.clear()
                    }, error: console.log})
            }})
    }

    /*format_steps_label(steps_value: number): string{
        console.log(this.steps)
        return this.steps + ''
    }*/

    onSelectNumSamples(button_index){
        this.num_samples = this.sample_nums[button_index]
    }

    count_button_highlight(button_index){
        return this.num_samples == this.sample_nums[button_index]
    }

    any_selected(){
        return this.new_results.some(image => image.selected)
    }

    change_generated_image_selection(image_index:number){
        console.log(image_index)
        console.log(this.new_results)
        this.new_results[image_index].selected = !this.new_results[image_index].selected
    }

    clickPrompt(prompt: string, num_samples: number, steps: number){
        console.log('prompt ' + prompt)
        if(!prompt || prompt.length == 0){
            this.clear()
        }
        else {
            console.log(steps)
            this.req_service.genImages(prompt, this.model.model_id, '1234', num_samples, steps).subscribe({
                next: result => {
                    this.new_results = result.images.map((image) => {
                        return {image: image, rating: 0, selected: false, steps: result.steps}
                    })
                    this.prompt_text = result.prompt_text
                }, error: error => {
                    console.log(error)
                    this.req_service.genImages(prompt, this.model.model_id, '1235', num_samples, steps).subscribe({
                        next: result => {
                            this.new_results = result.images.map((image) => {
                                return {image: image, rating: 0, selected: false, steps: result.steps}
                            })
                            this.prompt_text = result.prompt_text
                        }, error: console.log
                    })
                }
            })
        }
    }
    clear(){
        this.new_results = null
        this.prompt_text = ''
        this.num_samples = defaut_samples
        this.steps = defaut_steps

    }

    showIcon(index:number, image_index:number) {
        if(this.new_results[image_index].rating == null) return 'star_border'
        if (this.new_results[image_index].rating >= index + 1) {
            return 'star';
        } else {
            return 'star_border';
        }
    }

    onRate(rating:number, image_index:number){
        console.log(rating)
        if(this.new_results[image_index].rating != null && this.new_results[image_index].rating == rating) this.new_results[image_index].rating = null
        else this.new_results[image_index].rating = rating
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
