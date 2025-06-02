import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RotationDistanceCalculatorComponent } from './rotation-distance-calculator/rotation-distance-calculator.component';
import { EstepRotationDistanceConverterComponent } from './estep-rotation-distance-converter/estep-rotation-distance-converter.component';
import { StepDistanceToRotationDistanceComponent } from './step-distance-to-rotation-distance/step-distance-to-rotation-distance.component';

@NgModule({
  declarations: [
    AppComponent,
    RotationDistanceCalculatorComponent,
    EstepRotationDistanceConverterComponent,
    StepDistanceToRotationDistanceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
