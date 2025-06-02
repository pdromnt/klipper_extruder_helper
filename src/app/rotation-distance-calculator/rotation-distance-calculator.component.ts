import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rotation-distance-calculator',
  templateUrl: './rotation-distance-calculator.component.html',
  styleUrls: ['./rotation-distance-calculator.component.scss']
})
export class RotationDistanceCalculatorComponent implements OnInit {

  constructor() { }

  public initial_mark_distance = 70;
  public requested_extrude_distance = 50;
  public subsequent_mark_distance = 0
  public previous_rotation_distance = 0;

  public actual_extrude_distance = 0;
  public rotation_distance = ''; // As string to avoid removing the zeroes at the end. Klipper recommends 3 decimal positions.

  ngOnInit(): void {
  }

  calculateActualExtrudeDistance(): void {
    this.actual_extrude_distance = this.initial_mark_distance - this.subsequent_mark_distance;
  }

  calculateRotationDistance(): void {
    this.rotation_distance =  ((this.previous_rotation_distance * this.actual_extrude_distance) / this.requested_extrude_distance).toFixed(3);
  }
}
