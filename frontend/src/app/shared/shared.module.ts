import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from './stars/stars.component';
import { IonicModule } from '@ionic/angular';
import { NgxStarsModule } from 'ngx-stars';

@NgModule({
  declarations: [StarsComponent],
  imports: [CommonModule, IonicModule, NgxStarsModule],
  exports: [StarsComponent],
})
export class SharedModule {}
