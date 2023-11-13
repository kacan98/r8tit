import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements OnInit {
  @Input() readonly: boolean = true;

  //TODO: Custom stars
  // starUrls = {
  //   empty: 'assets/icons/stars/star.svg',
  //   half: 'assets/icons/stars/star-half.svg',
  //   full: 'assets/icons/stars/star-outline.svg',
  // };

  constructor() {}

  ngOnInit() {}
}
