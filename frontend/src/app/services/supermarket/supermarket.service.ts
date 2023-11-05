import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {

  constructor(private http: HttpClient) { }

  getAllSupermarkets() {
    this.http.get('http://localhost:8080/supermarkets').subscribe(data => {
      console.log(data);
    })
  }
}
