import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient
      .post('http://localhost:5204/api/Auth/login', {
        email: 'k.cancara@gmail.com',
        password: '51355135',
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
