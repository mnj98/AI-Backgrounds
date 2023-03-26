import {Component, OnInit} from '@angular/core';
import {RequestSendService} from "../request-send.service";
import {LegacyThemePalette} from "@angular/material/legacy-core";
import {MatDialog} from "@angular/material/dialog";
import {PromptDialogComponent} from "../prompt-dialog/prompt-dialog.component";

const defaut_steps: number = 75
const defaut_samples: number = 1

export interface PromptData {
    prompt_text:string
}


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

    constructor(private req_service: RequestSendService,
                public dialog: MatDialog) {}

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

    showPrompt(prompt_text:string){
        this.dialog.open(PromptDialogComponent, {
            data: {
                prompt_text: prompt_text
            }
        })
    }



    /**
     * Thanks ChatGPT :)
     * @param model_name: string
     * @param image_data: string
     */
    downloadImage(model_name, image_data){
        const byteString = atob(image_data);
        const mimeString = 'jpg'
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = model_name + '.jpg';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
