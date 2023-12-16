import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RatingComplete,
  RatingCategoriesForObjectType,
  RatingForUpsert,
} from './rating.model';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  getRatingsForObject(
    objectId: number,
    tableName: 'Supermarkets',
  ): Observable<RatingComplete[]> {
    return this.http.get<RatingComplete[]>(
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
  ): Observable<RatingCategoriesForObjectType> {
    return this.http.get<RatingCategoriesForObjectType>(
      `http://localhost:5204/api/Rating/categoriesForTable`,
      {
        params: {
          tableName: type,
        },
      },
    );
  }

  upsertRatings(
    ratings: RatingForUpsert[],
  ): Observable<{ message: string; ratings: RatingComplete[] }> {
    return this.http.post<{ message: string; ratings: RatingComplete[] }>(
      `http://localhost:5204/api/Rating/upsertRatings`,
      ratings,
    );
  }
}
