import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupermarketService } from '../services/supermarket/supermarket.service';
import { Subscription } from 'rxjs';
import { SupermarketComplete } from '../services/supermarket/supermarkets.model';
import {
  ModalController,
  NavController,
  RefresherEventDetail,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SupermarketCreateComponent } from './supermarket-create/supermarket-create.component';

@Component({
  selector: 'app-supermarkets-page',
  templateUrl: 'supermarkets.page.html',
  styleUrls: ['supermarkets.page.scss'],
})
export class SupermarketsPage implements OnInit, OnDestroy {
  supermarkets?: SupermarketComplete[];
  private subscriptions: Subscription[] = [];

  constructor(
    private supermarketService: SupermarketService,
    private navController: NavController,
    private route: ActivatedRoute,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.getSupermarkets();
  }

  handleRefresh($event: RefresherEventDetail) {
    this.getSupermarkets($event);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async openCreatePage() {
    const modal = await this.modalController.create({
      component: SupermarketCreateComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data === 'successfully created') {
      this.getSupermarkets();
    }
  }

  async handleSupermarketClick(supermarket: SupermarketComplete) {
    await this.navController.navigateForward(
      ['details', supermarket.supermarketId],
      { relativeTo: this.route },
    );
  }

  private getSupermarkets(event?: any) {
    this.subscriptions.push(
      this.supermarketService.getAllSupermarkets().subscribe({
        next: (supermarkets) => {
          this.supermarkets = supermarkets;
          event?.target.complete();
        },
      }),
    );
  }
}
