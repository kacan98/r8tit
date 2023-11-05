import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {

  constructor(private http: HttpClient) { }

  getAllSupermarkets() {
    return this.http.get('http://localhost:5204/Supermarket/GetAll')
  }
}
