import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estep-rotation-distance-converter',
  templateUrl: './estep-rotation-distance-converter.component.html',
  styleUrls: ['./estep-rotation-distance-converter.component.scss']
})
export class EstepRotationDistanceConverterComponent implements OnInit {

  constructor() { }

  public stepper_degrees = 1.8;

  public full_steps_per_rotation = 0;
  public microsteps = 16;
  public steps_per_mm = 0;

  public rotation_distance = ''; // As string to avoid removing the zeroes at the end. Klipper recommends 3 decimal positions.

  ngOnInit(): void {
    this.calculateFullStepsPerRotation();
  }

  public calculateFullStepsPerRotation(): void {
    this.full_steps_per_rotation = 360 / this.stepper_degrees;
  }

  public calculateRotationDistanceFromStepsPerMm(): void {
    this.rotation_distance = ((this.full_steps_per_rotation * this.microsteps) / this.steps_per_mm).toFixed(3);
  }

}
