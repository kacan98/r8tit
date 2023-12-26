import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxStarsComponent } from 'ngx-stars';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements OnInit, OnChanges {
  @ViewChild(NgxStarsComponent) starsComponent?: NgxStarsComponent;

  @Input() readonly: boolean = true;
  @Input() initialNrStars: number = 0;
  @Input() starSize: number = 1;
  @Input() control?: FormControl<number | null>;
  @Input() color = 'white';

  //TODO: Custom stars
  // starUrls = {
  //   empty: 'assets/icons/stars/star.svg',
  //   half: 'assets/icons/stars/star-half.svg',
  //   full: 'assets/icons/stars/star-outline.svg',
  // };

  ngOnInit() {
    this.initialNrStars = this.control?.value || this.initialNrStars;

    //get current prefered color
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialNrStars']) {
      this.starsComponent?.setRating(
        this.control?.value || this.initialNrStars,
      );
    }
  }

  updateControl($event: number) {
    this.control?.setValue($event);
  }
}
