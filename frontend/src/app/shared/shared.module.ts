import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from './components/stars/stars.component';
import { IonicModule } from '@ionic/angular';
import { NgxStarsModule } from 'ngx-stars';
import { TakePhotoComponent } from './components/take-photo/take-photo.component';
import { WebcamModule } from 'ngx-webcam';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { ModalDialogBaseComponent } from './modal-dialog-base/modal-dialog-base.component';
import { AddRatingsModalComponent } from './components/add-ratings-modal/add-ratings-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingsComponent } from './components/ratings/ratings.component';

@NgModule({
  declarations: [
    StarsComponent,
    TakePhotoComponent,
    ErrorMessageComponent,
    ModalDialogBaseComponent,
    AddRatingsModalComponent,
    RatingsComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgxStarsModule,
    WebcamModule,
    ReactiveFormsModule,
  ],
  exports: [
    StarsComponent,
    TakePhotoComponent,
    ErrorMessageComponent,
    ModalDialogBaseComponent,
    RatingsComponent,
  ],
})
export class SharedModule {}
