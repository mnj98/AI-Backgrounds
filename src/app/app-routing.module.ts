import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from "./home/home.component";
import {GenBackgroundComponent} from "./gen-background/gen-background.component";

const routes: Routes = [{path: '', component: HomeComponent},
    {path: '/generate', component: GenBackgroundComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
