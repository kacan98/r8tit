import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.scss'],
})
export class TakePhotoComponent {
  triggerObservable$: Observable<void>;

  webcamImage?: WebcamImage;

  private trigger$ = new Subject<void>();

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
  ) {
    this.triggerObservable$ = this.trigger$.asObservable();
  }

  async handleInitError(error: WebcamInitError): Promise<void> {
    void this.toastController.create({
      color: 'danger',
      message:
        error.mediaStreamError &&
        error.mediaStreamError.name === 'NotAllowedError'
          ? 'Please allow access to the camera and try again.'
          : error.message,
    });
    await this.closeModal();
  }

  async closeModal(image?: WebcamImage): Promise<void> {
    if (image) {
      await this.modalController.dismiss(image, 'submit');
    } else await this.modalController.dismiss(undefined, 'cancel');
  }

  takePicture(): void {
    this.trigger$.next(undefined);
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }
}
