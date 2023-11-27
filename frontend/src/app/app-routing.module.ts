import { inject, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [() => inject(AuthService).canActivate()],
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/page/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
