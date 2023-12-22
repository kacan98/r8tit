import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RatingForObjectDTO,
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
  ): Observable<RatingForObjectDTO[]> {
    return this.http.get<RatingForObjectDTO[]>(
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
  ): Observable<{ message: string; ratings: RatingForObjectDTO[] }> {
    return this.http.post<{ message: string; ratings: RatingForObjectDTO[] }>(
      `http://localhost:5204/api/Rating/upsertRatings`,
      ratings,
    );
  }
}
