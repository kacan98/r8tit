import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SupermarketService} from "../../services/supermarket/supermarket.service";
import {Observable} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  title?: string
  image$?: Observable<SafeUrl>
  place?: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private supermarketService: SupermarketService) {}
  ngOnInit() {
    this.supermarketService.getSupermarketDetails(this.activatedRoute.snapshot.params['supermarketId']).subscribe((supermarket) => {
      this.image$ = supermarket.imageURL$
      this.title = supermarket.name
      this.place = `${supermarket.city}, ${supermarket.country}`
    })
  }

}
