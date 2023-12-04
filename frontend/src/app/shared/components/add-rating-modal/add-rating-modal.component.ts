import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RatingCategoryForObjectType } from '../../services/rating/rating.model';
import { RatingService } from '../../services/rating/rating.service';
import { ErrorMessage } from '../error-message/error-message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-rating-modal',
  templateUrl: './add-rating-modal.component.html',
  styleUrls: ['./add-rating-modal.component.scss'],
})
export class AddRatingModalComponent implements OnInit, OnDestroy {
  @Input() objectType?: 'Supermarkets'; //this is based on the ratable objects in the
  ratingCategories: RatingCategoryForObjectType[] = [];

  errorMessage?: ErrorMessage;
  subscriptions: Subscription[] = [];
  constructor(private ratingService: RatingService) {}

  ngOnInit() {
    if (this.objectType) {
      this.subscriptions.push(
        this.ratingService
          .getCategoriesForObjectType(this.objectType)
          .subscribe({
            next: (categories) => {
              this.ratingCategories = categories;
            },
            error: (e) => {
              this.errorMessage = e;
            },
          }),
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
