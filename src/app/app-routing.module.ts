import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from "./home/home.component";
import {GenBackgroundComponent} from "./gen-background/gen-background.component";
import {AboutPageComponent} from "./about-page/about-page.component";

const routes: Routes = [{path: '', component: HomeComponent},
    {path: 'generate', component: GenBackgroundComponent},
    {path: 'about-page', component: AboutPageComponent},
    { path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
