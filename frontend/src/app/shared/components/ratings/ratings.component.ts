import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  RatingComplete,
  RatingSummary,
} from '../../services/rating/rating.model';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss'],
})
export class RatingsComponent implements OnChanges {
  @Input() ratings?: RatingComplete[];
  @Input() currentUserId?: number;
  userIdsWhoRated?: number[];
  userRatingsMapping?: {
    [key: string]: RatingSummary;
  };
  @Output() editRatingClicked = new EventEmitter<RatingSummary>();

  constructor() {}

  ngOnChanges() {
    if (this.ratings) {
      this.sortRatings(this.ratings);
    }
  }

  private sortRatings(ratings: RatingComplete[]) {
    const userIdsWhoRated = ratings.map((r) => r.userId);
    const uniqueUserIdsWhoRated = [...new Set(userIdsWhoRated)];
    const ratingsSorted: RatingsComponent['userRatingsMapping'] = {};

    uniqueUserIdsWhoRated.forEach((userId) => {
      const userRatings = ratings.filter((r) => r.userId === userId);
      ratingsSorted[userId] = {
        ratings: userRatings,
        average:
          userRatings.reduce((acc, curr) => acc + curr.ratingValue, 0) /
          userRatings.length,
      };
    });
    this.userRatingsMapping = ratingsSorted;
    this.userIdsWhoRated = uniqueUserIdsWhoRated;

    //move current user to first position
    const currentUserIndex = this.userIdsWhoRated.indexOf(this.currentUserId!);
    if (currentUserIndex !== -1) {
      this.userIdsWhoRated.splice(currentUserIndex, 1);
      this.userIdsWhoRated.unshift(this.currentUserId!);
    }
  }
}
