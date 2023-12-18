import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpClient) {}

  getCurrentUser() {
    return this.httpService.get<User>(
      'http://localhost:5204/api/User/currentUser',
    );
  }
}
