import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../shared/services/user/user.service';
import { User } from '../../shared/services/user/user.model';
import { Observable, of, tap } from 'rxjs';
import { ImageService } from '../../shared/services/image/image.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  currentUser$: Observable<User>;
  currentUserImage: Observable<SafeUrl> = of(
    'https://ionicframework.com/docs/img/demos/thumbnail.svg',
  );

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private imageService: ImageService,
  ) {
    this.currentUser$ = this.userService.getCurrentUser().pipe(
      tap((user) => {
        this.currentUserImage = this.imageService.getImage(user.imageId);
      }),
    );
  }

  signOut() {
    this.authService.signOut();
  }
}
