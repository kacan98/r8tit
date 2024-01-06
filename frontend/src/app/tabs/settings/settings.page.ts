import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../shared/services/user/user.service';
import { User } from '../../shared/services/user/user.model';
import { Observable, of, Subscription } from 'rxjs';
import { ImageService } from '../../shared/services/image/image.service';
import { SafeUrl } from '@angular/platform-browser';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { WebcamImage } from 'ngx-webcam';
import { TakePhotoComponent } from '../../shared/components/take-photo/take-photo.component';
import { AboutComponent } from './about/about.component';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnDestroy {
  @ViewChild('fileInput') fileInput?: ElementRef;
  currentUser$: Observable<User>;
  currentUserImage$: Observable<SafeUrl | undefined>;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private imageService: ImageService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
  ) {
    this.currentUser$ = this.userService.getCurrentUser();
    this.currentUserImage$ = this.userService.getCurrentUserImage();
  }

  signOut() {
    this.authService.signOut();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async updateUserImage(): Promise<void> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.find((device) => device.kind === 'videoinput');

    if (!hasCamera && this.fileInput) {
      this.fileInput.nativeElement.click();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Update user profile picture',
      message: 'Get image from:',
      buttons: [
        { text: 'Camera', role: 'camera' },
        { text: 'Upload from device', role: 'device' },
        { text: 'Cancel', role: 'cancel' },
      ],
    });

    await alert.present();
    const { role } = await alert.onWillDismiss();

    if (role === 'camera') await this.updateUserImageFromCamera();
    else if (role === 'device' && this.fileInput)
      this.fileInput.nativeElement.click();
  }

  async updateUserImageFromCamera(): Promise<void> {
    const modal = await this.modalController.create({
      component: TakePhotoComponent,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    const webcamImage: WebcamImage | undefined = data;

    if (!webcamImage) return;

    this.uploadUserImage(this.imageService.webcamImageToFile(webcamImage));
  }

  updateUserImageFromDevice(target: HTMLInputElement) {
    const file: File | null = target.files && target.files[0];
    target.value = '';

    if (!file) throw new Error('No file selected');
    this.uploadUserImage(file);
  }

  private uploadUserImage(file: File) {
    this.subscriptions.push(
      this.userService.upsertUserImage(file).subscribe({
        next: (image) => {
          this.currentUserImage$ = of(image);
          this.showToast(true);
        },
        error: (e) => {
          this.showToast(false, e.message);
        },
      }),
    );
  }

  private showToast(success: boolean, errorMessage?: string) {
    this.toastController
      .create({
        message: success ? 'Success' : errorMessage,
        duration: 2000,
      })
      .then((toast) => toast.present());
  }

  openAbout() {
    this.modalController
      .create({
        component: AboutComponent,
      })
      .then((modal) => modal.present());
  }
}
