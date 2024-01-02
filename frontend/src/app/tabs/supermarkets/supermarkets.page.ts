import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SupermarketService } from '../../shared/services/supermarket/supermarket.service';
import { Subscription } from 'rxjs';
import { SupermarketListDTO } from '../../shared/services/supermarket/supermarkets.model';
import { IonRefresher, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SupermarketCreateComponent } from './supermarket-create/supermarket-create.component';
import { ErrorMessage } from '../../shared/components/error-message/error-message.model';

@Component({
  selector: 'app-supermarkets-page',
  templateUrl: 'supermarkets.page.html',
  styleUrls: ['supermarkets.page.scss'],
})
export class SupermarketsPage implements OnInit, OnDestroy {
  @ViewChild(IonRefresher, { static: false })
  refresher?: IonRefresher;

  supermarkets?: SupermarketListDTO[];
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
      this.refreshSupermarkets();
      await this.navController.navigateForward(
        ['details', data.supermarketId],
        {
          relativeTo: this.route,
        },
      );
    }
  }

  async handleSupermarketClick(supermarket: SupermarketListDTO) {
    await this.navController.navigateForward(
      ['details', supermarket.supermarketId],
      { relativeTo: this.route },
    );
  }

  refreshSupermarkets() {
    this.error = undefined;
    this.supermarketService.refreshSupermarkets();
  }

  private getSupermarkets() {
    this.subscriptions.push(
      this.supermarketService.getAllSupermarkets().subscribe({
        next: async (supermarkets) => {
          await this.refresher?.complete();
          this.supermarkets = supermarkets;
          if (this.supermarkets.length === 0) {
            this.error = {
              header: 'No supermarkets found',
              text: 'You can add a supermarket by clicking the button above',
            };
          }
        },
        error: async (error) => {
          this.error = {
            text: error.message,
            header: 'Error while loading supermarkets',
          };
          await this.refresher?.complete();
        },
      }),
    );
  }
}
