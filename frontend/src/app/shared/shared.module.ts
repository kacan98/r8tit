import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from './stars/stars.component';
import { IonicModule } from '@ionic/angular';
import { NgxStarsModule } from 'ngx-stars';
import { TakePhotoComponent } from './take-photo/take-photo.component';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  declarations: [StarsComponent, TakePhotoComponent],
  imports: [CommonModule, IonicModule, NgxStarsModule, WebcamModule],
  exports: [StarsComponent],
})
export class SharedModule {}
