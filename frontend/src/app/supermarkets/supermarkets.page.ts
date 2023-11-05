import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupermarketService} from "../services/supermarket/supermarket.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-supermarkets-page',
  templateUrl: 'supermarkets.page.html',
  styleUrls: ['supermarkets.page.scss']
})
export class SupermarketsPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  constructor(private supermarketService: SupermarketService) {
  }

  ngOnInit() {
    this.supermarketService.getAllSupermarkets().subscribe(() => {
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
