import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-traders',
  templateUrl: './traders.component.html',
  styleUrls: ['./traders.component.css'],
})
export class TradersComponent implements OnInit {
  traders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/traders').subscribe((data) => {
      this.traders = data;
    });
  }
}
