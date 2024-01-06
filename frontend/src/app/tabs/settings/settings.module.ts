import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';
import { ExploreContainerComponentModule } from '../../shared/components/explore-container/explore-container.module';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { AboutComponent } from './about/about.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SettingsPageRoutingModule,
    NgOptimizedImage,
    SharedModule,
  ],
  declarations: [SettingsPage, AboutComponent],
})
export class Tab2PageModule {}
