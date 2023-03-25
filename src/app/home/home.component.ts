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
    loaded_models = false

    constructor(private router: Router,
                private req_service: RequestSendService) {
    }

    ngOnInit(): void {
        this.req_service.getTrainedModels().subscribe({next: models => {
            this.trained_models = models.models
                this.loaded_models = true
        }, error: console.log})
    }

    selectModel(model: any): void{
        this.router.navigate(['/generate'], {state: {model: model}})
    }


}
