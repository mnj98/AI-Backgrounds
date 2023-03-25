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
    status_pending = false


    rating_nums = [1,2,3,4,5]
    sample_nums = [1,2,4]

    constructor(private req_service: RequestSendService) {}

    ngOnInit(): void {
        //this.rating = null
        this.model = window.history.state.model ?? {name: 'Spinach Omelette', id: 'egg', original_photo: 'src/assets/egg.jpg'}
        this.getGenedImages(this.model.model_id)
        this.num_samples = defaut_samples
        this.steps = defaut_steps
        this.prompt_text = this.model.token
    }

    clear(){
        this.new_results = null
        this.prompt_text = ''
        this.num_samples = defaut_samples
        this.steps = defaut_steps
        this.prompt_text = this.model.token

    }

    deleteImage(model_id, image_id){
        this.req_service.deleteImage(model_id, image_id).subscribe({next: result => {
                this.getGenedImages(model_id)
            }, error: console.log})
    }

    getGenedImages(model_id){
        this.req_service.getGeneratedImages(model_id).subscribe({next: result => {
                this.generated_images = result.output
            }, error: console.log})
    }

    saveImages(){
        let images = this.new_results.filter((image) => {
            return image.selected
        }).map(image => {
            return {image: image.image, rating: image.rating, steps: image.steps}
        })


        this.req_service.saveImages(this.model.model_id, images, this.prompt_text).subscribe({next: result => {
                this.getGenedImages(this.model.model_id)
                this.clear()
            }
            , error: console.log})
    }

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
        if(!prompt || prompt.length == 0){
            this.clear()
        }
        else {
            this.status_pending = true

            this.req_service.genImages(prompt, this.model.model_id, num_samples, steps).subscribe({
                next: result => {
                    this.new_results = result.images.map((image) => {
                        return {image: image, rating: 0, selected: false, steps: result.steps}
                    })
                    this.prompt_text = result.prompt_text

                    this.status_pending = false
                }, error: console.log
            })
        }
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
}
