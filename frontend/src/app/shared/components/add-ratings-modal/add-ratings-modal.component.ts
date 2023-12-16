import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  RatingCategoriesForObjectType,
  RatingForUpsert,
} from '../../services/rating/rating.model';
import { RatingService } from '../../services/rating/rating.service';
import { ErrorMessage } from '../error-message/error-message.model';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-ratings-modal',
  templateUrl: './add-ratings-modal.component.html',
  styleUrls: ['./add-ratings-modal.component.scss'],
})
export class AddRatingsModalComponent implements OnInit, OnDestroy {
  @Input() objectType?: 'Supermarkets'; //this is based on the ratable objects
  @Input() title?: string = 'Add Rating';
  @Input() objectId?: number;
  ratingCategories?: RatingCategoriesForObjectType;
  form: FormGroup<{
    global: FormGroup<{ [key: string]: FormControl<number | null> }>;
    user: FormGroup<{ [key: string]: FormControl<number | null> }>;
  }> = new FormGroup({
    global: new FormGroup({}),
    user: new FormGroup({}),
  });

  errorMessage?: ErrorMessage;
  subscriptions: Subscription[] = [];
  constructor(
    private ratingService: RatingService,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    if (!this.objectType)
      throw new Error('objectType was not provided to the modal');
    this.subscriptions.push(
      this.ratingService.getCategoriesForObjectType(this.objectType).subscribe({
        next: (categories) => {
          this.ratingCategories = categories;
          this.initializeControls(categories);
        },
        error: (e) => {
          this.errorMessage = e;
        },
      }),
    );
  }

  async dismissModal(role: 'cancel' | 'apply') {
    const formValue = this.form.getRawValue();
    const ratingsInGlobalCategories: RatingForUpsert[] = Object.keys(
      formValue.global,
    ).map((key) => {
      const ratingCategoryId = this.ratingCategories?.global.find(
        (c) => c.categoryName === key,
      )?.ratingCategoryId;
      if (!ratingCategoryId)
        throw new Error(`ratingCategoryId not found for ${key}`);
      return {
        relatedObjectId: this.objectId,
        ratingCategoryId,
        ratingValue: formValue.global[key],
      } as RatingForUpsert;
    });
    this.ratingService.upsertRatings(ratingsInGlobalCategories).subscribe({
      next: (response) => {
        this.modalController.dismiss(response.ratings, role);
      },
      error: (e) => {
        this.errorMessage = e;
      },
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private initializeControls(categories: RatingCategoriesForObjectType) {
    categories.global.forEach((category) => {
      //add a control to the global group
      this.form.controls.global.registerControl(
        category.categoryName,
        new FormControl(null),
      );
    });
  }
}
