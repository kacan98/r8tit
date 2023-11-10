import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Supermarket} from "./supermarkets.model";
import {ImageService} from "../image/image.service";
import {DomSanitizer} from "@angular/platform-browser";
import {WithRequired} from "../../helpers/tsHelpers";

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {

  constructor(private http: HttpClient, private imageService: ImageService, private readonly sanitizer: DomSanitizer) { }

  getAllSupermarkets(): Observable<Supermarket[]> {
    return this.http.get<Supermarket[]>('http://localhost:5204/Supermarket/GetAllList')
      .pipe(map(supermarkets=>{
        return supermarkets.map(supermarket=> this.addImageToSupermarket(supermarket))
    }))
  }

  getSupermarketDetails(supermarketId: string): Observable<Supermarket> {
    return this.http.get<Supermarket>(`http://localhost:5204/Supermarket/GetById/${supermarketId}`).pipe(
      map(supermarket=> this.addImageToSupermarket(supermarket))
    )
  }

  private addImageToSupermarket(supermarket: Supermarket): WithRequired<Supermarket, 'imageURL$'> {
    return ({
      ...supermarket,
      imageURL$: this.imageService.getImage(supermarket.imageId).pipe(map((blob) => {
        let objectURL = URL.createObjectURL(blob);
        console.log(objectURL)
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }))
})
  }
}
