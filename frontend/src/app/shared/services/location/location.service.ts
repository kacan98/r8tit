import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { environment } from '../../../../environments/environment';

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
    const permissionExist = from(Geolocation.checkPermissions());
    return permissionExist.pipe(
      switchMap((permission: PermissionStatus) => {
        if (permission.location === 'granted') {
          return Geolocation.getCurrentPosition();
        } else {
          return from(Geolocation.requestPermissions()).pipe(
            switchMap((permission: PermissionStatus) => {
              if (permission.location === 'granted') {
                return Geolocation.getCurrentPosition();
              } else {
                throw new Error('Permission denied');
              }
            }),
          );
        }
      }),
      switchMap((position) => {
        return this.http.get<LocationData>(
          `${environment.apiUrl}/api/Location/GetLocationDetails?longitude=${position.coords.longitude}&latitude=${position.coords.latitude}`,
        );
      }),
    );
  }
}
