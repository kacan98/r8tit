import { Component, Input, OnInit } from '@angular/core';
import { Rating } from '../../services/rating/rating.model';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input() rating?: Rating;

  constructor() {}

  ngOnInit() {}
}
