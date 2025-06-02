import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-distance-to-rotation-distance',
  templateUrl: './step-distance-to-rotation-distance.component.html',
  styleUrls: ['./step-distance-to-rotation-distance.component.scss']
})
export class StepDistanceToRotationDistanceComponent implements OnInit {

  constructor() { }

  public stepper_degrees = 1.8;

  public full_steps_per_rotation = 0;
  public microsteps = 16;
  public step_distance = 0;

  public rotation_distance = ''; // As string to avoid removing the zeroes at the end. Klipper recommends 3 decimal positions.

  ngOnInit(): void {
    this.calculateFullStepsPerRotation();
  }

  public calculateFullStepsPerRotation(): void {
    this.full_steps_per_rotation = 360 / this.stepper_degrees;
  }

  public convertStepDistanceToRotationDistance(): void {
    this.rotation_distance = (this.full_steps_per_rotation * this.microsteps * this.step_distance).toFixed(3);
  }
}
