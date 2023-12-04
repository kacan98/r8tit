import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating, RatingCategoryForObjectType } from './rating.model';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  getRatingsForObject(
    objectId: number,
    tableName: 'Supermarkets',
  ): Observable<Rating[]> {
    return this.http.get<Rating[]>(
      `http://localhost:5204/api/Rating/ratingsForObject`,
      {
        params: {
          objectId: objectId,
          tableName: tableName,
        },
      },
    );
  }

  getCategoriesForObjectType(
    type: 'Supermarkets',
  ): Observable<RatingCategoryForObjectType[]> {
    return this.http.get<RatingCategoryForObjectType[]>(
      `http://localhost:5204/api/Rating/categoriesForTable`,
      {
        params: {
          tableName: type,
        },
      },
    );
  }

  addRating(
    objectId: number,
    tableName: 'Supermarkets',
    rating: number,
    comment: string,
  ): Observable<Rating> {
    return this.http.post<Rating>(`http://localhost:5204/api/Rating/add`, {
      objectId: objectId,
      tableName: tableName,
      rating: rating,
      comment: comment,
    });
  }
}
