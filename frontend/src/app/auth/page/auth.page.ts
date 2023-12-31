import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {
  logOrRegOpen = false;
  currentForm?: 'login' | 'register';

  emailForLogin?: string;

  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private navController: NavController,
  ) {}

  ngOnInit() {
    const latestEmail = localStorage.getItem('latestEmailLogin');
    this.emailForLogin = latestEmail || undefined;
    this.subscriptions.push(
      this.authService.isSomeoneLoggedIn().subscribe((isSomeoneLoggedIn) => {
        if (isSomeoneLoggedIn) {
          void this.navController.navigateRoot('/tabs');
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  registrationSuccess(email: string) {
    this.currentForm = 'login';
    this.emailForLogin = email;
  }
}
