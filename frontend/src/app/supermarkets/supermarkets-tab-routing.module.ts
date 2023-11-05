import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupermarketsPage } from './supermarkets.page';

const routes: Routes = [
  {
    path: '',
    component: SupermarketsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupermarketsTabRoutingModule {}
