import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  RatingForObjectDTO,
  RatingSummary,
} from '../../services/rating/rating.model';
import { ImageService } from '../../services/image/image.service';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss'],
})
export class RatingsComponent implements OnChanges {
  @Input() ratings?: RatingForObjectDTO[];
  @Input() currentUserId?: number;

  userIdsWhoRated?: number[];
  userRatingsMapping?: {
    [key: string]: RatingSummary;
  };
  currentUserRated?: boolean;
  @Output() editRatingClicked = new EventEmitter<RatingSummary | undefined>();

  constructor(private imageService: ImageService) {}

  ngOnChanges() {
    if (this.ratings) {
      this.sortRatings(this.ratings, this.currentUserId);
    }
  }

  private sortRatings(ratings: RatingForObjectDTO[], currentUserId?: number) {
    const userIdsWhoRated = ratings.map((r) => r.createdByUserId);
    const uniqueUserIdsWhoRated = [...new Set(userIdsWhoRated)];
    const ratingsSorted: RatingsComponent['userRatingsMapping'] = {};

    uniqueUserIdsWhoRated.forEach((userId) => {
      const userRatings = ratings.filter((r) => r.createdByUserId === userId);
      ratingsSorted[userId] = {
        pictureUrl$: this.imageService.getImageUrlForUser(userId),
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

    this.currentUserRated = ratings.some(
      (rating) => rating.createdByUserId === currentUserId,
    );
  }
}
