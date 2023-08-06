import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loggedTrader: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('http://localhost:3000/home', { withCredentials: true })
      .subscribe((response) => {
        console.log(response);
        this.loggedTrader = response;
      });
  }
}
