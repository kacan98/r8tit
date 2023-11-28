import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';
import { AuthPageRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [AuthPage, LoginComponent, RegisterComponent],
})
export class AuthPageModule {}
