import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements OnInit {
  @Input() readonly: boolean = true;
  @Input() initialNrStars: number = 2.5;
  @Input() starSize: number = 1;
  @Input() control?: FormControl<number | null>;
  @Input() color = 'white';

  //TODO: Custom stars
  // starUrls = {
  //   empty: 'assets/icons/stars/star.svg',
  //   half: 'assets/icons/stars/star-half.svg',
  //   full: 'assets/icons/stars/star-outline.svg',
  // };

  constructor() {}

  ngOnInit() {}

  updateControl($event: number) {
    this.control?.setValue($event);
  }
}
