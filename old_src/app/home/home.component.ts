import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RequestSendService} from "../request-send.service";


/**
 * Exported type for models. Fields are self-explanatory.
 */
export interface Model{
    model_id: string,
    name: string,
    thumbnail: string,
    token: string
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

    trained_models: [Model] = [{model_id: "", name: "", thumbnail: "", token: ""}]
    loaded_models: boolean = false

    constructor(private router: Router,
                private req_service: RequestSendService) {
    }

    /**
     * Runs when the component is initialized.
     *
     * Queries backend for the list of trained models. When it's done it flags this.loaded_models to true
     * to disable the loading bar the shows up initially.
     */
    ngOnInit(): void {
        this.req_service.getTrainedModels().subscribe({next: (models) => {
            this.trained_models = models.models
                this.loaded_models = true
        }, error: console.log})
    }

    /**
     * Navigates to the gen-background component with the selected Model
     * @param model: Model, the selected model
     */
    selectModel(model: Model): void{
        this.router.navigate(['/generate'], {state: {model: model}})
    }


}
