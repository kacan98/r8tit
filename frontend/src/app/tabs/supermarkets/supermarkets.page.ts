import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupermarketService } from '../../shared/services/supermarket/supermarket.service';
import { Subscription, tap } from 'rxjs';
import { SupermarketComplete } from '../../shared/services/supermarket/supermarkets.model';
import {
  ModalController,
  NavController,
  RefresherEventDetail,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SupermarketCreateComponent } from './supermarket-create/supermarket-create.component';
import { ErrorMessage } from '../../shared/components/error-message/error-message.model';

@Component({
  selector: 'app-supermarkets-page',
  templateUrl: 'supermarkets.page.html',
  styleUrls: ['supermarkets.page.scss'],
})
export class SupermarketsPage implements OnInit, OnDestroy {
  supermarkets?: SupermarketComplete[];
  private subscriptions: Subscription[] = [];

  error?: ErrorMessage;

  constructor(
    private supermarketService: SupermarketService,
    private navController: NavController,
    private route: ActivatedRoute,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.getSupermarkets();
  }
  handleRefresh($event?: RefresherEventDetail) {
    this.subscriptions.push(this.refresh($event).subscribe());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async openCreatePage() {
    const modal = await this.modalController.create({
      component: SupermarketCreateComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'successfully created') {
      this.refresh().subscribe({
        next: () => {
          this.navController.navigateForward(['details', data.supermarketId], {
            relativeTo: this.route,
          });
        },
      });
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

  private refresh($event?: RefresherEventDetail) {
    this.error = undefined;
    return this.supermarketService.refreshSupermarkets().pipe(
      tap({
        next: (supermarkets) => {
          this.supermarkets = supermarkets;
          $event?.complete();
        },
        error: (error) => {
          this.error = {
            text: error.message,
            header: 'Error while refreshing',
          };
          $event?.complete();
        },
      }),
    );
  }
}
