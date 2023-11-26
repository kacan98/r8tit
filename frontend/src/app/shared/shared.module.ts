import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from './stars/stars.component';
import { IonicModule } from '@ionic/angular';
import { NgxStarsModule } from 'ngx-stars';
import { TakePhotoComponent } from './take-photo/take-photo.component';
import { WebcamModule } from 'ngx-webcam';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { RatingComponent } from './rating/rating.component';

@NgModule({
  declarations: [
    StarsComponent,
    TakePhotoComponent,
    ErrorMessageComponent,
    RatingComponent,
  ],
  imports: [CommonModule, IonicModule, NgxStarsModule, WebcamModule],
  exports: [
    StarsComponent,
    TakePhotoComponent,
    ErrorMessageComponent,
    RatingComponent,
  ],
})
export class SharedModule {}
