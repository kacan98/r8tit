import { Component, Input, OnInit } from '@angular/core';
import { SupermarketComplete } from '../../../shared/services/supermarket/supermarkets.model';

@Component({
  selector: 'app-supermarket-card',
  templateUrl: './supermarket-card.component.html',
  styleUrls: ['./supermarket-card.component.scss'],
})
export class SupermarketCardComponent implements OnInit {
  @Input() supermarket?: SupermarketComplete;
  constructor() {}

  ngOnInit() {}
}
