import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { LoadingController, NavController } from '@ionic/angular';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', [Validators.required]),
  });

  error?: ErrorMessage;

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private loadingController: LoadingController,
  ) {}

  async logIn() {
    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await loading.present();

    const { email, password } = this.form.value;
    if (!email || !password) return;
    this.authService.logIn(email, password).subscribe({
      next: () => {
        loading.dismiss();
        void this.navController.navigateForward('/tabs');
      },
      error: (error) => {
        loading.dismiss();
        if (error.status === 0) {
          this.error = {
            header: 'Error',
            text: 'Could not connect to the backend',
          };
        } else {
          this.error = {
            header: 'Error',
            text: error.message,
          };
        }
      },
    });
  }
}
