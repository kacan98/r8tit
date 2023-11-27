import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupermarketsPage } from './supermarkets.page';

const routes: Routes = [
  {
    path: '',
    component: SupermarketsPage,
  },
  {
    path: 'details/:supermarketId',
    loadChildren: () =>
      import('../../shared/details-page/details.module').then(
        (m) => m.DetailsPageModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupermarketsTabRoutingModule {}
