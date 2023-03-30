import {Component, OnInit} from '@angular/core';
import {RequestSendService} from "../request-send.service";
import {LegacyThemePalette} from "@angular/material/legacy-core";
import {MatDialog} from "@angular/material/dialog";
import {PromptDialogComponent} from "../prompt-dialog/prompt-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeleteConfirmationComponent} from "../delete-confirmation/delete-confirmation.component";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Model} from "../home/home.component";

const DEFAULT_STEPS: number = 75
const DEFAULT_SAMPLES: number = 1

export interface PromptData {
    prompt_text:string
}
export interface DeleteData {
    model_id: string,
    image_id: string
}

export interface SavedImage{
    image_id: string,
    image: string,
    prompt_text: string,
    rating: number,
    steps: number
}

export interface GeneratedImage{
    image: string,
    rating: number,
    selected: boolean,
    steps: number
}


@Component({
  selector: 'app-gen-background',
  templateUrl: './gen-background.component.html',
  styleUrls: ['./gen-background.component.css']
})

export class GenBackgroundComponent implements OnInit{
    model: Model = {model_id: "", name: "", thumbnail: "", token: ""}
    prompt_text: string = ""
    generated_images: SavedImage[] = [] //[{image_id: "", image: "", prompt_text: "", rating: 0, steps: 0}]
    before_init: boolean = true
    new_results: GeneratedImage[] = [] //[{image: "", rating: 0, selected: false, steps: 0}]
    num_samples: number = DEFAULT_SAMPLES
    steps: number = DEFAULT_STEPS
    status_pending: boolean = false


    rating_nums: number[] = [1,2,3,4,5]
    sample_nums: number[] = [1,2,4]

    constructor(private req_service: RequestSendService,
                public dialog: MatDialog,
                private _snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.model = window.history.state.model
        this.getGenedImages(this.model.model_id)
        this.num_samples = DEFAULT_SAMPLES
        this.steps = DEFAULT_STEPS
        this.prompt_text = this.model.token
        this.before_init = false
    }

    clear(){
        this.new_results = []
        this.prompt_text = ''
        this.num_samples = DEFAULT_SAMPLES
        this.steps = DEFAULT_STEPS
        this.prompt_text = this.model.token
        this.status_pending = false

    }

    deleteImage(model_id, image_id){
        this.dialog.open(DeleteConfirmationComponent, {
            data: {model_id: model_id, image_id: image_id}
        }).afterClosed().subscribe({next: () => {
            this.getGenedImages(model_id)
        }})
    }

    tabChangeToHistory(event: MatTabChangeEvent, model_id){
        if(event.index == 1) this.getGenedImages(model_id)
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
                    if(result.timeout){
                        this._snackBar.open("Request Timed Out", 'ok',{horizontalPosition: "center", verticalPosition: 'bottom'})
                        this.new_results = []
                        this.status_pending = false

                    }
                    else {
                        this.new_results = result.images.map((image) => {
                            return {image: image, rating: 0, selected: false, steps: result.steps}
                        })
                        this.prompt_text = result.prompt_text

                        this.status_pending = false
                    }
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
        if(this.new_results[image_index].rating != 0 && this.new_results[image_index].rating == rating) this.new_results[image_index].rating = 0
        else this.new_results[image_index].rating = rating
    }
}
