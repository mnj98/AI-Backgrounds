import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RequestSendService} from "../request-send.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

    trained_models
    simulated_model_database

    constructor(private router: Router,
                private req_service: RequestSendService) {
    }

    ngOnInit(): void {
        this.simulated_model_database = []
        this.req_service.getTrainedModels('1234').subscribe({next: models => {
            this.trained_models = models.models
            //console.log(this.trained_models)
        }, error: err => {
            console.log('debug??')
            this.req_service.getTrainedModels('1235').subscribe({next: models => {
                this.trained_models = models.models
                    //console.log('models: ' + this.trained_models[0].thumbnail)
                }, error: err1 => {
                console.log(err1)
                }})
            }})

        //this.simulated_model_database = [{name: 'Spinach Omelette', id: 'egg', original_photo: 'assets/egg.jpg'},
        //    {name: 'Smores Cookie', id: 'cookie', original_photo: 'assets/cookie.jpg'}]
    }

    selectModel(model: any): void{
        this.router.navigate(['/generate'], {state: {model: model}})
    }


}
