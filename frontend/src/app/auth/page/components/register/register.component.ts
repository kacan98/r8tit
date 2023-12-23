import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  @Output() registrationSuccessful = new EventEmitter<{ email: string }>();

  passwordValidators: {
    name: string;
    validator: ValidatorFn;
    errorName: string;
  }[] = [
    {
      name: 'At least 6 characters',
      errorName: 'tooShort',
      validator: generateValidator('tooShort', /^.{6,}$/),
    },
    {
      name: 'At least one number',
      errorName: 'noNumber',
      validator: generateValidator('noNumber', /[0-9]/),
    },
    {
      name: 'At least one uppercase letter',
      errorName: 'noUppercase',
      validator: generateValidator('noUppercase', /[A-Z]/),
    },
    {
      name: 'At least one lowercase letter',
      errorName: 'noLowercase',
      validator: generateValidator('noLowercase', /[a-z]/),
    },
    {
      name: 'At least one special character',
      errorName: 'noSpecialCharacter',
      validator: generateValidator('noSpecialCharacter', /[^A-Za-z0-9]/),
    },
  ];

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
      password: new FormControl('', [
        Validators.required,
        ...this.passwordValidators.map(({ validator }) => validator),
      ]),
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

  subscriptions: Subscription[] = [];

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

    this.subscriptions.push(
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

            this.registrationSuccessful.emit({ email });
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
        }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}

export const generateValidator = (
  nameOfError: string,
  regex: RegExp,
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value.match(regex) !== null ? null : { [nameOfError]: true };
  };
};
