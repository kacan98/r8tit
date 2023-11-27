import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private navController: NavController,
  ) {}

  ngOnInit() {}

  logIn() {
    const { email, password } = this.form.value;
    if (!email || !password) return;
    this.authService.logIn(email, password).subscribe({
      next: () => {
        void this.navController.navigateForward('/tabs');
      },
    });
  }
}
