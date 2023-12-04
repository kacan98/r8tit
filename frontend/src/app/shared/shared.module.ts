import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from './components/stars/stars.component';
import { IonicModule } from '@ionic/angular';
import { NgxStarsModule } from 'ngx-stars';
import { TakePhotoComponent } from './components/take-photo/take-photo.component';
import { WebcamModule } from 'ngx-webcam';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { RatingComponent } from './components/rating/rating.component';
import { ModalDialogBaseComponent } from './modal-dialog-base/modal-dialog-base.component';
import { AddRatingModalComponent } from './components/add-rating-modal/add-rating-modal.component';

@NgModule({
  declarations: [
    StarsComponent,
    TakePhotoComponent,
    ErrorMessageComponent,
    RatingComponent,
    ModalDialogBaseComponent,
    AddRatingModalComponent,
  ],
  imports: [CommonModule, IonicModule, NgxStarsModule, WebcamModule],
  exports: [
    StarsComponent,
    TakePhotoComponent,
    ErrorMessageComponent,
    RatingComponent,
    ModalDialogBaseComponent,
  ],
})
export class SharedModule {}
