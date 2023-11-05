import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupermarketService} from "../services/supermarket/supermarket.service";
import {Subscription} from "rxjs";
import {Supermarket} from "../services/supermarket/supermarkets.model";
import {RefresherEventDetail} from "@ionic/angular";

@Component({
  selector: 'app-supermarkets-page',
  templateUrl: 'supermarkets.page.html',
  styleUrls: ['supermarkets.page.scss']
})
export class SupermarketsPage implements OnInit, OnDestroy {
  supermarkets: Supermarket[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private supermarketService: SupermarketService) {
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

  private getSupermarkets(event?: any) {
    this.subscriptions.push(
      this.supermarketService.getAllSupermarkets().subscribe({next: (supermarkets) => {
          this.supermarkets = supermarkets;
          event?.target.complete();
        }})
    )
  }
}
