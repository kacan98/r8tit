import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupermarketService } from '../services/supermarket/supermarket.service';
import { combineLatestWith, from, Observable, Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { TakePhotoComponent } from '../components/take-photo/take-photo.component';
import { switchMap } from 'rxjs/operators';
import { SupermarketComplete } from '../services/supermarket/supermarkets.model';
import { WebcamImage } from 'ngx-webcam';
import { ImageService } from '../services/image/image.service';
import { ErrorMessage } from '../components/error-message/error-message.model';
import { RatingService } from '../services/rating/rating.service';
import { RatingComplete } from '../services/rating/rating.model';
import { AuthService } from '../../auth/auth.service';
import { AddRatingsModalComponent } from '../components/add-ratings-modal/add-ratings-modal.component';

export type DetailEntity = SupermarketComplete;

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
/** I maked it generic, so that in case I have more detail pages, it's easier to reuse it later.
 *  But I guess it could've been just SupermarketDetailsPage...
 * */
export class DetailsPage implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput?: ElementRef;
  supermarketId?: number;
  title?: string;
  image$?: Observable<SafeUrl>;
  place?: string;
  averageRating?: number | null;
  detailEntity?: DetailEntity;

  editImageButtonsDisplayed = false;

  ratings?: RatingComplete[];
  currentUserRated?: boolean;

  error?: ErrorMessage;

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private supermarketService: SupermarketService,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imageService: ImageService,
    private ratingService: RatingService,
    private authService: AuthService,
  ) {}
  ngOnInit() {
    this.supermarketId = this.activatedRoute.snapshot.params['supermarketId'];
    if (this.supermarketId) {
      this.initializeRatings(this.supermarketId);
      this.initializeSupermarket(this.supermarketId);
    }
  }

  async updateImage(detailEntity: DetailEntity): Promise<void> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.find((device) => device.kind === 'videoinput');

    if (!hasCamera && this.fileInput) {
      this.fileInput.nativeElement.click();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Add image',
      message: 'Get image from:',
      buttons: [
        { text: 'Camera', role: 'camera' },
        { text: 'Upload from device', role: 'device' },
        { text: 'Cancel', role: 'cancel' },
      ],
    });

    await alert.present();
    const { role } = await alert.onWillDismiss();

    if (role === 'camera') await this.takeImageFromCamera(detailEntity);
    else if (role === 'device' && this.fileInput)
      this.fileInput.nativeElement.click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async takeImageFromCamera(entity: DetailEntity): Promise<void> {
    const modal = await this.modalController.create({
      component: TakePhotoComponent,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    const webcamImage: WebcamImage | undefined = data;
    //convert to a file

    if (!webcamImage) return;

    this.updateSupermarketImage(
      entity,
      this.imageService.webcamImageToFile(webcamImage),
    );
  }

  takeImageFromDevice(
    detailEntity: SupermarketComplete,
    target: HTMLInputElement,
  ) {
    const file: File | null = target.files && target.files[0];
    target.value = '';

    if (!file) throw new Error('No file selected');
    this.updateSupermarketImage(detailEntity, file);
  }

  private updateSupermarketImage(supermarket: SupermarketComplete, file: File) {
    let loadingElement: HTMLIonLoadingElement;
    // Moved here to get around circular reference (asset service referencing sync service referencing... asset service)
    this.subscriptions.push(
      from(this.loadingController.create({ message: 'Updating image' }))
        .pipe(
          switchMap((loading) => {
            loadingElement = loading;
            return loading.present();
          }),
          switchMap(() => {
            return this.supermarketService.updateImage(supermarket, file);
          }),
          switchMap(() => loadingElement.dismiss()),
        )
        .subscribe({
          next: () => {
            void loadingElement.dismiss();
            void this.toastController
              .create({
                message: 'Image successfully updated',
                color: 'success',
                duration: 3000,
              })
              .then((toast) => toast.present());
            this.initializeSupermarket(supermarket.supermarketId);
          },
          error: (e) => {
            void loadingElement.dismiss();
            void this.toastController
              .create({
                message: 'Failed to update the image: ' + e.message,
                color: 'danger',
                duration: 3000,
              })
              .then((toast) => toast.present());
          },
        }),
    );
  }

  private initializeSupermarket(supermarketId: number) {
    this.subscriptions.push(
      this.supermarketService.getSupermarketDetails(supermarketId).subscribe({
        next: (supermarket) => {
          this.image$ = this.imageService.getImage(
            supermarket.imageId,
            'assets/placeholders/placeholder-image-dark.jpg',
          );
          this.title = supermarket.name;
          this.place = `${supermarket.city}, ${supermarket.country}`;
          this.detailEntity = supermarket;
        },
        error: (e) => {
          this.error = {
            text: 'Failed to load supermarket details',
            header: 'Error',
          };
          console.error(e);
        },
      }),
    );
  }

  async openAddRating(detailEntity: DetailEntity) {
    const modal = await this.modalController.create({
      component: AddRatingsModalComponent,
      componentProps: {
        objectType: 'Supermarkets',
        title: 'Rate ' + detailEntity.name,
        objectId: detailEntity.supermarketId,
      },
    });

    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'apply') {
      this.initializeRatings(detailEntity.supermarketId);
    }
  }

  private initializeRatings(supermarketId: number) {
    this.subscriptions.push(
      this.ratingService
        .getRatingsForObject(supermarketId, 'Supermarkets')
        .pipe(combineLatestWith(this.authService.getCurrentUserId()))
        .subscribe({
          next: ([ratings, currentUser]) => {
            this.ratings = ratings;
            this.averageRating = this.getAverageRating(ratings);
            this.currentUserRated = ratings.some(
              (rating) => rating.userId === currentUser,
            );
          },
          error: (e) => {
            this.error = {
              text: 'Failed to load supermarket ratings',
              header: 'Error',
            };
            console.error(e);
          },
        }),
    );
  }

  private getAverageRating(ratings: RatingComplete[]): number | null {
    const ratingsGroupedByUser = ratings.reduce(
      (acc, rating) => {
        if (!acc[rating.userId]) {
          acc[rating.userId] = [];
        }
        acc[rating.userId].push(rating.ratingValue);
        return acc;
      },
      {} as { [key: number]: number[] },
    );
    const averagesPerUser: number[] = Object.values(ratingsGroupedByUser).map(
      (ratings) =>
        ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length,
    );
    if (averagesPerUser.length === 0) return null;
    return (
      averagesPerUser.reduce((acc, average) => acc + average, 0) /
      averagesPerUser.length
    );
  }
}
