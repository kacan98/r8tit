import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupermarketsPage } from './supermarkets.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {SupermarketsTabRoutingModule} from "./supermarkets-tab-routing.module";
import {SupermarketCardComponent} from "./supermarket-card/supermarket-card.component";
import {NgxStarsModule} from "ngx-stars";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SupermarketsTabRoutingModule,
    NgOptimizedImage,
    NgxStarsModule,
    SharedModule,
  ],
  declarations: [SupermarketsPage, SupermarketCardComponent],
})
export class SupermarketsTabModule {}
