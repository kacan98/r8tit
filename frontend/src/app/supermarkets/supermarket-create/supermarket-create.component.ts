import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupermarketService } from '../../services/supermarket/supermarket.service';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { SupermarketForUpsert } from '../../services/supermarket/supermarkets.model';
import { Subscription } from 'rxjs';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-supermarket-create',
  templateUrl: './supermarket-create.component.html',
  styleUrls: ['./supermarket-create.component.scss'],
})
export class SupermarketCreateComponent implements OnInit, OnDestroy {
  formGroup: FormGroup = new FormGroup({
    name: new FormControl(undefined, Validators.required),
    address: new FormControl(),
    city: new FormControl(undefined, Validators.required),
    country: new FormControl(undefined, Validators.required),
    latitude: new FormControl(),
    longitude: new FormControl(),
  });

  subscriptions: Subscription[] = [];
  constructor(
    private supermarketService: SupermarketService,
    private locationService: LocationService,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.setDefaultLocation();
  }

  save() {
    const supermarket: SupermarketForUpsert = {
      name: this.formGroup.value.name,
      address: this.formGroup.value.address,
      city: this.formGroup.value.city,
      country: this.formGroup.value.country,
      latitude: this.formGroup.value.latitude,
      longitude: this.formGroup.value.longitude,
    };
    this.supermarketService.upsertSupermarket(supermarket).subscribe({
      next: () => {
        this.toastController
          .create({
            message: 'Supermarket created successfully',
            duration: 2000,
          })
          .then((toast) => toast.present());
        this.modalController.dismiss('successfully created');
        //TODO: Navigate to page with new supermarket
      },
      error: (e) => {
        this.toastController
          .create({
            message: `Something went wrong: ${e.error.message}`,
            duration: 3000,
          })
          .then((toast) => toast.present());
      },
    });
  }

  async setDefaultLocation() {
    const loading = await this.loadingController.create({
      message: 'Wait a sec...',
    });
    await loading.present();

    window.navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      this.formGroup.patchValue({
        latitude,
        longitude,
      });

      this.subscriptions.push(
        this.locationService.getLocationDetails(longitude, latitude).subscribe({
          next: (locationData) => {
            this.formGroup.patchValue({
              address: locationData.name,
              city: locationData.locality,
              country: locationData.country,
            });
            loading.dismiss();
          },
          error: (error) => {
            this.toastController.create({
              message: `Something went wrong when loading the location: ${error.message}`,
              duration: 3000,
            });
            loading.dismiss();
          },
        }),
      );
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  dismiss() {
    void this.modalController.dismiss(undefined, 'cancel');
  }
}
