import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Output() registrationSuccessful = new EventEmitter<boolean>();

  form = new FormGroup(
    {
      username: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      email: new FormControl('', {
        validators: [
          Validators.required,
          //Validators.email sucks, so we're using regex instead
          (control) => {
            return control.value.match(
              /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
            ) !== null
              ? null
              : { invalidEmail: true };
          },
        ],
        nonNullable: true,
      }),
      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required]),
    },
    {
      validators: (control): ValidationErrors | null => {
        return control.value.password === control.value.passwordConfirm
          ? null
          : { passwordMismatch: true };
      },
    },
  );

  error?: ErrorMessage;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) {}

  async register() {
    const { username, email, password, passwordConfirm } = this.form.value;

    //None of these should ever be undefined here because of validators on the form
    if (!email || !password || !passwordConfirm || !username) {
      throw new Error('Something went wrong');
    }

    const loading = await this.loadingController.create({
      message: 'Creating an account...',
    });

    await loading.present();

    this.authService
      .register(username, email, password, passwordConfirm)
      .subscribe({
        next: () => {
          loading.dismiss();

          this.toastController
            .create({
              message: 'Registration successful',
              duration: 3000,
              color: 'success',
            })
            .then((toast) => {
              toast.present();
            });

          this.registrationSuccessful.emit(true);
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
