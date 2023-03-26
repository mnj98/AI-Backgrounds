import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GenBackgroundComponent } from './gen-background/gen-background.component';
import { HttpClientModule} from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSliderModule} from "@angular/material/slider";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { AboutPageComponent } from './about-page/about-page.component';
import {MatTabsModule} from "@angular/material/tabs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatGridListModule} from "@angular/material/grid-list";
import { PromptDialogComponent } from './prompt-dialog/prompt-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ClipboardModule} from "@angular/cdk/clipboard";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GenBackgroundComponent,
    AboutPageComponent,
    PromptDialogComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        FormsModule,
        MatCheckboxModule,
        MatSliderModule,
        MatProgressBarModule,
        MatTabsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatSelectModule,
        MatGridListModule,
        MatDialogModule,
        ClipboardModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
