import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupermarketsPage } from './supermarkets.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {SupermarketsTabRoutingModule} from "./supermarkets-tab-routing.module";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SupermarketsTabRoutingModule
  ],
  declarations: [SupermarketsPage]
})
export class SupermarketsTabModule {}
