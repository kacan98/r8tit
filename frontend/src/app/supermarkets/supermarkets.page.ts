import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupermarketService} from "../services/supermarket/supermarket.service";
import {Subscription} from "rxjs";
import {Supermarket} from "../services/supermarket/supermarkets.model";
import {NavController, RefresherEventDetail} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-supermarkets-page',
  templateUrl: 'supermarkets.page.html',
  styleUrls: ['supermarkets.page.scss']
})
export class SupermarketsPage implements OnInit, OnDestroy {
  supermarkets: Supermarket[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private supermarketService: SupermarketService, private navController: NavController, private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.getSupermarkets()
  }

  handleRefresh($event: RefresherEventDetail) {
    this.getSupermarkets($event)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async handleSupermarketClick(supermarket: Supermarket) {
    await this.navController.navigateForward(['details', supermarket.supermarketId ], {relativeTo: this.route})
  }

  private getSupermarkets(event?: any) {
    this.subscriptions.push(
      this.supermarketService.getAllSupermarkets().subscribe({next: (supermarkets) => {
          this.supermarkets = supermarkets;
          event?.target.complete();
        }})
    )
  }
}
