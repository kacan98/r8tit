import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';

export interface LocationData {
  latitude: number;
  longitude: number;
  type: string;
  distance: number;
  name: string;
  number: null;
  postal_code: null;
  street: null;
  confidence: number;
  region: string;
  region_code: string;
  county: string;
  locality: null;
  administrative_area: null;
  neighbourhood: null;
  country: string;
  country_code: string;
  continent: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getLocationDetails(): Observable<LocationData> {
    return from(Geolocation.getCurrentPosition()).pipe(
      switchMap((position) => {
        return this.http.get<LocationData>(
          `http://localhost:5204/Location/GetLocationDetails?longitude=${position.coords.longitude}&latitude=${position.coords.latitude}`,
        );
      }),
    );
  }
}
