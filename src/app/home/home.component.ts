import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

    simulated_model_database

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.simulated_model_database = [{name: 'Spinach Omelette', id: 'egg'}, {name: 'Smores Cookie', id: 'cookie'}]
    }

    selectModel(id: string): void{
        this.router.navigate(['/generate'], {state: {id: id}})
    }


}
