import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('accordion', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})

export class AppComponent {
  public showRotationDistanceCalc = false;
  public showEStepConverter = false;
  public showStepDistanceToRotationDistance = false;

  public toggleRotationDistanceCalc(): void {
    this.showRotationDistanceCalc = !this.showRotationDistanceCalc;
  }

  public toggleEStepConverter(): void {
    this.showEStepConverter = !this.showEStepConverter;
  }

  public toggleStepDistanceToRotationDistance(): void {
    this.showStepDistanceToRotationDistance = !this.showStepDistanceToRotationDistance;
  }
}
