import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-traders',
  templateUrl: './traders.component.html',
  styleUrls: ['./traders.component.css'],
})
export class TradersComponent implements OnInit {
  traders: any[] = []; // Initialize an empty array to store traders' data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // When the component initializes...
    this.http.get<any[]>('http://localhost:3000/traders').subscribe((data) => {
      // Use the HttpClient to make an HTTP GET request to fetch traders' data
      this.traders = data; // Assign the fetched traders' data to the 'traders' array
    });
  }
}
